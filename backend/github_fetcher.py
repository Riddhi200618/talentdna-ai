import requests
from datetime import datetime, timezone

def fetch_github_metrics(github_handle: str) -> dict:
    if not github_handle:
        return _empty_metrics()

    base_url = f"https://api.github.com/users/{github_handle}"
    headers = {"Accept": "application/vnd.github.v3+json"}

    try:
        user_resp = requests.get(base_url, headers=headers, timeout=10)
        if user_resp.status_code != 200:
            return _empty_metrics()

        repos_resp = requests.get(
            f"{base_url}/repos?per_page=100&sort=updated",
            headers=headers,
            timeout=10
        )
        if repos_resp.status_code != 200:
            return _empty_metrics()

        repos = repos_resp.json()

        if not repos:
            return _empty_metrics()

        repo_count = len(repos)
        total_stars = sum(r.get("stargazers_count", 0) for r in repos)

        languages = list(set(
            r.get("language") for r in repos
            if r.get("language")
        ))

        descriptions = [
            r.get("description") or "" for r in repos
        ]
        avg_readme_length = int(
            sum(len(d) for d in descriptions) / max(len(descriptions), 1)
        ) * 20

        now = datetime.now(timezone.utc)
        recent_repos = []
        for r in repos:
            updated = r.get("updated_at")
            if updated:
                updated_dt = datetime.fromisoformat(
                    updated.replace("Z", "+00:00")
                )
                days_ago = (now - updated_dt).days
                if days_ago <= 90:
                    recent_repos.append(r)

        commit_frequency = len(recent_repos) * 3

        top_repos = sorted(
            repos,
            key=lambda r: r.get("stargazers_count", 0),
            reverse=True
        )[:3]

        top_repo_data = [
            {
                "name": r.get("name", ""),
                "description": r.get("description") or "",
                "language": r.get("language") or "",
                "stars": r.get("stargazers_count", 0)
            }
            for r in top_repos
        ]

        return {
            "repo_count": repo_count,
            "total_stars": total_stars,
            "languages": languages,
            "avg_readme_length": avg_readme_length,
            "commit_frequency_per_month": commit_frequency,
            "top_repos": top_repo_data
        }

    except Exception as e:
        print(f"GitHub API error: {e}")
        return _empty_metrics()


def _empty_metrics():
    return {
        "repo_count": 0,
        "total_stars": 0,
        "languages": [],
        "avg_readme_length": 0,
        "commit_frequency_per_month": 0,
        "top_repos": []
    }