from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.database import Candidate, Score, Analysis
from backend.models import CandidateCreate, CandidateResponse
from typing import List
import json

# Integration Modules (Added for Day 2 Integration)
from backend.ai.prompts import parse_resume
from scoring.engine import evaluate_candidate_performance

router = APIRouter()


@router.post("/candidate")
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    # Step 1: Save the candidate basic info to the candidates table
    db_candidate = Candidate(
        name=candidate.name,
        college=candidate.college,
        college_tier=candidate.college_tier,
        resume_text=candidate.resume_text,
        github_handle=candidate.github_handle
    )
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)  # This populates db_candidate.id after insert

    # Step 2: Process AI Resume Insights (Person 1 Layer integration)
    try:
        ai_insights = parse_resume(candidate.resume_text)
    except Exception:
        ai_insights = {
            "skills": [], 
            "technologies": [], 
            "education_tier": candidate.college_tier,
            "has_internship": False, 
            "company_quality_score": 0
        }

    # Step 3: Fetch GitHub Metrics (Person 3 Fallback/Mock Interceptor for Day 2 testing)
    mock_github_metrics = {
        "repo_count": 12,
        "total_stars": 35,
        "languages": ai_insights.get("technologies", ["Python", "JavaScript"]),
        "commit_frequency_per_month": 25,
        "avg_readme_length": 1500
    }

    # Step 4: Process Scoring Engine pipeline logic (Person 4 Core Execution Matrix)
    scores = evaluate_candidate_performance(
        college_tier=candidate.college_tier,
        github_metrics=mock_github_metrics,
        ai_resume_insights=ai_insights
    )

    # Step 5: Create and populate the score row for this candidate
    db_score = Score(
        candidate_id=db_candidate.id,
        project_score=scores["project_score"],
        velocity_score=scores["velocity_score"],
        problem_score=scores["problem_score"],
        initiative_score=scores["initiative_score"],
        talent_dna_score=scores["talent_dna_score"],
        pedigree_score=scores["pedigree_score"],
        gap=scores["gap"],
        is_diamond=scores["is_diamond"]
    )
    db.add(db_score)

    # Step 6: Create and populate the analysis row for this candidate
    db_analysis = Analysis(
        candidate_id=db_candidate.id,
        ai_summary=f"Automated evaluation processed for {candidate.name}.",
        top_skills=json.dumps(ai_insights.get("skills", [])),
        top_projects=None,
        github_raw=json.dumps(mock_github_metrics),
        resume_parsed=json.dumps(ai_insights)
    )
    db.add(db_analysis)

    db.commit()

    return {
        "message": "Candidate onboarded and processed successfully",
        "candidate_id": db_candidate.id,
        "name": db_candidate.name,
        "scores": scores,
        "status": "processed"
    }


@router.get("/candidates")
def get_all_candidates(db: Session = Depends(get_db)):
    # Join candidates with their scores
    candidates = db.query(Candidate).all()

    result = []
    for c in candidates:
        score = db.query(Score).filter(Score.candidate_id == c.id).first()
        analysis = db.query(Analysis).filter(Analysis.candidate_id == c.id).first()

        top_skills = []
        if analysis and analysis.top_skills:
            try:
                top_skills = json.loads(analysis.top_skills)
            except:
                top_skills = []

        result.append({
            "id": c.id,
            "name": c.name,
            "college": c.college,
            "college_tier": c.college_tier,
            "github_handle": c.github_handle,
            "talent_dna_score": score.talent_dna_score if score else 0,
            "pedigree_score": score.pedigree_score if score else 0,
            "gap": score.gap if score else 0,
            "is_diamond": score.is_diamond if score else False,
            "top_skills": top_skills,
            "ai_summary": analysis.ai_summary if analysis else None
        })

    # Sort by TalentDNA score descending
    result.sort(key=lambda x: x["talent_dna_score"], reverse=True)

    return {
        "total": len(result),
        "candidates": result
    }


@router.get("/diamonds")
def get_diamond_candidates(db: Session = Depends(get_db)):
    # Only return candidates where is_diamond is True
    diamond_scores = db.query(Score).filter(Score.is_diamond == True).all()

    result = []
    for score in diamond_scores:
        candidate = db.query(Candidate).filter(Candidate.id == score.candidate_id).first()
        analysis = db.query(Analysis).filter(Analysis.candidate_id == score.candidate_id).first()

        if not candidate:
            continue

        top_skills = []
        if analysis and analysis.top_skills:
            try:
                top_skills = json.loads(analysis.top_skills)
            except:
                top_skills = []

        result.append({
            "id": candidate.id,
            "name": candidate.name,
            "college": candidate.college,
            "college_tier": candidate.college_tier,
            "github_handle": candidate.github_handle,
            "talent_dna_score": score.talent_dna_score,
            "pedigree_score": score.pedigree_score,
            "gap": score.gap,
            "top_skills": top_skills,
            "ai_summary": analysis.ai_summary if analysis else None
        })

    # Sort by gap descending — biggest surprises first
    result.sort(key=lambda x: x["gap"], reverse=True)

    return {
        "total": len(result),
        "diamonds": result
    }


@router.get("/candidate/{candidate_id}")
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    score = db.query(Score).filter(Score.candidate_id == candidate_id).first()
    analysis = db.query(Analysis).filter(Analysis.candidate_id == candidate_id).first()

    top_skills = []
    if analysis and analysis.top_skills:
        try:
            top_skills = json.loads(analysis.top_skills)
        except:
            top_skills = []

    return {
        "id": candidate.id,
        "name": candidate.name,
        "college": candidate.college,
        "college_tier": candidate.college_tier,
        "github_handle": candidate.github_handle,
        "resume_text": candidate.resume_text,
        "scores": {
            "project_score": score.project_score if score else 0,
            "velocity_score": score.velocity_score if score else 0,
            "problem_score": score.problem_score if score else 0,
            "initiative_score": score.initiative_score if score else 0,
            "talent_dna_score": score.talent_dna_score if score else 0,
            "pedigree_score": score.pedigree_score if score else 0,
            "gap": score.gap if score else 0,
            "is_diamond": score.is_diamond if score else False
        },
        "analysis": {
            "ai_summary": analysis.ai_summary if analysis else None,
            "top_skills": top_skills,
            "top_projects": analysis.top_projects if analysis else None
        }
    }


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(Candidate).count()
    diamond_count = db.query(Score).filter(Score.is_diamond == True).count()

    all_scores = db.query(Score).all()
    if all_scores:
        average_gap = sum(s.gap for s in all_scores) / len(all_scores)
    else:
        average_gap = 0

    return {
        "total_candidates": total,
        "diamond_count": diamond_count,
        "average_gap": round(average_gap, 1)
    }


@router.patch("/candidate/{candidate_id}/scores")
def update_scores(candidate_id: int, scores: dict, db: Session = Depends(get_db)):
    score = db.query(Score).filter(Score.candidate_id == candidate_id).first()

    if not score:
        raise HTTPException(status_code=404, detail="Score record not found")

    for key, value in scores.items():
        if hasattr(score, key):
            setattr(score, key, value)

    db.commit()
    db.refresh(score)

    return {"message": "Scores updated", "candidate_id": candidate_id}