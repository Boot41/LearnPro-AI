import pytest
from fastapi import status
import json
from unittest.mock import patch, MagicMock
from datetime import datetime

@pytest.fixture
def sample_kt_info(db_session, sample_project, employee_token):
    """Create a sample KtInfo entry for testing"""
    from models import KtInfo
    
    employee_id = int(employee_token["user_id"])
    project_id = sample_project["id"]
    
    kt_info = KtInfo(
        project_id=project_id,
        employee_id=employee_id,
        kt_info="Sample KT information",
        original_transcripts=json.dumps(["Transcript 1", "Transcript 2"])
    )
    
    db_session.add(kt_info)
    db_session.commit()
    db_session.refresh(kt_info)
    
    return {
        "id": kt_info.id,
        "project_id": project_id,
        "employee_id": employee_id
    }

@pytest.fixture
def sample_take_kt(db_session, sample_project, employee_token, sample_kt_info):
    """Create a sample TakeKt entry for testing"""
    from models import TakeKt
    
    employee_id = int(employee_token["user_id"])
    project_id = sample_project["id"]
    
    take_kt = TakeKt(
        project_id=project_id,
        employee_id=employee_id,
        kt_info_id=sample_kt_info["id"],
        status="Pending"
    )
    
    db_session.add(take_kt)
    db_session.commit()
    db_session.refresh(take_kt)
    
    return {
        "id": take_kt.id,
        "project_id": project_id,
        "employee_id": employee_id,
        "kt_info_id": sample_kt_info["id"]
    }

def test_create_take_kt_session(client, admin_token, sample_project, employee_token):
    """Test creating a new Take KT session"""
    response = client.post(
        "/api/take_kt/",
        headers=admin_token,
        json={
            "project_id": sample_project["id"],
            "email": employee_token["email"]
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert "message" in data
    assert "take_kt_id" in data
    assert "created successfully" in data["message"].lower()

def test_create_take_kt_session_unauthorized(client, employee_token, sample_project):
    """Test that non-admin users cannot create Take KT sessions"""
    response = client.post(
        "/api/take_kt/",
        headers=employee_token,
        json={
            "project_id": sample_project["id"],
            "email": employee_token["email"]
        }
    )
    
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "admin" in response.json()["detail"].lower()

def test_create_duplicate_take_kt_session(client, admin_token, sample_take_kt, sample_project, employee_token):
    """Test that duplicate Take KT sessions are rejected"""
    response = client.post(
        "/api/take_kt/",
        headers=admin_token,
        json={
            "project_id": sample_project["id"],
            "email": employee_token["email"]
        }
    )
    
    assert response.status_code == status.HTTP_409_CONFLICT
    assert "already has a take kt session" in response.json()["detail"].lower()

def test_list_take_kt_sessions_admin(client, admin_token, sample_take_kt):
    """Test listing Take KT sessions as admin"""
    response = client.get(
        "/api/take_kt/",
        headers=admin_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert isinstance(data, list)
    assert len(data) > 0
    
    session = data[0]
    assert "project_name" in session
    assert "project_id" in session
    assert "employee_email" in session
    assert "status" in session
    assert "take_kt_id" in session
    assert session["status"] == "Pending"

def test_list_take_kt_sessions_employee(client, employee_token, sample_take_kt):
    """Test listing Take KT sessions as employee"""
    response = client.get(
        "/api/take_kt/",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert isinstance(data, list)
    assert len(data) > 0
    
    session = data[0]
    assert "project_name" in session
    assert "project_id" in session
    assert "employee_email" in session
    assert "status" in session
    assert "take_kt_id" in session
    assert session["status"] == "Pending"

def test_delete_take_kt_session(client, admin_token, sample_take_kt):
    """Test deleting a Take KT session"""
    response = client.delete(
        f"/api/take_kt/{sample_take_kt['id']}",
        headers=admin_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    assert "successfully deleted" in response.json()["message"].lower()
    
    # Verify it's actually deleted
    response = client.get(
        "/api/take_kt/",
        headers=admin_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 0

def test_delete_take_kt_session_unauthorized(client, employee_token, sample_take_kt):
    """Test that non-admin users cannot delete Take KT sessions"""
    response = client.delete(
        f"/api/take_kt/{sample_take_kt['id']}",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "admin" in response.json()["detail"].lower()

def test_delete_nonexistent_take_kt_session(client, admin_token):
    """Test deleting a non-existent Take KT session"""
    response = client.delete(
        "/api/take_kt/999",
        headers=admin_token
    )
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "not found" in response.json()["detail"].lower()

def test_create_take_kt_with_kt_info(client, admin_token, sample_project, employee_token, sample_kt_info):
    """Test creating a Take KT session with existing KT info"""
    # First delete any existing take_kt sessions
    response = client.get(
        "/api/take_kt/",
        headers=admin_token
    )
    
    if response.status_code == status.HTTP_200_OK and len(response.json()) > 0:
        for session in response.json():
            client.delete(
                f"/api/take_kt/{session['take_kt_id']}",
                headers=admin_token
            )
    
    # Now create a new one
    response = client.post(
        "/api/take_kt/",
        headers=admin_token,
        json={
            "project_id": sample_project["id"],
            "email": employee_token["email"]
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert "message" in data
    assert "take_kt_id" in data
    assert "created successfully" in data["message"].lower()
    
    # Verify status is "Pending" since KT info exists
    response = client.get(
        "/api/take_kt/",
        headers=admin_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) > 0
    assert data[0]["status"] == "Pending"
