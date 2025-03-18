from github import Github
import sys
import os
from dotenv import load_dotenv

load_dotenv()

def get_github_commits(repo_link,username):
    TOKEN = os.getenv("GITHUB_TOKEN")
    REPO_URL = repo_link  # Example: https://github.com/torvalds/linux
    USERNAME = username  # GitHub username or email

    # Extract owner and repo name from URL
    repo_parts = REPO_URL.rstrip("/").split("/")[-2:]
    REPO_NAME = "/".join(repo_parts)

    # Authenticate and access repo
    g = Github(TOKEN)
    repo = g.get_repo(REPO_NAME)

    # Fetch commits by the user
    commits = repo.get_commits(author=USERNAME)

    # Display commit details
    if commits.totalCount == 0:
        print(f"No commits found for user {USERNAME} in {REPO_NAME}.")
        sys.exit()

    for commit in commits[:5]:  # Fetching first 5 commits
        print(f"SHA: {commit.sha}")
        print(f"Author: {commit.commit.author.name}")
        print(f"Date: {commit.commit.author.date}")
        print(f"Message: {commit.commit.message}\n")