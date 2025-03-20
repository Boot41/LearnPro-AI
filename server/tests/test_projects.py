import pytest
from fastapi import status
import json
import io
from unittest.mock import patch

def test_list_projects(client, employee_token, sample_project):
    """Test listing all projects"""
    response = client.get(
        "/api/projects/",
        headers=employee_token
    )
    assert response.status_code == status.HTTP_200_OK
    projects = response.json()
    assert isinstance(projects, list)
    assert len(projects) >= 1  # At least one project from fixtures
    
    # Verify project structure
    project = next((p for p in projects if p["id"] == sample_project["id"]), None)
    assert project is not None
    assert project["name"] == sample_project["name"]
    assert project["description"] == sample_project["description"]
    assert "subjects" in project
    assert isinstance(project["subjects"], list)

def test_get_project_by_id(client, employee_token, sample_project):
    """Test getting a specific project by ID"""
    response = client.get(
        f"/api/projects/{sample_project['id']}",
        headers=employee_token
    )
    assert response.status_code == status.HTTP_200_OK
    project = response.json()
    assert project["id"] == sample_project["id"]
    assert project["name"] == sample_project["name"]
    assert project["description"] == sample_project["description"]

def test_get_nonexistent_project(client, employee_token):
    """Test getting a non-existent project"""
    response = client.get(
        "/api/projects/99999",  # Non-existent project ID
        headers=employee_token
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "project not found" in response.json()["detail"].lower()

@patch('routers.projects.generate_subjects_from_dependencies')
@patch('routers.projects.generate_assignment_questions')
def test_create_project_admin(mock_generate_assignment, mock_generate_subjects, client, admin_token):
    """Test creating a new project as admin with file upload"""
    # Mock the LLM functions
    mock_generate_subjects.return_value = {
        'subjects': [
            {
                'subject_name': 'FastAPI',
                'topics': ['Routing', 'Middleware', 'Dependency Injection']
            },
            {
                'subject_name': 'SQLAlchemy',
                'topics': ['Models', 'Queries', 'Relationships']
            }
        ]
    }
    
    mock_generate_assignment.return_value = {
        'assignments': [
            {
                'title': 'Build a REST API',
                'description': 'Create a RESTful API with CRUD operations',
                'difficulty': 'Intermediate',
                'estimated_time': '3 hours',
                'requirements': ['FastAPI', 'SQLAlchemy', 'Pydantic'],
                'grading_criteria': 'Functionality, code quality, documentation'
            }
        ]
    }
    
    # Create a sample requirements.txt file
    requirements_content = """
    fastapi==0.68.0
    sqlalchemy==1.4.23
    pydantic==1.8.2
    """
    requirements_file = io.BytesIO(requirements_content.encode())
    
    # Form data
    form_data = {
        "projectName": "New Test Project",
        "projectDescription": "A new project for testing"
    }
    
    # Include file in the form data
    files = {
        "file": ("requirements.txt", requirements_file, "text/plain")
    }
    
    response = client.post(
        "/api/projects/",
        headers=admin_token,
        data=form_data,
        files=files
    )
    
    assert response.status_code == status.HTTP_200_OK
    new_project = response.json()
    assert "id" in new_project
    assert new_project["name"] == form_data["projectName"]
    assert new_project["description"] == form_data["projectDescription"]
    
    # Verify the project was created
    response = client.get(
        f"/api/projects/{new_project['id']}",
        headers=admin_token
    )
    assert response.status_code == status.HTTP_200_OK

@patch('routers.projects.generate_subjects_from_dependencies')
@patch('routers.projects.generate_assignment_questions')
def test_create_project_unauthorized(mock_generate_assignment, mock_generate_subjects, client, employee_token):
    """Test that non-admin users cannot create projects"""
    # Create a sample requirements.txt file
    requirements_content = """
    fastapi==0.68.0
    sqlalchemy==1.4.23
    """
    requirements_file = io.BytesIO(requirements_content.encode())
    
    # Form data
    form_data = {
        "projectName": "Unauthorized Project",
        "projectDescription": "A project that should not be created"
    }
    
    # Include file in the form data
    files = {
        "file": ("requirements.txt", requirements_file, "text/plain")
    }
    
    response = client.post(
        "/api/projects/",
        headers=employee_token,
        data=form_data,
        files=files
    )
    
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "only admin users" in response.json()["detail"].lower()

def test_project_completion_stats(client, admin_token, sample_project, sample_learning_path):
    """Test getting project completion statistics"""
    response = client.get(
        "/api/projects/completion/stats",
        headers=admin_token
    )
    assert response.status_code == status.HTTP_200_OK
    stats = response.json()
    assert isinstance(stats, list)
    
    # Verify stats structure
    for project_stat in stats:
        assert "id" in project_stat
        assert "name" in project_stat
        assert "completionRate" in project_stat
        assert isinstance(project_stat["completionRate"], (int, float))
    
    # Verify our sample project is in the stats
    sample_project_stat = next((s for s in stats if s["id"] == sample_project["id"]), None)
    assert sample_project_stat is not None
    assert sample_project_stat["name"] == sample_project["name"]
