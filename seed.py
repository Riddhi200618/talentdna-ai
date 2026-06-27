import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

candidates = [
    {
        "name": "Karan Vishwakarma",
        "college": "Self Taught",
        "college_tier": "SelfTaught",
        "resume_text": "No formal CS degree. Learned through YouTube and freeCodeCamp. Built 6 full stack projects including a SaaS product with 200 active users. Won 2 national hackathons. Active open source contributor.",
        "github_handle": "sindresorhus"
    },
    {
        "name": "Arjun Mehta",
        "college": "IIT Bombay",
        "college_tier": "Tier1",
        "resume_text": "Final year CSE student at IIT Bombay. Interned at Google Summer 2024. Skills: C++, Python, Machine Learning, System Design. Published research paper on NLP.",
        "github_handle": "torvalds"
    },
    {
        "name": "Riya Sharma",
        "college": "MIT Pune",
        "college_tier": "Tier2",
        "resume_text": "Python developer with 2 years experience. Skills: Django, React, PostgreSQL. Completed internship at a mid-size startup. Built a food delivery web app and a college event management system.",
        "github_handle": "kelseyhightower"
    },
    {
        "name": "Priya Nair",
        "college": "Self Taught",
        "college_tier": "SelfTaught",
        "resume_text": "Dropout from Tier3 college. Self taught developer. Built an e-commerce platform from scratch with 500 daily users. Contributes to open source React libraries. Won Smart India Hackathon 2023.",
        "github_handle": "yyx990803"
    },
    {
        "name": "Rahul Gupta",
        "college": "NIT Trichy",
        "college_tier": "Tier1",
        "resume_text": "NIT Trichy graduate. Interned at Flipkart. Experience in Java, Spring Boot, Microservices. Built a distributed payment system during internship.",
        "github_handle": "antirez"
    },
    {
        "name": "Sneha Patil",
        "college": "Pune University",
        "college_tier": "Tier3",
        "resume_text": "BCA graduate from local college. No internship. Self learned React and Node.js. Built 4 personal projects including a real-time chat app and a job portal clone.",
        "github_handle": "addyosmani"
    },
    {
        "name": "Vikram Reddy",
        "college": "BITS Pilani",
        "college_tier": "Tier1",
        "resume_text": "BITS Pilani dual degree. Research internship at Microsoft Research. Published 2 papers on distributed systems. Strong in Go, Rust, and Kubernetes.",
        "github_handle": "bradfitz"
    },
    {
        "name": "Anjali Desai",
        "college": "DJ Sanghvi",
        "college_tier": "Tier2",
        "resume_text": "DJ Sanghvi engineering graduate. Interned at a fintech startup. Skills: Python, FastAPI, PostgreSQL, Docker. Built an automated trading bot as a side project.",
        "github_handle": "kennethreitz"
    },
    {
        "name": "Rohan Sharma",
        "college": "Indore Institute of Science",
        "college_tier": "Tier3",
        "resume_text": "Tier3 college graduate from Indore. No internships. Taught himself machine learning from Coursera and fast.ai. Built an image classification model deployed on AWS Lambda with 1000 daily requests.",
        "github_handle": "fastai"
    },
    {
        "name": "Meera Iyer",
        "college": "IIT Madras",
        "college_tier": "Tier1",
        "resume_text": "IIT Madras CSE graduate. Interned at Amazon. Strong problem solving — top 1% on LeetCode. Experience in system design, distributed systems, and backend engineering.",
        "github_handle": "gvanrossum"
    }
]


def seed():
    print(f"Seeding {len(candidates)} candidates...\n")

    for i, candidate in enumerate(candidates, 1):
        print(f"[{i}/{len(candidates)}] Adding {candidate['name']}...")
        try:
            resp = requests.post(f"{BASE_URL}/candidate", json=candidate, timeout=60)
            if resp.status_code == 200:
                data = resp.json()
                scores = data.get("scores", {})
                print(f"  TalentDNA: {scores.get('talent_dna_score')} | Pedigree: {scores.get('pedigree_score')} | Diamond: {scores.get('is_diamond')}")
            else:
                print(f"  Error {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"  Failed: {e}")

        # Small delay to avoid hammering Gemini API
        time.sleep(2)

    print("\nSeeding complete. Run GET /api/candidates to verify.")


if __name__ == "__main__":
    seed()