# AI-based Resume Analyzer & Career Coach 📄🚀

A modern, full-stack AI application that helps students and job seekers optimize their resumes for their dream careers. It analyzes resumes against specific job roles, provides ATS scores, identifies skill gaps, and offers actionable, data-driven feedback.

---

## 🚀 Features

- **🔍 AI-Powered Analysis**: Instantly analyzes resumes against target job roles to identify matched and missing skills.
- **📊 Smart Scoring System**:
  - **Overall Score**: Weighted average based on industry standards.
  - **Tone & Style**: Evaluates action verbs and quantifiable achievements.
  - **Content Quality**: Checks for diverse skills and project depth.
  - **Structure Check**: Validates sections and optimal length.
- **🤖 ATS Compatibility Check**: Simulates Applicant Tracking Systems to ensure your resume is parseable.
- **💡 Actionable Insights**: Provides specific, prioritized tips to improve your resume immediately.
- **⚡ Modern UI/UX**:
  - **Glassmorphism Design**: Premium, clean interface with smooth animations.
  - **Interactive Result Dashboard**: Visual breakdown of all scores.
  - **Drag & Drop Upload**: Seamless file handling.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (with custom glassmorphism utilities)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Typography**: Google Sans + Open Sans
- **HTTP Client**: Axios

### Backend

- **Framework**: FastAPI (Python)
- **NLP Processing**: fitz (PyMuPDF) for text extraction
- **Data Analysis**: scikit-learn (TF-IDF & Cosine Similarity)
- **Pattern Matching**: RegEx for structural analysis

---

## 📦 Project Structure

```
resume-analyzer-ai/
├── frontend-college/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── ResultsDashboard.jsx
│   │   │   └── UploadSection.jsx
│   │   ├── assets/
│   │   │   ├── resume-scan.gif
│   │   │   └── resume-scan-2.gif
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── parser/
│   ├── main.py
│   ├── resume_parser/
│   │   ├── pipeline.py
│   │   ├── scoring.py
│   │   ├── matcher.py
│   │   ├── pdf_extractor.py
│   │   └── skill_extractor.py
│   ├── data/
│   │   ├── job_skills.json
│   │   ├── job_alias.json
│   │   └── skills.json
│   ├── uploads/
│   ├── requirements.txt
│   └── temptest.py
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+

### 1. Backend Setup

```bash
cd parser
pip install -r requirements.txt
uvicorn main:app --reload
```

_Server will start at http://127.0.0.1:8000_

### 2. Frontend Setup

```bash
cd frontend-college
npm install
npm run dev
```

_App will open at http://localhost:5173_

---

## 📝 Usage Guide

1. **Select Role**: Choose your target job title (e.g., "Full Stack Developer").
2. **Upload**: Drag and drop your PDF resume.
3. **Analyze**: Click "Analyze Resume" to let the AI process your document.
4. **Review**:
   - Check your **ATS Score** to ensure parsability.
   - Review **Missing Skills** to see what you need to add.
   - Follow **Action Plan** tips to improve your content and tone.

---

## 🎯 Future Roadmap

- [ ] **LLM Integration**: Use Gemini/GPT-4 for rewriting suggestions.
- [ ] **Real-Time Jobs**: Fetch live job descriptions from LinkedIn.
- [ ] **Resume Builder**: AI-assisted resume creation tool.
- [ ] **Auth System**: User accounts to save history.

---

## 🤝 Contribution

Contributions are welcome! Please fork the repository and create a pull request for any feature enhancements.

---
