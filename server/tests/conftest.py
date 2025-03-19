import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import sys
import os
from pathlib import Path

# Add server directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from database import Base, get_db
from models import User, UserType, Project, Subject, LearningPath
import auth as auth_utils

# Import routers directly instead of the main app
from routers import auth, users, projects, learning_paths, skill_assessments, livekit, give_kt, take_kt

# Create a test app without the static files
def create_test_app():
    app = FastAPI()
    
    # Include all the routers exactly as they are in main.py
    # This uses the prefixes defined in the router files themselves
    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(projects.router)
    app.include_router(learning_paths.router)
    app.include_router(skill_assessments.router)
    app.include_router(livekit.router)
    app.include_router(give_kt.router)
    app.include_router(take_kt.router)
    
    return app

# Get the test app
app = create_test_app()

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def test_db_engine():
    """Create a SQLAlchemy engine for testing - fresh for each test"""
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(test_db_engine):
    """Create a SQLAlchemy session for testing"""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_db_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

@pytest.fixture
def client(db_session):
    """Create a FastAPI TestClient with the test database"""
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass

    # Override the get_db dependency
    app.dependency_overrides[get_db] = _get_test_db
    
    with TestClient(app) as client:
        yield client

@pytest.fixture
def admin_token(client, db_session):
    """Create an admin user and return a valid token"""
    admin_data = {
        "username": "testadmin@learnpro.com",
        "email": "testadmin@learnpro.com",
        "password": "adminpassword123"
    }
    
    # Create admin user directly in the database
    hashed_password = auth_utils.get_password_hash(admin_data["password"])
    db_user = User(
        username=admin_data["username"],
        email=admin_data["email"],
        hashed_password=hashed_password,
        user_type=UserType.ADMIN
    )
    db_session.add(db_user)
    db_session.commit()
    db_session.refresh(db_user)
    
    # Login and get token
    response = client.post(
        "/api/login", 
        json={
            "username": admin_data["username"],
            "password": admin_data["password"]
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def employee_token(client, db_session):
    """Create an employee user and return a valid token"""
    employee_data = {
        "username": "testemployee@learnpro.com",
        "email": "testemployee@learnpro.com",
        "password": "employeepassword123"
    }
    
    # Create employee user directly in the database
    hashed_password = auth_utils.get_password_hash(employee_data["password"])
    db_user = User(
        username=employee_data["username"],
        email=employee_data["email"],
        hashed_password=hashed_password,
        user_type=UserType.EMPLOYEE
    )
    db_session.add(db_user)
    db_session.commit()
    db_session.refresh(db_user)
    
    # Login and get token
    response = client.post(
        "/api/login", 
        json={
            "username": employee_data["username"],
            "password": employee_data["password"]
        }
    )
    token = response.json()["access_token"]
    return {
        "Authorization": f"Bearer {token}",
        "user_id": str(db_user.id),  # Convert to string for HTTP header compatibility
        "email": db_user.email
    }

@pytest.fixture
def sample_project(db_session):
    """Create a sample project for testing"""
    project = Project(
        name="Test Project",
        description="A project for testing"
    )
    db_session.add(project)
    db_session.commit()
    
    # Add subjects to the project
    subject1 = Subject(
        name="Subject 1",
        topics="Topic A,Topic B,Topic C",
        project_id=project.id
    )
    subject2 = Subject(
        name="Subject 2",
        topics="Topic X,Topic Y,Topic Z",
        project_id=project.id
    )
    db_session.add_all([subject1, subject2])
    db_session.commit()
    
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "subjects": [
            {"id": subject1.id, "name": subject1.name, "topics": subject1.topics.split(",")},
            {"id": subject2.id, "name": subject2.name, "topics": subject2.topics.split(",")}
        ]
    }

@pytest.fixture
def sample_learning_path(db_session, sample_project, employee_token):
    """Create a sample learning path for testing"""
    user_id = employee_token["user_id"]
    project_id = sample_project["id"]
    
    # Sample learning path JSON
    learning_path_json = {
        "path_name": "Test Learning Path",
        "subjects": [
            {
                "subject_name": "Subject 1",
                "is_completed": False,
                "is_started": True,
                "topics": [
                    {
                        "topic_name": "Topic A",
                        "is_completed": False
                    },
                    {
                        "topic_name": "Topic B",
                        "is_completed": False
                    }
                ]
            }
        ]
    }
    
    # Create learning path
    learning_path = LearningPath(
        user_id=user_id,
        project_id=project_id,
        learning_path=str(learning_path_json),
        total_topics=2,
        completed_topics=0
    )
    db_session.add(learning_path)
    db_session.commit()
    db_session.refresh(learning_path)
    
    return {
        "id": learning_path.id,
        "user_id": learning_path.user_id,
        "project_id": learning_path.project_id,
        "learning_path": learning_path.learning_path,
        "total_topics": learning_path.total_topics,
        "completed_topics": learning_path.completed_topics
    }
