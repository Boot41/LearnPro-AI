from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import auth
from database import get_db
from utils.llm_utils import generate_learning_path

router = APIRouter(tags=["learning paths"])

@router.get("/learning_path")
def get_learning_path():
    topics = ["React Basics", "State Management", "API Integration"]
    scores = {
        "React Basics": 0.5,
        "State Management": 0.5,
        "API Integration": 0.5
    }
    return generate_learning_path(topics, scores)

@router.post("/api/learning_paths", response_model=schemas.LearningPath)
def create_learning_path(
    learning_path: schemas.LearningPathCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    db_learning_path = models.LearningPath(**learning_path.dict())
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
