from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@router.get("/employees", response_model=list[schemas.EmployeeWithProgress])
def list_employees(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can view employee list"
        )
    
    # Get all non-admin users
    employees = db.query(models.User).filter(
        models.User.user_type == models.UserType.EMPLOYEE
    ).all()
    
    # Prepare employee list with progress data
    employee_list = []
    for employee in employees:
        # Calculate actual progress based on learning paths
        progress = 0.0
        assigned_projects = []
        last_activity = None
        
        # Get the employee's assigned project
        if employee.assigned_project_id:
            project = db.query(models.Project).filter(models.Project.id == employee.assigned_project_id).first()
            if project:
                # Get the employee's learning path for this project
                learning_path = db.query(models.LearningPath).filter(
                    models.LearningPath.user_id == employee.id,
                    models.LearningPath.project_id == project.id
                ).first()
                
                if learning_path:
                    # Calculate progress percentage
                    if learning_path.total_topics > 0:
                        progress = (learning_path.completed_topics / learning_path.total_topics) * 100
                    last_activity = learning_path.updated_at
                
                assigned_projects.append({
                    "id": project.id,
                    "name": project.name,
                    "progress": progress,
                    "last_activity": last_activity
                })
        
        employee_data = schemas.EmployeeWithProgress(
            id=employee.id,
            email=employee.email,
            name=employee.username,  # Using username as name for now
            progress=progress,
            assigned_projects=assigned_projects,
            last_activity=last_activity
        )
        employee_list.append(employee_data)
    
    return employee_list

@router.post("/assign-project")
def assign_project_to_user(
    assign_project: schemas.AssignProject,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Assign a project to a user using their email"""
    # Check if current user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can assign projects"
        )
    
    # Find the user by email
    user = db.query(models.User).filter(models.User.email == assign_project.email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"User with email {assign_project.email} not found"
        )
    
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == assign_project.project_id).first()
    if not project:
        raise HTTPException(
            status_code=404,
            detail=f"Project with id {assign_project.project_id} not found"
        )
    
    # Assign project to user
    user.assigned_project_id = assign_project.project_id
    db.commit()
    db.refresh(user)
    
    return {"message": f"Successfully assigned project {project.name} to user {user.email}"}
