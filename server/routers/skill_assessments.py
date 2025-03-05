from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

import models
import schemas
import auth
from database import get_db

router = APIRouter(tags=["skill assessments"])

@router.get("/api/skill-assessment/quiz")
def get_skill_assessment_quiz(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get the skill assessment quiz for the currently logged-in user's assigned project"""
    
    # Check if user is an employee
    if current_user.user_type != models.UserType.EMPLOYEE:
        raise HTTPException(
            status_code=403,
            detail="Only employees can access skill assessment quizzes"
        )
    
    # Check if user is assigned to a project
    if not current_user.assigned_project_id:
        raise HTTPException(
            status_code=404,
            detail="No project assigned to user"
        )
    
    # Get the project and its quiz
    project = db.query(models.Project).filter(
        models.Project.id == current_user.assigned_project_id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Assigned project not found"
        )
    
    if not project.skill_assessment_quiz:
        raise HTTPException(
            status_code=404,
            detail="No skill assessment quiz available for this project"
        )
    
    try:
        # Parse the JSON string into a Python dictionary
        quiz_data = json.loads(project.skill_assessment_quiz)
        return {
            "project_id": project.id,
            "project_name": project.name,
            "quiz": quiz_data
        }
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Error parsing quiz data"
        )
