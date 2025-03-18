from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
import json
from datetime import datetime

import models
import schemas
import auth
from database import get_db
from utils.llm_utils import generate_learning_path
from utils.calendar_utils import create_calendar_event_recurring
router = APIRouter(tags=["learning paths"])

@router.get("/api/learning_paths/me", response_model=schemas.LearningPath)
def get_my_learning_path(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get the learning path for the currently logged-in user"""
    if current_user.user_type != models.UserType.EMPLOYEE:
        raise HTTPException(
            status_code=403,
            detail="Only employees can access their learning paths"
        )
    
    # Get the most recent learning path for the user
    learning_path = db.query(models.LearningPath).filter(
        models.LearningPath.user_id == current_user.id
    ).order_by(models.LearningPath.created_at.desc()).first()
    
    if not learning_path:
        raise HTTPException(
            status_code=404,
            detail="No learning path found. Please contact your administrator."
        )
    
    return learning_path

@router.get("/learning_path")
def get_learning_path():
    topics = ["React Basics", "State Management", "API Integration"]
    scores = {
        "React Basics": 0.5,
        "State Management": 0.5,
        "API Integration": 0.5
    }
    return generate_learning_path(topics, scores)

@router.post("/api/learning_paths/from_assessment", response_model=schemas.LearningPath)
def create_learning_path_from_assessment(
    quiz_submission: schemas.QuizSubmission,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a learning path based on skill assessment quiz results"""
    print(current_user)
    if current_user.user_type != models.UserType.EMPLOYEE:
        raise HTTPException(
            status_code=403,
            detail="Only employees can create learning paths from assessments"
        )
    
    if not current_user.assigned_project_id:
        raise HTTPException(
            status_code=400,
            detail="No project assigned to user"
        )
    
    # Get topics and scores from quiz submission
    topics = list(quiz_submission.topicScores.keys())
    scores = {topic: score.percentage / 100 for topic, score in quiz_submission.topicScores.items()}
    
    # Generate learning path using LLM
    learning_path_data = generate_learning_path(topics, scores)
    
    # Create learning path record
    db_learning_path = models.LearningPath(
        user_id=current_user.id,
        project_id=current_user.assigned_project_id,
        learning_path=json.dumps(learning_path_data),
        total_topics=sum(len(subject.get('topics', [])) for subject in learning_path_data.get('subjects', [])),
        completed_topics=0,
        created_at=datetime.utcnow()  # Use datetime object instead of timestamp
    )
    
    db.add(db_learning_path)
    db.commit()
    db.refresh(db_learning_path)
    create_calendar_event_recurring({
            "user_email": current_user.email,
            "daily_session_duration": 2,
            "total_hours": learning_path_data['total_estimated_hours']
        })
    return db_learning_path

@router.get("/api/learning_paths/user/{user_id}", response_model=List[schemas.LearningPath])
def get_user_learning_paths(
    user_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Only allow users to view their own learning paths or admins to view any
    if current_user.user_type != models.UserType.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view these learning paths"
        )
    
    learning_paths = db.query(models.LearningPath).filter(
        models.LearningPath.user_id == user_id
    ).all()
    return learning_paths

@router.put("/api/learning_paths/update", response_model=schemas.LearningPath)
def update_learning_path(
    learning_path_update: schemas.LearningPathUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update the learning path for the currently logged-in user"""
    if current_user.user_type != models.UserType.EMPLOYEE:
        raise HTTPException(
            status_code=403,
            detail="Only employees can update their learning paths"
        )
    
    # Get the most recent learning path for the user
    learning_path = db.query(models.LearningPath).filter(
        models.LearningPath.user_id == current_user.id
    ).order_by(models.LearningPath.created_at.desc()).first()
    
    if not learning_path:
        raise HTTPException(
            status_code=404,
            detail="No learning path found to update. Please create a learning path first."
        )
    
    # Update the learning path with the new data
    learning_path.learning_path = learning_path_update.learning_path
    
    # Update total_topics and completed_topics if provided
    if learning_path_update.total_topics is not None:
        learning_path.total_topics = learning_path_update.total_topics
    
    if learning_path_update.completed_topics is not None:
        learning_path.completed_topics = learning_path_update.completed_topics
    
    # Update the timestamp
    learning_path.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(learning_path)
    
    return learning_path


@router.delete("/api/users/{employee_id}/learning_path", status_code=status.HTTP_204_NO_CONTENT)
def delete_learning_path_and_unassign_project(
    employee_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a learning path and unassign the project from the employee
    
    This endpoint is only accessible by admin users.
    It will:
    1. Delete the employee's learning path
    2. Set the assigned_project_id to null for the employee
    """
    # Check if current user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can delete learning paths"
        )
    
    # Get the employee
    employee = db.query(models.User).filter(
        models.User.id == employee_id,
        models.User.user_type == models.UserType.EMPLOYEE
    ).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    # Get the employee's learning path
    learning_path = db.query(models.LearningPath).filter(
        models.LearningPath.user_id == employee_id
    ).order_by(models.LearningPath.created_at.desc()).first()
    
    if not learning_path:
        # If no learning path exists, just unassign the project
        employee.assigned_project_id = None
        db.commit()
        return {"detail": "Project unassigned successfully. No learning path found to delete."}
    
    # Delete the learning path
    db.delete(learning_path)
    
    # Unassign the project from the employee
    employee.assigned_project_id = None
    
    # Commit the changes
    db.commit()
    
    return {"detail": "Learning path deleted and project unassigned successfully"}
