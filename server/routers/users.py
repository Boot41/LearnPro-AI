from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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
        # Here we'll add placeholder progress data
        # TODO: Implement actual progress tracking
        employee_data = schemas.EmployeeWithProgress(
            id=employee.id,
            email=employee.email,
            name=employee.username,  # Using username as name for now
            progress=0.0,  # Placeholder progress
            assigned_projects=[],  # Placeholder for assigned projects
            last_activity=None  # Placeholder for last activity
        )
        employee_list.append(employee_data)
    
    return employee_list
