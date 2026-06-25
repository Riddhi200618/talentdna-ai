from prompts import analyze_github_project

readme = """
# AI Resume Analyzer

A FastAPI application that analyzes resumes
using Gemini AI and generates structured
candidate profiles.

Built with:
- FastAPI
- SQLite
- Gemini API

Features:
- Resume parsing
- Candidate ranking
- Recruiter dashboard
"""

result = analyze_github_project(
    "AI Resume Analyzer",
    readme
)

print(result)