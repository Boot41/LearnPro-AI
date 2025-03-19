import pytest
from fastapi import status
import json
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta

# Mock the calendar_utils.create_calendar_event function
@pytest.fixture(autouse=True)
def mock_calendar():
    with patch('routers.give_kt.create_calendar_event') as mock_calendar:
        mock_calendar.return_value = True
        yield mock_calendar

# Mock the llm_utils.generate_digested_transcripts function
@pytest.fixture(autouse=True)
def mock_llm():
    with patch('routers.give_kt.generate_digested_transcripts') as mock_llm:
        mock_llm.return_value = "Digested KT information"
        yield mock_llm

@pytest.fixture
def sample_give_kt(db_session, sample_project, employee_token):
    """Create a sample GiveKT entry for testing"""
    from models import GiveKT
    
    employee_id = int(employee_token["user_id"])
    project_id = sample_project["id"]
    
    give_kt = GiveKT(
        project_id=project_id,
        employee_id=employee_id,
        given_kt_info_id=None
    )
    
    db_session.add(give_kt)
    db_session.commit()
    db_session.refresh(give_kt)
    
    return {
        "id": give_kt.id,
        "project_id": project_id,
        "employee_id": employee_id
    }

def test_create_kt_session(client, admin_token, sample_project, employee_token):
    """Test creating a new KT session"""
    employee_id = int(employee_token["user_id"])
    
    response = client.post(
        "/api/give_kt/",
        headers=admin_token,
        json={
            "project_id": sample_project["id"],
            "employee_id": employee_id
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert "id" in data
    assert data["project_id"] == sample_project["id"]
    assert data["employee_id"] == employee_id
    assert data["given_kt_info_id"] is None

def test_create_kt_session_unauthorized(client, employee_token, sample_project):
    """Test that non-admin users cannot create KT sessions"""
    response = client.post(
        "/api/give_kt/",
        headers=employee_token,
        json={
            "project_id": sample_project["id"],
            "employee_id": int(employee_token["user_id"])
        }
    )
    
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "admin" in response.json()["detail"].lower()

def test_create_duplicate_kt_session(client, admin_token, sample_give_kt):
    """Test that duplicate KT sessions are rejected"""
    response = client.post(
        "/api/give_kt/",
        headers=admin_token,
        json={
            "project_id": sample_give_kt["project_id"],
            "employee_id": sample_give_kt["employee_id"]
        }
    )
    
    assert response.status_code == status.HTTP_409_CONFLICT
    assert "already exists" in response.json()["detail"].lower()

def test_delete_kt_session(client, admin_token, sample_give_kt):
    """Test deleting a KT session"""
    response = client.delete(
        f"/api/give_kt/{sample_give_kt['project_id']}",
        headers=admin_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    assert "successfully deleted" in response.json()["message"].lower()
    
    # Verify it's actually deleted
    response = client.get(
        "/api/give_kt/",
        headers=admin_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 0

def test_delete_kt_session_unauthorized(client, employee_token, sample_give_kt):
    """Test that non-admin users cannot delete KT sessions"""
    response = client.delete(
        f"/api/give_kt/{sample_give_kt['project_id']}",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "admin" in response.json()["detail"].lower()

def test_list_kt_sessions_admin(client, admin_token, sample_give_kt, db_session):
    """Test listing KT sessions as admin"""
    response = client.get(
        "/api/give_kt/",
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
    assert session["status"] == "Pending"

def test_list_kt_sessions_employee(client, employee_token, sample_give_kt):
    """Test listing KT sessions as employee"""
    response = client.get(
        "/api/give_kt/",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert isinstance(data, dict)
    assert "project_name" in data
    assert "project_id" in data
    assert "employee_email" in data
    assert "status" in data
    assert data["status"] == "Pending"

def test_save_kt_info(client, employee_token, sample_give_kt, db_session):
    """Test saving KT information"""
    from models import TakeKt, KtInfo
    
    # Create a TakeKt entry for testing
    take_kt = TakeKt(
        project_id=sample_give_kt["project_id"],
        employee_id=sample_give_kt["employee_id"],
        status="Kt not created"
    )
    db_session.add(take_kt)
    db_session.commit()
    
    response = client.post(
        "/api/give_kt/save-kt-info",
        headers=employee_token,
        json={
            "kt_transcripts": ["Transcript 1", "Transcript 2"],
            "give_kt_id": sample_give_kt["id"]
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    
    # Check that KT info exists with the right project_id
    kt_info = db_session.query(KtInfo).filter(
        KtInfo.project_id == sample_give_kt["project_id"],
        KtInfo.employee_id == sample_give_kt["employee_id"]
    ).first()
    
    assert kt_info is not None
    # Check if the transcripts were saved correctly
    assert "Transcript 1" in kt_info.original_transcripts
    assert "Transcript 2" in kt_info.original_transcripts
    
    # Verify GiveKT was updated
    response = client.get(
        "/api/give_kt/",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "Completed"

def test_get_pending_kt_details(client, employee_token, sample_give_kt):
    """Test getting pending KT details"""
    response = client.get(
        "/api/give_kt/pending",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    assert "give_kt_id" in data
    assert "project_id" in data
    assert "project_name" in data
    assert "project_description" in data
    assert "employee_id" in data
    assert "employee_name" in data
    assert "employee_email" in data
    
    assert data["give_kt_id"] == sample_give_kt["id"]
    assert data["project_id"] == sample_give_kt["project_id"]
    assert data["employee_id"] == sample_give_kt["employee_id"]
