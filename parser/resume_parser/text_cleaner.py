import re


def clean_text(text: str) -> str:
    """
    Cleans resume text for NLP processing
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()
