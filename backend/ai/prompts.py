import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def clean_json_response(text):

    text = text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "", 1)

    if text.startswith("```"):
        text = text.replace("```", "", 1)

    if text.endswith("```"):
        text = text[:-3]

    return json.loads(text.strip())

def parse_resume(resume_text):

    prompt = f"""
You are an expert recruiter.

Analyze the resume.

Return ONLY valid JSON.

Schema:

{{
  "skills": [],
  "technologies": [],
  "education_tier": "Tier1/Tier2/Tier3/SelfTaught",
  "has_internship": true,
  "company_quality_score": 1
}}

Rules:

1. Return ONLY valid JSON.
2. Never return markdown, code blocks, explanations, or extra text.
3. Never omit any field from the schema.
4. If information is missing, use the most reasonable default value.

Skills:

* Skills are broad competencies or domains.
* Examples: Machine Learning, Data Structures, Algorithms, Problem Solving, Web Development, Computer Vision, NLP, Database Design.

Technologies:

* Technologies are specific programming languages, frameworks, libraries, tools, or platforms.
* Examples: Python, Java, C++, React, FastAPI, TensorFlow, PyTorch, AWS, Docker, MySQL, MongoDB.

Education Tier:

* Tier1: IITs, NITs, BITS Pilani and other top nationally recognized institutes.
* Tier2: Well-known private universities and strong regional engineering colleges.
* Tier3: Other colleges and universities.
* SelfTaught: No formal degree or education information available.

Internship Detection:

* Set has_internship = true if any internship, industrial training, research internship, or work experience is mentioned.
* Otherwise set has_internship = false.

Company Quality Score:

* 0 = No internship or work experience.
* 1-3 = Small local companies or unknown organizations with limited information.
* 4-6 = Average companies, startups, service firms, or unknown companies.
* 7-8 = Well-known startups or established technology companies.
* 9-10 = Top-tier global companies such as Google, Microsoft, Amazon, Meta, Apple, NVIDIA, etc.

Output Requirements:

* skills and technologies must be arrays.
* has_internship must be a boolean.
* company_quality_score must be an integer from 0 to 10.
* Return exactly the schema requested and nothing else.

Resume:

{resume_text}
"""

    try:
        response = model.generate_content(prompt)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {
            "skills": [],
            "technologies": [],
            "education_tier": "Unknown",
            "has_internship": False,
            "company_quality_score": 0
        }

    return clean_json_response(response.text)

def analyze_github_project(repo_name, readme_text):

    prompt = f"""
You are a senior software engineer and technical recruiter.

Analyze this GitHub project.

Return ONLY valid JSON.

Schema:

{{
  "complexity_score": 1,
  "project_type": "clone",
  "summary": ""
}}

Rules:

1. Return only valid JSON.
2. Never return markdown or explanations.
3. Never omit fields.

Evaluate:
- Technical depth
- Architecture complexity
- Real-world usefulness
- Production readiness
- Originality

A simple CRUD app or tutorial clone should score lower.
Projects with multiple services, AI integration, deployment, or significant engineering effort should score higher.

complexity_score:
- 1-3 = beginner project
- 4-6 = intermediate project
- 7-8 = advanced project
- 9-10 = production-grade project

project_type MUST be exactly one of:
clone, utility, production, opensource

project_type definitions:

clone = recreation of an existing application or tutorial

utility = standalone tool, automation, dashboard, tracker, or business application

production = scalable multi-component system intended for real-world deployment

opensource = community-driven reusable software library/framework/platform

Do not create any other values.

summary:
- Maximum 20 words.
- Exactly one sentence.
- Describe what the project does.
- Do not mention the complexity score.

Repository Name:
{repo_name}

README:
{readme_text}
"""

    try:
        response = model.generate_content(prompt)

    except Exception as e:
        print(f"Gemini API Error: {e}")

        return {
            "complexity_score": 0,
            "project_type": "unknown",
            "summary": "Unable to analyze project."
        }

    return clean_json_response(response.text)

def generate_candidate_summary(
    talent_score,
    pedigree_score,
    github_score,
    resume_score,
    is_diamond
):

    prompt = f"""
You are an experienced technical recruiter.

Write a short recruiter-facing summary.

Return ONLY plain text.

Candidate Data

TalentDNA Score: {talent_score}

Pedigree Score: {pedigree_score}

GitHub Score: {github_score}

Resume Score: {resume_score}

Diamond Candidate: {is_diamond}

Rules:

- Maximum 2 sentences.
- Maximum 40 words.
- Mention the strongest technical signals.
- Mention if TalentDNA exceeds pedigree.
- Do not exaggerate.
- Do not use bullet points.
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Candidate analysis unavailable."