from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import json

import models
import schemas
import auth
from database import engine, get_db, SessionLocal
from utils.llm_utils import generate_assignment_questions

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="LearnPro API", description="API for LearnPro application")

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default development server
    "http://localhost:3000",  # Just in case you use a different port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create default admin user if database is empty
def create_default_admin():
    db = SessionLocal()
    try:
        # Check if any users exist
        user_count = db.query(models.User).count()
        if user_count == 0:
            # Create admin user
            admin_email = "admin@learnpro.com"
            admin_password = "admin"
            hashed_password = auth.get_password_hash(admin_password)
            
            admin_user = models.User(
                username=admin_email,
                email=admin_email,
                hashed_password=hashed_password,
                user_type=models.UserType.ADMIN
            )
            
            db.add(admin_user)
            db.commit()
            print(f"Default admin user created. Email: {admin_email}, Password: {admin_password}")
    except Exception as e:
        print(f"Error creating default admin: {e}")
    finally:
        db.close()

# Create default admin user on startup
create_default_admin()

@app.post("/api/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if username already exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email already exists
    db_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password).decode('utf-8')
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        user_type=user.user_type
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/register/", response_model=schemas.User)
def register_user(user_data: dict, db: Session = Depends(get_db)):
    # Check if username/email already exists
    db_user = db.query(models.User).filter(models.User.email == user_data["email"]).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = auth.get_password_hash(user_data["password"])
    db_user = models.User(
        username=user_data["email"],  # Using email as username
        email=user_data["email"],
        hashed_password=hashed_password,
        user_type=models.UserType.EMPLOYEE  # Default to employee
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/login", response_model=schemas.Token)
def login_for_access_token(
    response: Response,
    user_credentials: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "user_type": user.user_type}, 
        expires_delta=access_token_expires
    )
    print(user.user_type.value) 
    # Set cookie with the token
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=1800,  # 30 minutes in seconds
        expires=1800,
        samesite="lax",
        secure=False,  # Set to True in production with HTTPS
    )
    print(user.username, user.id) 
    return {"access_token": access_token,"id":user.id,"email": user.username,"user_type": f"{user.user_type.value}", "token_type": "bearer"}

@app.get("/api/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@app.post("/api/projects/", response_model=schemas.Project)
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

@app.get("/api/projects/", response_model=List[schemas.Project])
async def list_projects(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    projects = db.query(models.Project).all()
    return projects

@app.get("/api/projects/{project_id}", response_model=schemas.Project)
async def get_project(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.get("/")
def read_root():
    return {"message": "Welcome to LearnPro API"}
