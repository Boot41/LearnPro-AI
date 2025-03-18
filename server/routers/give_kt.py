from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from utils.llm_utils import generate_digested_transcripts
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import models
import schemas
import auth
import json
from database import get_db
from utils.calendar_utils import create_calendar_event

router = APIRouter(prefix="/api/give_kt", tags=["give_kt"])

@router.post("/", response_model=schemas.GiveKT)
async def create_kt_session(
    assign_give_kt_data: schemas.GiveKTCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new KT session entry"""
    # print(assign_give_kt_data)
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
        create_calendar_event({
            "user_email": employee.email,
            "session_duration": 3,
            "start_date": datetime.now() + timedelta(days=7)
        })
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

@router.get("/", response_model=List[dict]|dict)
async def list_kt_sessions(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all KT sessions"""
    # Check if user is admin
    if current_user.user_type == models.UserType.ADMIN:
        kt_sessions = db.query(models.GiveKT).all()
        sessions_parsed = []
        for kt in kt_sessions:
            session = {}
            project = db.query(models.Project).filter(models.Project.id == kt.project_id).first()
            if project:
                session["project_name"] = project.name
                session["project_id"] = project.id
                employee = db.query(models.User).filter(models.User.id == kt.employee_id).first()
                if employee:
                    session["employee_email"] = employee.email
            if kt.given_kt_info_id is None:
                session["status"] = "Pending"
            else:
                session["status"] = "Completed"
            sessions_parsed.append(session)
        return sessions_parsed
    else:
        kt = db.query(models.GiveKT).filter(models.GiveKT.employee_id == current_user.id).first()
        if not kt:
            return {}
        session = {}
        project = db.query(models.Project).filter(models.Project.id == kt.project_id).first()
        if project:
            session["project_name"] = project.name
            session["project_id"] = project.id
            employee = db.query(models.User).filter(models.User.id == kt.employee_id).first()
            if employee:
                session["employee_email"] = employee.email
        if kt.given_kt_info_id is None:
            session["status"] = "Pending"
        else:
            session["status"] = "Completed"
        return session 

@router.post("/save-kt-info",status_code=201)
async def save_kt_info(
    kt_info: schemas.Kt_info,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db),
):

    try:
        digested_kt = generate_digested_transcripts(kt_info.kt_transcripts)
        print(kt_info.kt_transcripts)
        give_kt_db = db.query(models.GiveKT).filter_by(id=kt_info.give_kt_id).first()
        take_kt_all = db.query(models.TakeKt).filter_by(project_id=give_kt_db.project_id,status="Kt not created").all()
        if not give_kt_db.employee_id == current_user.id:
            raise HTTPException(status_code=400,detail="You are not authorised to create a KT for this project")
        ktItem = models.KtInfo(
            project_id = give_kt_db.project_id,
            employee_id = current_user.id,
            kt_info = digested_kt,
            original_transcripts = json.dumps(kt_info.kt_transcripts)
        )
        db.add(ktItem)
        db.commit()

        give_kt_db.given_kt_info_id = ktItem.id
        for take_kt in take_kt_all:
            take_kt.kt_info_id = ktItem.id
            take_kt.status = "Pending"

        db.commit()
        return JSONResponse({"detail":"Kt info added to database"})
        
    except Exception as err:
        if "not authorised" in str(err):
            raise err
        else:
            raise HTTPException(status_code=500,detail=str(err))
    


@router.get("/pending", response_model=schemas.PendingKTProjectDetails)
async def get_pending_kt_details(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about pending KT assignments for an employee.
    This endpoint returns detailed information about projects assigned to the employee for KT
    """

    # Check if employee exists
    employee = db.query(models.User).filter(
        models.User.id == current_user.id,
        models.User.user_type == models.UserType.EMPLOYEE
    ).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found or user is not an employee")
    
    # Query for pending KT assignments with project details
    # We need to join GiveKT with Project and User tables to get all required information
    
    # Get all pending KT assignments
    pending_kt_assignments = db.query(models.GiveKT).filter(
        models.GiveKT.employee_id == current_user.id,
        models.GiveKT.given_kt_info_id == None
    ).first()
    
    # Get project details
    project = db.query(models.Project).filter(
        models.Project.id == pending_kt_assignments.project_id
    ).first()
        
    if project:
        # Create detailed response object
        kt_details = schemas.PendingKTProjectDetails(
            give_kt_id=pending_kt_assignments.id,
            project_id=project.id,
            project_name=project.name,
            project_description=project.description,
            employee_id=employee.id,
            employee_name=employee.username,
            employee_email=employee.email
        )
    print(kt_details)
    
    return kt_details 
