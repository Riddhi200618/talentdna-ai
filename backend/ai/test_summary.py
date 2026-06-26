from prompts import generate_candidate_summary

summary = generate_candidate_summary(
    talent_score=88,
    pedigree_score=60,
    github_score=92,
    resume_score=80,
    is_diamond=True
)

print(summary)