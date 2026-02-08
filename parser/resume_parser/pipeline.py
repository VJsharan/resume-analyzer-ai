import os

from resume_parser.pdf_extractor import extract_text_from_pdf
from resume_parser.text_cleaner import clean_text
from resume_parser.skill_extractor import (
    load_job_skills,
    load_aliases,
    extract_skills,
)


def run_resume_pipeline(pdf_path: str):
    # parser/resume_parser → parser
    parser_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )

    data_dir = os.path.join(parser_dir, "data")

    skills_path = os.path.join(data_dir, "job_skills.json")
    alias_path = os.path.join(data_dir, "job_alias.json")

    if not os.path.exists(skills_path):
        raise FileNotFoundError(f"Missing job_skills.json at {skills_path}")

    if not os.path.exists(alias_path):
        raise FileNotFoundError(f"Missing job_alias.json at {alias_path}")

    raw_text = extract_text_from_pdf(pdf_path)
    cleaned_text = clean_text(raw_text)

    skills = load_job_skills(skills_path)
    aliases = load_aliases(alias_path)

    extracted_skills = extract_skills(cleaned_text, skills, aliases)

    return {
        "extracted_skills": extracted_skills
    }
