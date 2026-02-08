import os
import sys

# Absolute path to parser directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Add parser directory to Python path
sys.path.insert(0, BASE_DIR)

from resume_parser.pipeline import run_resume_pipeline

resume_path = os.path.join(BASE_DIR, "sample_resumes", "sample_resume.pdf")

result = run_resume_pipeline(resume_path)
print(result)
