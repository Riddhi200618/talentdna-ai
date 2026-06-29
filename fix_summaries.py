import requests

BASE = "https://talentdna-ai.onrender.com/api"

fixes = [
    {
        "id": 3,
        "summary": "Priya is a self-taught Diamond candidate whose TalentDNA score of 85.5 far exceeds her pedigree score of 35. Strong open source contributions and real-world project impact make her an exceptional find."
    },
    {
        "id": 4,
        "summary": "Sneha is a Tier3 college graduate whose TalentDNA score of 66 significantly exceeds her pedigree of 50. Her self-taught React and Node.js skills and personal projects show strong initiative beyond her formal education."
    },
    {
        "id": 5,
        "summary": "Rohan is a Tier3 graduate who taught himself machine learning independently. His TalentDNA score of 60.93 exceeds his pedigree score of 50, driven by strong project quality and learning velocity."
    }
]

for fix in fixes:
    resp = requests.patch(
        f"{BASE}/candidate/{fix['id']}/scores",
        json={"ai_summary": fix["summary"]},
        timeout=30
    )
    print(f"Candidate {fix['id']}: {resp.status_code}")