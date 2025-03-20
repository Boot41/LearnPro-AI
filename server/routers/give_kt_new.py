from fastapi import HTTPException, APIRouter, Depends
from pydantic import BaseModel
import os
from github import Github
from fastapi.responses import JSONResponse
from utils.github_utils import extract_owner_repo, get_commits_info, get_llm_usable_string
from utils.llm_utils import remove_less_valuable_changes_from_commit, generate_digested_transcripts_github
from database import get_db
from sqlalchemy.orm import Session
from models import GiveKtNew, User, KtInfoNew, TakeKtNew
from typing import Optional, List
import schemas
import auth
import json
from datetime import datetime, timedelta
from utils.calendar_utils import create_calendar_event
import models 

router = APIRouter(prefix="/api/give_github_kt", tags=["github_kt"])

class RepoRequest(BaseModel):
    repo_url: str
    username: str
    employee_id: int

github_token = os.getenv("GITHUB_TOKEN")
if not github_token:
    raise Exception("Missing GITHUB_TOKEN environment variable")

gh = Github(github_token)

COMMIT_DEPTH = int(os.environ.get("COMMIT_DEPTH", "10"))

@router.post("/commits", response_model=schemas.GitHubCommitInfo)
def get_user_commits(req: RepoRequest, db: Session = Depends(get_db)):
    # Extract owner and repo name from the provided URL
    owner, repo_name = extract_owner_repo(req.repo_url)
    if not owner or not repo_name:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL")

    # Verify employee exist
    employee = db.query(User).filter(User.id == req.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    try:
        repo = gh.get_repo(f"{owner}/{repo_name}")
    except Exception as e:
        raise HTTPException(status_code=404, detail="Repository not found")

    try:
        # Retrieve commits made by the specified author
        commits = get_commits_info(repo, req.username)
        llm_usable_string = get_llm_usable_string(commits)
        reduced_string = remove_less_valuable_changes_from_commit(llm_usable_string)
        
        # Save to database
        commit_info = GiveKtNew(
            employee_id=req.employee_id,
            repo_url=req.repo_url,
            username=req.username,
            commit_info=reduced_string
        )
        
        db.add(commit_info)
        db.commit()
        db.refresh(commit_info)
        
        return commit_info
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing request: {e}")

@router.get("/", response_model=List[dict])
async def list_kt_sessions(
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all GitHub-based Give KT sessions"""
    # Check if user is admin
    if current_user.user_type == models.UserType.ADMIN:
        give_kt_sessions = db.query(GiveKtNew).all()
        sessions_parsed = []
        for give_kt_session in give_kt_sessions:
            session = {}
            session["id"] = give_kt_session.id
            session["repo_url"] = give_kt_session.repo_url
            session["username"] = give_kt_session.username
            
            employee = db.query(User).filter(User.id == give_kt_session.employee_id).first()
            if employee:
                session["employee_email"] = employee.email
                
            # Check if KT info exists
            kt_info = db.query(KtInfoNew).filter(KtInfoNew.id == give_kt_session.id).first()
            if kt_info:
                session["status"] = "Completed"
            else:
                session["status"] = "Pending"
                
            sessions_parsed.append(session)
        return sessions_parsed
    else:
        # For employees, show only their sessions
        give_kt_sessions = db.query(GiveKtNew).filter(GiveKtNew.employee_id == current_user.id).all()
        sessions_parsed = []
        for give_kt_session in give_kt_sessions:
            session = {}
            session["id"] = give_kt_session.id
            session["repo_url"] = give_kt_session.repo_url
            session["username"] = give_kt_session.username
            
            # Check if KT info exists
            kt_info = db.query(KtInfoNew).filter(KtInfoNew.id == give_kt_session.id).first()
            if kt_info:
                session["status"] = "Completed"
            else:
                session["status"] = "Pending"
                
            sessions_parsed.append(session)
        return sessions_parsed

@router.delete("/{give_kt_id}", response_model=dict)
async def delete_kt_session(
    give_kt_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a GitHub KT session by commit ID"""
    # Check if user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can delete KT sessions"
        )
    
    # Check if commit exists
    give_kt = db.query(GiveKtNew).filter(GiveKtNew.id == give_kt_id).first()
    if not give_kt:
        raise HTTPException(status_code=404, detail="GitHub KT session not found")
    
    try:
        # Find and delete any related KT info
        kt_info = db.query(KtInfoNew).filter(KtInfoNew.give_kt_new_id == give_kt_id).all()
        for info in kt_info:
            db.delete(info)
            
        # Find and delete any related take KT sessions
        take_kt_sessions = db.query(TakeKtNew).filter(TakeKtNew.give_kt_new_id == give_kt_id).all()
        for session in take_kt_sessions:
            db.delete(session)
            
        # Delete the commit info
        db.delete(give_kt)
        
        db.commit()
        return {"message": f"Successfully deleted GitHub KT session with ID {give_kt_id}"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete KT session: {str(e)}"
        )

@router.post("/save-kt-info", status_code=201)
async def save_kt_info(
    kt_info: schemas.KtInfoNewCreate,
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db),
):
    """Save KT information based on GitHub commits"""
    try:
        # Get the GitHub commit info
        give_kt = db.query(GiveKtNew).filter(
            GiveKtNew.id == kt_info.give_kt_new_id
        ).first()
        
        if not give_kt:
            raise HTTPException(status_code=404, detail="GitHub KT session not found")
            
        # Check if the current user is authorized to create KT for this commit
        if give_kt.employee_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to create KT for this commit"
            )
            
        # Process the transcripts
        digested_kt = generate_digested_transcripts_github(kt_info.kt_transcripts)
        
        # Find all pending take KT sessions
        take_kt_all = db.query(TakeKtNew).filter(
            TakeKtNew.give_kt_new_id == give_kt.id,
            TakeKtNew.status == "Kt not created"
        ).all()
        
        # Create new KT info
        kt_info_new = KtInfoNew(
            employee_id=current_user.id,
            give_kt_new_id=give_kt.id,
            kt_info=digested_kt,
            original_commits=json.dumps(kt_info.kt_transcripts)
        )
        
        db.add(kt_info_new)
        db.commit()
        db.refresh(kt_info_new)
        give_kt.kt_info_id = kt_info_new.id
        # Update take KT sessions
        for take_kt in take_kt_all:
            take_kt.kt_info_id = kt_info_new.id
            take_kt.status = "Pending"
            
        db.commit()
        
        return JSONResponse({"detail": "KT info added to database"})
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# this function is not ported or used right now 
# @router.get("/pending", response_model=schemas.PendingKTGitHubDetails)
# async def get_pending_kt_details(
#     current_user: User = Depends(auth.get_current_active_user),
#     db: Session = Depends(get_db)
# ):
#     """Get detailed information about pending GitHub-based KT assignments"""
#     # Check if employee exists
#     employee = db.query(User).filter(
#         User.id == current_user.id,
#         User.user_type == "EMPLOYEE"
#     ).first()
    
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employee not found or user is not an employee")
    
#     # Get pending GitHub commit info
#     github_commit = db.query(GitHubCommitInfo).filter(
#         GitHubCommitInfo.employee_id == current_user.id
#     ).first()
    
#     if not github_commit:
#         raise HTTPException(status_code=404, detail="No pending GitHub KT assignments found")
    
#     # Check if KT info already exists
#     kt_info = db.query(KtInfoNew).filter(
#         KtInfoNew.github_commit_id == github_commit.id
#     ).first()
    
#     if kt_info:
#         raise HTTPException(status_code=404, detail="KT info already exists for this GitHub commit")
    
#     # Create response
#     kt_details = schemas.PendingKTGitHubDetails(
#         github_commit_id=github_commit.id,
#         repo_url=github_commit.repo_url,
#         username=github_commit.username,
#         employee_id=employee.id,
#         employee_name=employee.username,
#         employee_email=employee.email
#     )
    
#     return kt_details