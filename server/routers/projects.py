from fastapi import APIRouter, Depends, HTTPException,UploadFile, File, Form 
from typing import Annotated
from sqlalchemy.orm import Session
from typing import List
import json
from time import sleep
import models
import schemas
import auth
from database import get_db
from utils.llm_utils import generate_assignment_questions, generate_subjects_from_dependencies, groq_calling_function
from utils.file_parsing_utils import parse_requirements, parse_package_json

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("/")
async def create_project(
    projectName: Annotated[str, Form()],
    projectDescription: Annotated[str, Form()],
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Only allow admin users to create projects
    if current_user.user_type != models.UserType.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can create projects"
        )
    
    try:
        # Read the file contents
        contents = await file.read()
        content_str = contents.decode("utf-8")

        # Determine file type and parse dependencies
        if file.filename.endswith('.txt'):
            dependencies = parse_requirements(content_str)
        elif file.filename.endswith('.json'):
            dependencies = parse_package_json(content_str)
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload a requirements.txt or package.json file."
            )
        
        # Call your LLM function (or a helper) that analyzes dependencies
        # and returns a list of subjects and topics.
        subjects = generate_subjects_from_dependencies(dependencies)
        
        # Optionally, generate quiz questions based on the subjects/topics.
        quiz_data = generate_assignment_questions([{
            "subject_name": subject["subject_name"],
            "topics": subject["topics"]
        } for subject in subjects['subjects']])
        # Create the project (you may decide how to set the project name and description)
        db_project = models.Project(
            name=projectName,  # You can modify how the name is determined
            description=projectDescription,
            skill_assessment_quiz=json.dumps(quiz_data)
        )
        # print("quiz_data----------------------------------------------------------",quiz_data)
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        
        # Save subjects (and topics) to the database
        for subject in subjects['subjects']:
            db_subject = models.Subject(
                name=subject["subject_name"],
                topics=",".join(subject["topics"]),
                project_id=db_project.id
            )
            # print("db_subject----------------------------------------------------------",db_subject)
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


@router.post("/old")
async def create_project_old(
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
