from fastapi import FastAPI, UploadFile, File, Form, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil
import os
import json
from typing import List
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

from resume_parser.pipeline import run_resume_pipeline
from resume_parser.matcher import calculate_gap, calculate_similarity
from resume_parser.skill_extractor import load_job_skills
from resume_parser.scoring import (
    calculate_tone_score,
    calculate_content_score,
    calculate_structure_score,
    calculate_ats_score,
    generate_improvement_tips
)
from resume_parser.pdf_extractor import extract_text_from_pdf

app = FastAPI(title="Resume Skill Gap Analyzer", version="1.0")

# Allow CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

DATA_DIR = os.path.join(BASE_DIR, "data")
SKILLS_PATH = os.path.join(DATA_DIR, "job_skills.json")

def get_job_skills_for_role(role_name: str):
    """
    Helper to fetch skills for a specific role from the dataset
    """
    if not os.path.exists(SKILLS_PATH):
        raise HTTPException(status_code=500, detail="Job skills dataset missing")
        
    with open(SKILLS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    # Search for role
    for role in data.get("roles", []):
        if role["role_name"].lower() == role_name.lower():
            # Combine core and optional skills
            all_skills = role.get("core_skills", []) + role.get("optional_skills", [])
            return all_skills
            
    return None

@app.get("/")
def read_root():
    return {"message": "Resume Analyzer API is running"}

@app.get("/job-roles")
def get_job_roles():
    """Return list of available job roles for the frontend dropdown"""
    if not os.path.exists(SKILLS_PATH):
        return {"roles": []}
        
    with open(SKILLS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    roles = [role["role_name"] for role in data.get("roles", [])]
    return {"roles": roles}

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...), 
    job_role: str = Form(...)
):
    """
    Main endpoint: Uploads resume, parses usage matches skills, returns comprehensive analysis.
    """
    # 1. Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Extract raw text for scoring
    try:
        raw_text = extract_text_from_pdf(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction error: {str(e)}")
        
    # 3. Run Pipeline (Extract skills)
    try:
        pipeline_result = run_resume_pipeline(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")
        
    extracted_skills = pipeline_result.get("extracted_skills", [])
    
    # 4. Get Target Skills for selected job role
    target_skills = get_job_skills_for_role(job_role)
    if not target_skills:
        raise HTTPException(status_code=404, detail=f"Job role '{job_role}' not found in database")
        
    # 5. Calculate Gap & Similarity
    gap_analysis = calculate_gap(extracted_skills, target_skills)
    
    # 6. Calculate detailed scores
    tone_score = calculate_tone_score(raw_text)
    content_score = calculate_content_score(extracted_skills, raw_text)
    structure_score = calculate_structure_score(raw_text)
    
    # Skills score is the match percentage
    skills_score = {
        "score": int(gap_analysis["match_percentage"]),
        "status": "Strong" if gap_analysis["match_percentage"] >= 70 else "Needs Work" if gap_analysis["match_percentage"] < 50 else "Good"
    }
    
    # 7. Calculate ATS score
    ats_score = calculate_ats_score(
        extracted_skills, 
        gap_analysis["matched_skills"], 
        raw_text
    )
    
    # 8. Calculate overall score (weighted average)
    overall_score = int(
        (tone_score["score"] * 0.2) +
        (content_score["score"] * 0.25) +
        (structure_score["score"] * 0.2) +
        (skills_score["score"] * 0.35)
    )
    
    # 9. Generate improvement tips
    improvement_tips = generate_improvement_tips(
        tone_score,
        content_score,
        structure_score,
        gap_analysis["missing_skills"]
    )
    
    # Clean up upload
    os.remove(file_path)
    
    return {
        "job_role": job_role,
        "overall_score": overall_score,
        "scores": {
            "tone_and_style": tone_score,
            "content": content_score,
            "structure": structure_score,
            "skills": skills_score
        },
        "ats_score": ats_score,
        "skills_analysis": {
            "matched_skills": gap_analysis["matched_skills"],
            "missing_skills": gap_analysis["missing_skills"],
            "match_percentage": gap_analysis["match_percentage"]
        },
        "improvement_tips": improvement_tips,
        "extracted_skills": extracted_skills,
        "raw_text": raw_text
    }

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    resume_text: str
    job_role: str
    history: List[ChatMessage] = []

@app.post("/chat")
async def chat_with_resume(request: ChatRequest, fastapi_req: Request):
    auth_header = fastapi_req.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header. Please provide your Gemini API key.")
    
    api_key = auth_header.split("Bearer ")[1].strip()
    if not api_key:
        raise HTTPException(status_code=401, detail="Gemini API key is required.")
        
    try:
        client = genai.Client(api_key=api_key)
        
        system_context = f"You are an expert career coach and ATS optimization specialist. The user uploaded their resume for a '{request.job_role}' role. Here is their resume text:\n\n{request.resume_text}\n\nUse this context to accurately assess their strengths, identify missing elements, and answer their related questions. Be concise and actionable."
        
        formatted_history = [
            types.Content(role="user", parts=[types.Part.from_text(text=system_context)]),
            types.Content(role="model", parts=[types.Part.from_text(text="Understood. I am ready to review the resume and answer any questions to provide actionable career coaching.")])
        ]
        
        for msg in request.history:
            role = "user" if msg.role == "user" else "model"
            formatted_history.append(types.Content(role=role, parts=[types.Part.from_text(text=msg.content)]))
            
        chat = client.chats.create(model='gemini-2.5-flash', history=formatted_history)
        response = chat.send_message(request.message)
        
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini Chat error: {str(e)}")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
