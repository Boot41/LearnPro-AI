from github import Github
import re
import os
from dotenv import load_dotenv

load_dotenv()
    
def extract_owner_repo(url: str):
    # Supports URLs like:
    #   https://github.com/owner/repo.git, git@github.com:owner/repo.git, https://github.com/owner/repo
    pattern = r"github\.com[:/](?P<owner>[\w\-]+)/(?P<repo>[\w\-]+)(\.git)?/?$"
    match = re.search(pattern, url)
    if match:
        return match.group('owner'), match.group('repo')
    return None, None

def get_commits_info(repo, username):
    commits = repo.get_commits(author=username)
    commit_list = []
    count = 0
    COMMIT_DEPTH = int(os.environ.get("COMMIT_DEPTH", "5"))
    # Process only the last COMMIT_DEPTH number of commits
    for commit in commits:
        if count >= COMMIT_DEPTH:
            break
        # Get detailed commit data to access file changes
        detailed_commit = repo.get_commit(commit.sha)
        files_data = []
        for f in detailed_commit.files:
            file_info = {
                "filename": f.filename,
                "lines_changed": f.changes  # Typically, this is additions + deletions
            }
            files_data.append(file_info)
        commit_data = {
            "sha": commit.sha,
            "message": commit.commit.message,
            "files": files_data
        }
        commit_list.append(commit_data)
        count += 1
    return {"commits": commit_list}

def get_llm_usable_string(commits):
    lines = []
    for commit in commits.get("commits", []):
        # Append the commit message header.
        lines.append(f"Commit: {commit.get('message', '<no message>')}")
        # Append file details.
        for file in commit.get("files", []):
            filename = file.get("filename", "<unknown file>")
            lines_changed = file.get("lines_changed", 0)
            lines.append(f"  - {filename} ({lines_changed} lines changed)")
        # Add a blank line for readability between commits.
        lines.append("")
    
    # Join all lines into a single string with newline characters.
    return "\n".join(lines)