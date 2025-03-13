from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/api/give_kt", tags=["give_kt"])

@router.post("/", response_model=schemas.GiveKT)
async def create_kt_session(
    assign_give_kt_data: schemas.GiveKTCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new KT session entry"""
    print(assign_give_kt_data)
    # Check if user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can create KT sessions"
        )
    
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == assign_give_kt_data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if employee exists and is an employee
    employee = db.query(models.User).filter(
        models.User.id == assign_give_kt_data.employee_id,
        models.User.user_type == models.UserType.EMPLOYEE
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found or user is not an employee")
    
    # Check if KT session already exists
    existing_session = db.query(models.GiveKT).filter(
        models.GiveKT.project_id == assign_give_kt_data.project_id,
    ).first()

    if existing_session:
        raise HTTPException(status_code=409, detail="KT session already exists for this project and employee")
    
    try:
        # Create KT session
        kt_session = models.GiveKT(
            project_id=assign_give_kt_data.project_id,
            employee_id=assign_give_kt_data.employee_id,
            given_kt_info_id = None
        )
        db.add(kt_session)
        db.commit()
        db.refresh(kt_session)
        return kt_session
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create KT session: {str(e)}"
        )

@router.delete("/{project_id}", response_model=dict)
async def delete_kt_session(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a KT session by project ID"""
    # Check if user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can delete KT sessions"
        )
    
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        # Find and delete all KT sessions for this project
        kt_sessions = db.query(models.GiveKT).filter(models.GiveKT.project_id == project_id).all()
        if not kt_sessions:
            raise HTTPException(status_code=404, detail="No KT sessions found for this project")
        
        # Delete all matching KT sessions
        for session in kt_sessions:
            db.delete(session)
        
        db.commit()
        return {"message": f"Successfully deleted KT sessions for project ID {project_id}"}
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete KT sessions: {str(e)}"
        )

@router.get("/", response_model=List[schemas.GiveKT])
async def list_kt_sessions(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all KT sessions"""
    # Check if user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can view KT sessions"
        )
    
    kt_sessions = db.query(models.GiveKT).all()
    return kt_sessions
