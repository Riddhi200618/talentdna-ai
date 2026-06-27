# TalentDNA API Contract

Base URL: http://localhost:8000/api

## Endpoints

### GET /candidates
Returns all candidates sorted by TalentDNA score descending.

Response:
```json
{
  "total": 10,
  "candidates": [
    {
      "id": 1,
      "name": "Karan Vishwakarma",
      "college": "Self Taught",
      "college_tier": "SelfTaught",
      "github_handle": "sindresorhus",
      "talent_dna_score": 72.5,
      "pedigree_score": 35.0,
      "gap": 37.5,
      "is_diamond": true,
      "top_skills": ["React", "Node.js", "Python"],
      "ai_summary": "Strong practical builder..."
    }
  ]
}
```

### GET /diamonds
Returns only Diamond-flagged candidates sorted by gap descending.

Response:
```json
{
  "total": 3,
  "diamonds": [ ...same shape as candidates array... ]
}
```

### GET /candidate/:id
Returns full breakdown for one candidate.

Response:
```json
{
  "id": 1,
  "name": "Karan Vishwakarma",
  "scores": {
    "project_score": 75.0,
    "velocity_score": 80.0,
    "problem_score": 65.0,
    "initiative_score": 60.0,
    "talent_dna_score": 72.5,
    "pedigree_score": 35.0,
    "gap": 37.5,
    "is_diamond": true
  },
  "analysis": {
    "ai_summary": "...",
    "top_skills": ["React", "Node.js"],
    "top_projects": [...]
  },
  "ats_would_see": {
    "college": "Self Taught",
    "pedigree_score": 35.0,
    "verdict": "Rejected"
  },
  "talentdna_sees": {
    "talent_dna_score": 72.5,
    "is_diamond": true,
    "verdict": "Diamond — Surface Immediately"
  }
}
```

### GET /stats
Response:
```json
{
  "total_candidates": 10,
  "diamond_count": 3,
  "average_gap": 12.4
}
```