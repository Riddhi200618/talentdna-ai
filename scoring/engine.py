"""
TalentDNA-AI Scoring Engine
Author: Person 4 (Data & Integration Engineer)
"""

from typing import Dict, Any

def calculate_pedigree_score(college_tier: str) -> float:
    tier_map = {
        "Tier1": 95.0,
        "Tier2": 75.0,
        "Tier3": 50.0,
        "SelfTaught": 35.0
    }
    return tier_map.get(college_tier, 40.0)

def compute_project_score(repo_count: int) -> float:
    if repo_count <= 0:
        return 0.0
    return min((repo_count / 20.0) * 100.0, 100.0)

def compute_velocity_score(commit_frequency: int) -> float:
    if commit_frequency <= 0:
        return 0.0
    return min((commit_frequency / 40.0) * 100.0, 100.0)

def compute_problem_score(languages_count: int, avg_readme_length: int) -> float:
    lang_score = min((languages_count / 4.0) * 50.0, 50.0)
    readme_score = min((avg_readme_length / 2000.0) * 50.0, 50.0)
    return float(lang_score + readme_score)

def compute_initiative_score(stars: int, has_internship: bool, company_quality: int) -> float:
    star_score = min((stars / 50.0) * 40.0, 40.0)
    internship_score = 20.0 if has_internship else 0.0
    company_score = (company_quality / 10.0) * 40.0
    return float(star_score + internship_score + company_score)

def evaluate_candidate_performance(
    college_tier: str,
    github_metrics: Dict[str, Any],
    ai_resume_insights: Dict[str, Any]
) -> Dict[str, Any]:
    """Executes the vector mathematical logic for TalentDNA matching matrix."""
    repo_count = github_metrics.get("repo_count", 0)
    commit_freq = github_metrics.get("commit_frequency_per_month", 0)
    languages_count = len(github_metrics.get("languages", []))
    avg_readme = github_metrics.get("avg_readme_length", 0)
    stars = github_metrics.get("total_stars", 0)

    has_internship = ai_resume_insights.get("has_internship", False)
    company_quality = ai_resume_insights.get("company_quality_score", 0)

    project_score = round(compute_project_score(repo_count), 2)
    velocity_score = round(compute_velocity_score(commit_freq), 2)
    problem_score = round(compute_problem_score(languages_count, avg_readme), 2)
    initiative_score = round(compute_initiative_score(stars, has_internship, company_quality), 2)

    talent_dna_score = round(
        (0.30 * project_score) +
        (0.30 * velocity_score) +
        (0.20 * problem_score) +
        (0.20 * initiative_score),
        2
    )

    pedigree_score = round(calculate_pedigree_score(college_tier), 2)
    gap = round(talent_dna_score - pedigree_score, 2)

    is_diamond = False
    if college_tier in ["Tier3", "SelfTaught"] and talent_dna_score >= 75.0 and gap >= 20.0:
        is_diamond = True

    return {
        "project_score": project_score,
        "velocity_score": velocity_score,
        "problem_score": problem_score,
        "initiative_score": initiative_score,
        "talent_dna_score": talent_dna_score,
        "pedigree_score": pedigree_score,
        "gap": gap,
        "is_diamond": is_diamond
    }