import pymupdf  # PyMuPDF


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts raw text from a PDF resume
    """
    doc = pymupdf.open(pdf_path)
    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()
    return text
