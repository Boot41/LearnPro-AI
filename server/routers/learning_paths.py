from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime

import models
import schemas
import auth
from database import get_db
from utils.llm_utils import generate_learning_path

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
