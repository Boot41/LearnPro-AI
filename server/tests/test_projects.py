import pytest
from fastapi import status
import json

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

def test_create_project_admin(client, admin_token):
    """Test creating a new project as admin"""
    project_data = {
        "name": "New Test Project",
        "description": "A new project for testing",
        "subjects": [
            {
                "name": "New Subject 1",
                "topics": ["New Topic A", "New Topic B"]
            },
            {
                "name": "New Subject 2",
                "topics": ["New Topic X", "New Topic Y"]
            }
        ]
    }
    
    response = client.post(
        "/api/projects/",
        headers=admin_token,
        json=project_data
    )
    assert response.status_code == status.HTTP_200_OK
    new_project = response.json()
    assert "id" in new_project
    assert new_project["name"] == project_data["name"]
    assert new_project["description"] == project_data["description"]
    
    # Verify the project was created
    response = client.get(
        f"/api/projects/{new_project['id']}",
        headers=admin_token
    )
    assert response.status_code == status.HTTP_200_OK

def test_create_project_unauthorized(client, employee_token):
    """Test that non-admin users cannot create projects"""
    project_data = {
        "name": "Unauthorized Project",
        "description": "A project that should not be created",
        "subjects": [
            {
                "name": "Subject X",
                "topics": ["Topic 1", "Topic 2"]
            }
        ]
    }
    
    response = client.post(
        "/api/projects/",
        headers=employee_token,
        json=project_data
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
