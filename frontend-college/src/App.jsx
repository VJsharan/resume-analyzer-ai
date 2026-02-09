import { useState } from "react";
import "./index.css";

export default function App() {
  const [resume, setResume] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="container">

      <div className="header">
        <h1>AI Resume Skill Gap Analyzer</h1>
        <p>Frontend Prototype – Final Year Project</p>
      </div>

      {!showDashboard && (
        <div className="card upload-box">
          <h2>Upload Your Resume</h2>
          <p>Analyze skills and get a learning roadmap</p>

          <input
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
          />

          <br />

          <button
            className="btn"
            disabled={!resume}
            onClick={() => setShowDashboard(true)}
          >
            Analyze Resume
          </button>

          <p style={{ fontSize: "12px", marginTop: "10px" }}>
            Supported formats: PDF, DOC, DOCX
          </p>
        </div>
      )}

      {showDashboard && (
        <div className="grid">

          <div className="card">
            <h3>Extracted Skills</h3>
            <div className="skill">Java</div>
            <div className="skill">Spring Boot</div>
            <div className="skill">SQL</div>
            <div className="skill">React</div>
          </div>

          <div className="card">
            <h3>Skill Gaps</h3>
            <div className="skill">Docker</div>
            <div className="skill">AWS</div>
            <div className="skill">System Design</div>
          </div>

          <div className="card">
            <h3>Learning Roadmap</h3>
            <p><b>Week 1:</b> HTML, CSS, JavaScript</p>
            <p><b>Week 2:</b> React Basics</p>
            <p><b>Week 3:</b> Advanced React</p>
            <p><b>Week 4:</b> Deployment & Interview Prep</p>
          </div>

        </div>
      )}

    </div>
  );
}
