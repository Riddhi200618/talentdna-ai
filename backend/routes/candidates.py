from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import CandidateCreate, CandidateResponse
from typing import List

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/candidate")
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    # Day 2 and 3 — AI pipeline and scoring goes here
    return {"message": "endpoint ready", "status": "pipeline not wired yet"}


@router.get("/candidates")
def get_all_candidates(db: Session = Depends(get_db)):
    # Day 3 — returns all candidates sorted by TalentDNA score
    return {"message": "endpoint ready", "data": []}


@router.get("/diamonds")
def get_diamond_candidates(db: Session = Depends(get_db)):
    # Day 3 — returns only Diamond-flagged candidates
    return {"message": "endpoint ready", "data": []}


@router.get("/candidate/{candidate_id}")
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    # Day 4 — returns full breakdown for one candidate
    return {"message": "endpoint ready", "candidate_id": candidate_id}


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    # Day 4 — returns dashboard summary numbers
    return {
        "total_candidates": 0,
        "diamond_count": 0,
        "average_gap": 0
    }