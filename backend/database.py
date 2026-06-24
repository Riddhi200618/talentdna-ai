from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./talentdna.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    college = Column(String, nullable=False)
    college_tier = Column(String, nullable=False)   # Tier1 / Tier2 / Tier3 / SelfTaught
    resume_text = Column(Text, nullable=True)
    github_handle = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, nullable=False)
    project_score = Column(Float, default=0)
    velocity_score = Column(Float, default=0)
    problem_score = Column(Float, default=0)
    initiative_score = Column(Float, default=0)
    talent_dna_score = Column(Float, default=0)
    pedigree_score = Column(Float, default=0)
    gap = Column(Float, default=0)                  # talent_dna_score - pedigree_score
    is_diamond = Column(Boolean, default=False)


class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, nullable=False)
    ai_summary = Column(Text, nullable=True)        # AI-generated recruiter summary
    top_skills = Column(Text, nullable=True)        # JSON string of skills array
    top_projects = Column(Text, nullable=True)      # JSON string of project summaries
    github_raw = Column(Text, nullable=True)        # Raw GitHub API response as JSON string
    resume_parsed = Column(Text, nullable=True)     # Raw AI resume parse result as JSON string