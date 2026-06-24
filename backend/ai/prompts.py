import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


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

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    return json.loads(text)