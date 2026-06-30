import time
from backend.database import SessionLocal, Candidate, Score, Analysis
from backend.github_fetcher import fetch_github_metrics
from backend.ai.prompts import parse_resume, analyze_github_project, generate_candidate_summary
from scoring.engine import evaluate_candidate_performance
import json

candidates = [
    {"name":"Karan Vishwakarma","college":"Self Taught","college_tier":"SelfTaught","resume_text":"No formal CS degree. Learned through YouTube and freeCodeCamp. Built 6 full stack projects including a SaaS product with 200 active users. Won 2 national hackathons.","github_handle":"sindresorhus"},
    {"name":"Arjun Mehta","college":"IIT Bombay","college_tier":"Tier1","resume_text":"Final year CSE student at IIT Bombay. Interned at Google Summer 2024. Skills: C++, Python, Machine Learning, System Design.","github_handle":"torvalds"},
    {"name":"Priya Nair","college":"Self Taught","college_tier":"SelfTaught","resume_text":"Dropout from Tier3 college. Self taught developer. Built an e-commerce platform with 500 daily users. Won Smart India Hackathon 2023.","github_handle":"yyx990803"},
    {"name":"Sneha Patil","college":"Pune University","college_tier":"Tier3","resume_text":"BCA graduate. No internship. Self learned React and Node.js. Built 4 personal projects.","github_handle":"addyosmani"},
    {"name":"Rohan Sharma","college":"Indore Institute of Science","college_tier":"Tier3","resume_text":"Tier3 college graduate. No internships. Taught himself machine learning from Coursera.","github_handle":"karpathy"},
    {"name":"Riya Sharma","college":"MIT Pune","college_tier":"Tier2","resume_text":"Python developer with 2 years experience. Skills: Django, React, PostgreSQL. Internship at a mid-size startup.","github_handle":"kelseyhightower"},
    {"name":"Rahul Gupta","college":"NIT Trichy","college_tier":"Tier1","resume_text":"NIT Trichy graduate. Interned at Flipkart. Experience in Java, Spring Boot, Microservices.","github_handle":"antirez"},
    {"name":"Vikram Reddy","college":"BITS Pilani","college_tier":"Tier1","resume_text":"BITS Pilani dual degree. Research internship at Microsoft Research. Published 2 papers on distributed systems.","github_handle":"bradfitz"},
    {"name":"Anjali Desai","college":"DJ Sanghvi","college_tier":"Tier2","resume_text":"DJ Sanghvi engineering graduate. Interned at a fintech startup. Skills: Python, FastAPI, PostgreSQL, Docker.","github_handle":"kennethreitz"},
    {"name":"Meera Iyer","college":"IIT Madras","college_tier":"Tier1","resume_text":"IIT Madras CSE graduate. Interned at Amazon. Strong problem solving top 1% on LeetCode.","github_handle":"gvanrossum"}
]

def run_seed():
    db = SessionLocal()

    for c in candidates:
        try:
            print(f"Seeding {c['name']}...")

            db_candidate = Candidate(
                name=c["name"], college=c["college"], college_tier=c["college_tier"],
                resume_text=c["resume_text"], github_handle=c["github_handle"]
            )
            db.add(db_candidate)
            db.commit()
            db.refresh(db_candidate)

            github_metrics = fetch_github_metrics(c["github_handle"]) if c["github_handle"] else {}
            resume_insights = parse_resume(c["resume_text"]) if c["resume_text"] else {
                "skills": [], "technologies": [], "education_tier": c["college_tier"],
                "has_internship": False, "company_quality_score": 0
            }

            project_summaries = []
            for repo in github_metrics.get("top_repos", [])[:2]:
                analysis = analyze_github_project(repo_name=repo["name"], readme_text=repo.get("description","No description"))
                project_summaries.append({"repo": repo["name"], "analysis": analysis})

            scores = evaluate_candidate_performance(
                college_tier=c["college_tier"], github_metrics=github_metrics, ai_resume_insights=resume_insights
            )

            summary = generate_candidate_summary(
                talent_score=scores["talent_dna_score"], pedigree_score=scores["pedigree_score"],
                github_score=scores["project_score"], resume_score=scores["initiative_score"],
                is_diamond=scores["is_diamond"]
            )

            db_score = Score(candidate_id=db_candidate.id, **scores)
            db.add(db_score)

            db_analysis = Analysis(
                candidate_id=db_candidate.id, ai_summary=summary,
                top_skills=json.dumps(resume_insights.get("skills", [])),
                top_projects=json.dumps(project_summaries),
                github_raw=json.dumps(github_metrics),
                resume_parsed=json.dumps(resume_insights)
            )
            db.add(db_analysis)
            db.commit()

            print(f"  Done: TalentDNA={scores['talent_dna_score']} Diamond={scores['is_diamond']}")
            time.sleep(2)

        except Exception as e:
            print(f"  Failed for {c['name']}: {e}")
            db.rollback()

    db.close()
    print("Auto-seed complete.")