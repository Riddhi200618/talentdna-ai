from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CandidateCreate(BaseModel):
    name: str
    college: str
    college_tier: str       # "Tier1" | "Tier2" | "Tier3" | "SelfTaught"
    resume_text: Optional[str] = None
    github_handle: Optional[str] = None


class ScoreBreakdown(BaseModel):
    project_score: float
    velocity_score: float
    problem_score: float
    initiative_score: float
    talent_dna_score: float
    pedigree_score: float
    gap: float
    is_diamond: bool


class CandidateResponse(BaseModel):
    id: int
    name: str
    college: str
    college_tier: str
    github_handle: Optional[str]
    scores: Optional[ScoreBreakdown]
    ai_summary: Optional[str]
    top_skills: Optional[List[str]]
    created_at: datetime

    class Config:
        from_attributes = True