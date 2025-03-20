from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/api/take_github_kt", tags=["take_github_kt"])

@router.post("/", response_model=dict)
async def create_take_kt_session(
    take_kt_data: schemas.TakeKtNewCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new Take KT session for GitHub commits"""
    # Check if user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can create Take KT sessions"
        )
    
    # Check if the GitHub commit exists
    give_kt = db.query(models.GiveKtNew).filter(
        models.GiveKtNew.id == take_kt_data.give_kt_new_id
    ).first()
    
    if not give_kt:
        raise HTTPException(status_code=404, detail="GitHub commit information not found")
    
    # Check if employee exists
    employee = db.query(models.User).filter(models.User.email == take_kt_data.email).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if employee already has a Take KT session assigned for this GitHub commit
    existing_session = db.query(models.TakeKtNew).filter(
        models.TakeKtNew.employee_id == employee.id,
        models.TakeKtNew.give_kt_new_id == take_kt_data.give_kt_new_id
    ).first()
    
    if existing_session:
        raise HTTPException(
            status_code=409, 
            detail="Employee already has a Take KT session assigned for this GitHub commit"
        )
    
    # Check if there's a KtInfoNew entry for this GitHub commit
    kt_info = db.query(models.KtInfoNew).filter(
        models.KtInfoNew.give_kt_new_id == take_kt_data.give_kt_new_id
    ).first()
    
    status = "Kt not created"
    kt_info_id = None
    
    if kt_info:
        status = "Pending"
        kt_info_id = kt_info.id
    
    try:
        # Create Take KT session
        take_kt_session = models.TakeKtNew(
            give_kt_new_id=take_kt_data.give_kt_new_id,
            employee_id=employee.id,
            status=status
        )
        db.add(take_kt_session)
        db.commit()
        db.refresh(take_kt_session)
        
        return {
            "message": "Take KT session created successfully",
            "take_kt_id": take_kt_session.id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create Take KT session: {str(e)}"
        )

@router.get("/", response_model=List[dict])
async def list_take_kt_sessions(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all Take KT sessions for GitHub commits"""
    
    # Different implementation based on user type
    if current_user.user_type == models.UserType.ADMIN:
        # Admin view - get all Take KT sessions
        take_kt_sessions = db.query(models.TakeKtNew).all()
    else:
        # Employee view - get only their Take KT sessions
        take_kt_sessions = db.query(models.TakeKtNew).filter(
            models.TakeKtNew.employee_id == current_user.id
        ).all()
    
    sessions_parsed = []
    
    for kt in take_kt_sessions:
        session = {}
        
        # Get commit information
        give_kt = db.query(models.GiveKtNew).filter(models.GiveKtNew.id == kt.give_kt_new_id).first()
        if give_kt:
            session["repo_url"] = give_kt.repo_url
            session["username"] = give_kt.username
        
        # Get employee information
        emp = db.query(models.User).filter(models.User.id == kt.employee_id).first()
        if emp:
            session["employee_email"] = emp.email
        
        session["status"] = kt.status
        session["take_kt_id"] = kt.id
        
        sessions_parsed.append(session)
    
    return sessions_parsed

@router.delete("/{take_kt_id}", response_model=dict)
async def delete_take_kt_session(
    take_kt_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a Take KT session for GitHub commits by ID"""
    # Check if user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can delete Take KT sessions"
        )
    
    # Check if Take KT session exists
    take_kt_session = db.query(models.TakeKtNew).filter(models.TakeKtNew.id == take_kt_id).first()
    if not take_kt_session:
        raise HTTPException(status_code=404, detail="Take KT session not found")
    
    try:
        # Delete the Take KT session
        db.delete(take_kt_session)
        db.commit()
        
        return {
            "message": f"Successfully deleted Take KT session with ID {take_kt_id}"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete Take KT session: {str(e)}"
        )

# @router.get("/kt-details/{take_kt_id}", response_model=dict)
# async def get_kt_details(
#     take_kt_id: int,
#     current_user: models.User = Depends(auth.get_current_active_user),
#     db: Session = Depends(get_db)
# ):
#     """Get KT details for a specific Take KT session"""
#     # Check if Take KT session exists and belongs to the current user
#     take_kt_session = db.query(models.TakeKtNew).filter(
#         models.TakeKtNew.id == take_kt_id
#     ).first()
    
#     if not take_kt_session:
#         raise HTTPException(status_code=404, detail="Take KT session not found")
    
#     # Only admins or the owner of the Take KT session can view it
#     if current_user.user_type != "ADMIN" and take_kt_session.employee_id != current_user.id:
#         raise HTTPException(
#             status_code=403,
#             detail="You are not authorized to view this Take KT session"
#         )
    
#     # Check if KT info exists
#     if not take_kt_session.kt_info_id:
#         raise HTTPException(
#             status_code=404,
#             detail="KT information not yet available for this session"
#         )
    
#     kt_info = db.query(models.KtInfoNew).filter(
#         models.KtInfoNew.id == take_kt_session.kt_info_id
#     ).first()
    
#     if not kt_info:
#         raise HTTPException(
#             status_code=404,
#             detail="KT information not found"
#         )
    
#     # Get GitHub commit details
#     github_commit = db.query(models.GitHubCommitInfo).filter(
#         models.GitHubCommitInfo.id == take_kt_session.github_commit_id
#     ).first()
    
#     # Get employee who gave the KT
#     kt_giver = db.query(models.User).filter(
#         models.User.id == kt_info.employee_id
#     ).first()
    
#     return {
#         "kt_info": kt_info.kt_info,
#         "repo_url": github_commit.repo_url if github_commit else None,
#         "username": github_commit.username if github_commit else None,
#         "given_by": kt_giver.email if kt_giver else None,
#         "created_at": kt_info.created_at
#     }

# @router.put("/mark-completed/{take_kt_id}", response_model=dict)
# async def mark_kt_completed(
#     take_kt_id: int,
#     current_user: models.User = Depends(auth.get_current_active_user),
#     db: Session = Depends(get_db)
# ):
#     """Mark a Take KT session as completed"""
#     # Check if Take KT session exists
#     take_kt_session = db.query(models.TakeKtNew).filter(
#         models.TakeKtNew.id == take_kt_id
#     ).first()
    
#     if not take_kt_session:
#         raise HTTPException(status_code=404, detail="Take KT session not found")
    
#     # Only the employee assigned to the Take KT session can mark it as completed
#     if take_kt_session.employee_id != current_user.id:
#         raise HTTPException(
#             status_code=403,
#             detail="You are not authorized to update this Take KT session"
#         )
    
#     # Check if the session is in "Pending" status
#     if take_kt_session.status != "Pending":
#         raise HTTPException(
#             status_code=400,
#             detail=f"Cannot mark session as completed. Current status: {take_kt_session.status}"
#         )
    
#     try:
#         # Update the status
#         take_kt_session.status = "Completed"
#         take_kt_session.updated_at = datetime.now()
        
#         db.commit()
        
#         return {"message": "Take KT session marked as completed successfully"}
        
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(
#             status_code=500,
#             detail=f"Failed to update Take KT session: {str(e)}"
#         )
