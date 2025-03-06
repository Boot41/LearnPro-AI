from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

import models
import schemas
import auth
from database import get_db
from utils.llm_utils import generate_assignment_questions

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("/", response_model=schemas.Project)
async def create_project(
    project: schemas.ProjectCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if user is admin
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can create projects"
        )
    
    try:
        # Generate quiz questions using LLM
        quiz_data = generate_assignment_questions([{
            "subject_name": subject.name,
            "topics": subject.topics if subject.topics else []
        } for subject in project.subjects])
        
        # Create project with quiz data
        db_project = models.Project(
            name=project.name,
            description=project.description,
            skill_assessment_quiz=json.dumps(quiz_data)
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        
        # Create subjects with their topics
        for subject_data in project.subjects:
            db_subject = models.Subject(
                name=subject_data.name,
                topics=",".join(subject_data.topics),
                project_id=db_project.id
            )
            db.add(db_subject)
        
        db.commit()
        db.refresh(db_project)
        return db_project
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create project: {str(e)}"
        )

@router.get("/", response_model=List[schemas.Project])
def list_projects(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    projects = db.query(models.Project).all()
    return projects

@router.get("/{project_id}", response_model=schemas.Project)
def get_project(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/completion/stats", response_model=List[schemas.ProjectCompletionStats])
def get_project_completion_stats(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get completion statistics for all projects"""
    # Get all projects
    projects = db.query(models.Project).all()
    result = []
    
    for project in projects:
        # Get all learning paths for this project
        learning_paths = db.query(models.LearningPath).filter(
            models.LearningPath.project_id == project.id
        ).all()
        
        # Calculate completion rate for this project
        if learning_paths:
            total_completion = 0
            for path in learning_paths:
                if path.total_topics > 0:
                    completion_rate = (path.completed_topics / path.total_topics) * 100
                    total_completion += completion_rate
            
            avg_completion = total_completion / len(learning_paths) if learning_paths else 0
        else:
            avg_completion = 0
        
        result.append({
            "id": project.id,
            "name": project.name,
            "completionRate": round(avg_completion, 1)
        })
    
    return result
