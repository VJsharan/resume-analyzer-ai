from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(resume_text, job_skills):
    """
    Calculate similarity between resume text and job skills using TF-IDF
    """
    # Create a "document" from job skills
    job_desc_text = " ".join(job_skills)
    
    documents = [resume_text, job_desc_text]
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(documents)
    
    # Calculate cosine similarity between the two documents
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return round(similarity[0][0] * 100, 2)

def calculate_gap(extracted_skills, job_skills):
    """
    Identify missing skills and match percentage based on sets
    """
    resume_set = set([s.lower() for s in extracted_skills])
    job_set = set([s.lower() for s in job_skills])
    
    matched = resume_set.intersection(job_set)
    missing = job_set.difference(resume_set)
    
    match_percentage = len(matched) / len(job_set) * 100 if job_set else 0
    
    return {
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "match_percentage": round(match_percentage, 2)
    }
