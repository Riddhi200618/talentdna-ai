import requests
import time

BASE = 'https://talentdna-ai.onrender.com/api'

candidates = [
    {'name':'Karan Vishwakarma','college':'Self Taught','college_tier':'SelfTaught','resume_text':'No formal CS degree. Learned through YouTube and freeCodeCamp. Built 6 full stack projects including a SaaS product with 200 active users. Won 2 national hackathons.','github_handle':'sindresorhus'},
    {'name':'Arjun Mehta','college':'IIT Bombay','college_tier':'Tier1','resume_text':'Final year CSE student at IIT Bombay. Interned at Google Summer 2024. Skills: C++, Python, Machine Learning, System Design.','github_handle':'torvalds'},
    {'name':'Priya Nair','college':'Self Taught','college_tier':'SelfTaught','resume_text':'Dropout from Tier3 college. Self taught developer. Built an e-commerce platform with 500 daily users. Won Smart India Hackathon 2023.','github_handle':'yyx990803'},
    {'name':'Sneha Patil','college':'Pune University','college_tier':'Tier3','resume_text':'BCA graduate. No internship. Self learned React and Node.js. Built 4 personal projects.','github_handle':'addyosmani'},
    {'name':'Rohan Sharma','college':'Indore Institute of Science','college_tier':'Tier3','resume_text':'Tier3 college graduate. No internships. Taught himself machine learning from Coursera.','github_handle':'karpathy'},
    {'name':'Riya Sharma','college':'MIT Pune','college_tier':'Tier2','resume_text':'Python developer with 2 years experience. Skills: Django, React, PostgreSQL. Internship at a mid-size startup.','github_handle':'kelseyhightower'},
    {'name':'Rahul Gupta','college':'NIT Trichy','college_tier':'Tier1','resume_text':'NIT Trichy graduate. Interned at Flipkart. Experience in Java, Spring Boot, Microservices.','github_handle':'antirez'},
    {'name':'Vikram Reddy','college':'BITS Pilani','college_tier':'Tier1','resume_text':'BITS Pilani dual degree. Research internship at Microsoft Research. Published 2 papers on distributed systems.','github_handle':'bradfitz'},
    {'name':'Anjali Desai','college':'DJ Sanghvi','college_tier':'Tier2','resume_text':'DJ Sanghvi engineering graduate. Interned at a fintech startup. Skills: Python, FastAPI, PostgreSQL, Docker.','github_handle':'kennethreitz'},
    {'name':'Meera Iyer','college':'IIT Madras','college_tier':'Tier1','resume_text':'IIT Madras CSE graduate. Interned at Amazon. Strong problem solving top 1% on LeetCode.','github_handle':'gvanrossum'}
]

for i, c in enumerate(candidates, 1):
    print(f'[{i}/10] Adding {c["name"]}...')
    try:
        r = requests.post(f'{BASE}/candidate', json=c, timeout=90)
        print(f'  Status: {r.status_code}')
    except Exception as e:
        print(f'  Error: {e}')
    time.sleep(3)

print('Done')