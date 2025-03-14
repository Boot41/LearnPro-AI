from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/api/take_kt", tags=["take_kt"])

@router.post("/", response_model=dict)
async def create_take_kt_session(
    take_kt_data: schemas.TakeKTCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new Take KT session entry"""
    # Check if user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can create Take KT sessions"
        )
    
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == take_kt_data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if employee exists
    employee = db.query(models.User).filter(models.User.email == take_kt_data.email).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if employee already has a Take KT session assigned
    existing_session = db.query(models.TakeKt).filter(
        models.TakeKt.employee_id == employee.id
    ).first()
    
    if existing_session:
        raise HTTPException(
            status_code=409, 
            detail="Employee already has a Take KT session assigned"
        )
    
    # Check if there's a KtInfo entry for this project with status "Pending"
    kt_info = db.query(models.KtInfo).filter(
        models.KtInfo.project_id == take_kt_data.project_id,
        models.KtInfo.employee_id == employee.id
    ).first()
    
    status = "kt_not_created"
    kt_info_id = None
    
    if kt_info:
        status = "Pending"
        kt_info_id = kt_info.id
    
    try:
        # Create Take KT session
        take_kt_session = models.TakeKt(
            project_id=take_kt_data.project_id,
            employee_id=employee.id,
            kt_info_id=kt_info_id,
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
    """List all Take KT sessions"""
    
    # Different implementation based on user type
    if current_user.user_type == models.UserType.ADMIN:
        # Admin view - get all Take KT sessions
        take_kt_sessions = db.query(models.TakeKt).all()
    else:
        # Employee view - get only their Take KT sessions
        take_kt_sessions = db.query(models.TakeKt).filter(
            models.TakeKt.employee_id == current_user.id
        ).all()
    
    sessions_parsed = []
    
    for kt in take_kt_sessions:
        session = {}
        project = db.query(models.Project).filter(models.Project.id == kt.project_id).first()
        
        if project:
            session["project_name"] = project.name
            session["project_id"] = project.id
            
            employee = db.query(models.User).filter(models.User.id == kt.employee_id).first()
            if employee:
                session["employee_email"] = employee.email
                
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
    """Delete a Take KT session by ID"""
    # Check if user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can delete Take KT sessions"
        )
    
    # Check if Take KT session exists
    take_kt_session = db.query(models.TakeKt).filter(models.TakeKt.id == take_kt_id).first()
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
