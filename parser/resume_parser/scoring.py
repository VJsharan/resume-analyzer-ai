"""
Resume scoring logic for detailed analytics
"""
import re

def calculate_tone_score(text: str) -> dict:
    """
    Analyze tone and style of resume
    Returns score out of 100 and feedback
    """
    score = 70  # Base score
    feedback = []
    
    # Check for action verbs
    action_verbs = ['developed', 'created', 'managed', 'led', 'designed', 'implemented', 
                    'achieved', 'improved', 'optimized', 'built', 'launched']
    action_count = sum(1 for verb in action_verbs if verb in text.lower())
    
    if action_count >= 5:
        score += 15
        feedback.append("Strong use of action verbs")
    elif action_count >= 3:
        score += 10
    else:
        feedback.append("Add more action-oriented language")
        
    # Check for quantifiable achievements
    numbers = re.findall(r'\d+%|\d+\+', text)
    if len(numbers) >= 3:
        score += 15
        feedback.append("Good use of quantifiable metrics")
    else:
        feedback.append("Include more quantifiable achievements")
        
    return {
        "score": min(score, 100),
        "feedback": feedback,
        "status": "Strong" if score >= 80 else "Needs Work" if score < 60 else "Good"
    }

def calculate_content_score(extracted_skills: list, text: str) -> dict:
    """
    Evaluate content quality and relevance
    """
    score = 60  # Base score
    feedback = []
    
    # Skills diversity
    if len(extracted_skills) >= 10:
        score += 20
        feedback.append("Comprehensive skill coverage")
    elif len(extracted_skills) >= 5:
        score += 10
    else:
        feedback.append("Add more relevant skills")
        
    # Check for project mentions
    project_keywords = ['project', 'developed', 'built', 'created']
    project_mentions = sum(1 for kw in project_keywords if kw in text.lower())
    
    if project_mentions >= 3:
        score += 20
        feedback.append("Strong project descriptions")
    else:
        feedback.append("Include more project details")
        
    return {
        "score": min(score, 100),
        "feedback": feedback,
        "status": "Strong" if score >= 75 else "Needs Work" if score < 60 else "Good"
    }

def calculate_structure_score(text: str) -> dict:
    """
    Analyze resume structure and formatting
    """
    score = 75  # Base score (PDF parsing suggests decent structure)
    feedback = []
    
    # Check for section headers
    sections = ['education', 'experience', 'skills', 'projects']
    found_sections = sum(1 for section in sections if section in text.lower())
    
    if found_sections >= 3:
        score += 15
        feedback.append("Well-organized sections")
    else:
        feedback.append("Add standard resume sections")
        
    # Check length (ideal is 400-800 words)
    word_count = len(text.split())
    if 400 <= word_count <= 800:
        score += 10
        feedback.append("Appropriate length")
    elif word_count < 400:
        feedback.append("Resume may be too brief")
    else:
        feedback.append("Consider condensing content")
        
    return {
        "score": min(score, 100),
        "feedback": feedback,
        "status": "Strong" if score >= 80 else "Needs Work" if score < 65 else "Good"
    }

def calculate_ats_score(extracted_skills: list, matched_skills: list, text: str) -> dict:
    """
    Calculate ATS compatibility score
    """
    base_score = 60
    
    # Keyword density
    if len(matched_skills) >= 5:
        base_score += 20
    elif len(matched_skills) >= 3:
        base_score += 10
        
    # Clean formatting (no special characters that break ATS)
    special_chars = len(re.findall(r'[^\w\s\-.,@()]', text))
    if special_chars < 10:
        base_score += 15
    elif special_chars < 20:
        base_score += 10
        
    # Standard section headers
    if 'experience' in text.lower() and 'education' in text.lower():
        base_score += 5
        
    return {
        "score": min(base_score, 100),
        "status": "Excellent" if base_score >= 80 else "Good" if base_score >= 65 else "Needs Improvement"
    }

def generate_improvement_tips(tone_data: dict, content_data: dict, structure_data: dict, 
                               missing_skills: list) -> list:
    """
    Generate actionable improvement tips based on analysis
    """
    tips = []
    
    # From tone analysis
    if tone_data['score'] < 80:
        tips.extend([
            {"category": "Tone & Style", "tip": fb, "priority": "medium"} 
            for fb in tone_data['feedback']
        ])
        
    # From content analysis
    if content_data['score'] < 75:
        tips.extend([
            {"category": "Content", "tip": fb, "priority": "high"} 
            for fb in content_data['feedback']
        ])
        
    # From structure
    if structure_data['score'] < 80:
        tips.extend([
            {"category": "Structure", "tip": fb, "priority": "medium"} 
            for fb in structure_data['feedback']
        ])
        
    # Skills-based tips
    if len(missing_skills) > 0:
        priority_skills = missing_skills[:3]  # Top 3 missing
        for skill in priority_skills:
            tips.append({
                "category": "Skills",
                "tip": f"Add '{skill}' to your skillset - highly demanded for this role",
                "priority": "high"
            })
            
    return tips
