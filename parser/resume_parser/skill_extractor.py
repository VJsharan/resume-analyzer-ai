import json


def load_job_skills(path: str) -> set:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    skills = set()

    for role in data["roles"]:
        for skill in role.get("core_skills", []):
            skills.add(skill.lower())

        for skill in role.get("optional_skills", []):
            skills.add(skill.lower())

    return skills



def load_aliases(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def extract_skills(cleaned_text: str, skills: set, aliases: dict) -> list:
    found_skills = set()

    for skill in skills:
        if skill in cleaned_text:
            found_skills.add(skill)

    for alias, actual in aliases.items():
        if alias.lower() in cleaned_text:
            found_skills.add(actual.lower())

    return sorted(found_skills)
