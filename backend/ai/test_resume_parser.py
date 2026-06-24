import time
from prompts import parse_resume

files = [
    "resume2.txt"
]

for file in files:
    print("\n" + "=" * 50)
    print(f"Testing {file}")
    print("=" * 50)

    with open(
        f"sample_resumes/{file}",
        "r",
        encoding="utf-8"
    ) as f:
        resume = f.read()

    result = parse_resume(resume)
    print(result)

    time.sleep(40)