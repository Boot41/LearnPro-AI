import pytest
from fastapi import status
import os
import json
from unittest.mock import patch, MagicMock

# Mock the LiveKit API for testing
@pytest.fixture(autouse=True)
def mock_livekit_api():
    with patch('routers.livekit.api') as mock_api:
        # Mock the token generation process directly in the router
        with patch('routers.livekit.generate_token', return_value="mock_jwt_token"):
            # Set environment variables for testing
            os.environ['LIVEKIT_API_KEY'] = 'test_api_key'
            os.environ['LIVEKIT_API_SECRET'] = 'test_api_secret'
            os.environ['LIVEKIT_URL'] = 'https://test-livekit-server.com'
            
            yield mock_api

# Mock the project_info_for_give_kt function
@pytest.fixture
def mock_project_info():
    with patch('routers.livekit.project_info_for_give_kt') as mock_func:
        # Use a dictionary instead of MagicMock to make it JSON serializable
        mock_func.return_value = {
            'id': 1,
            'name': 'Test Project',
            'description': 'Test Description',
            'give_kt_id': 1
        }
        yield mock_func

# Mock the next_incomplete_topic function
@pytest.fixture
def mock_next_topic():
    with patch('routers.livekit.next_incomplete_topic') as mock_func:
        # Use a dictionary instead of MagicMock to make it JSON serializable
        mock_func.return_value = {
            'topic_name': 'Test Topic',
            'subject': {
                'subject_name': 'Test Subject'
            }
        }
        yield mock_func

def test_generate_token_for_take_kt(client, employee_token, mock_project_info):
    """Test generating a token for take KT"""
    response = client.post(
        "/generate_token/take_kt",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Verify response structure
    assert "participantToken" in data
    assert "serverUrl" in data
    assert "conversation_type" in data
    assert "assignmentDetails" in data
    
    # Verify token and conversation type
    assert data["participantToken"] == "mock_jwt_token"
    assert data["conversation_type"] == "bot_gives_kt_to_employee"
    assert data["serverUrl"] == "https://test-livekit-server.com"
    
    # Verify assignment details
    assert data["assignmentDetails"]["id"] == 1
    assert data["assignmentDetails"]["name"] == "Test Project"

def test_generate_token_for_give_kt(client, employee_token, mock_project_info):
    """Test generating a token for give KT"""
    response = client.post(
        "/generate_token/give_kt",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Verify response structure
    assert "participantToken" in data
    assert "serverUrl" in data
    assert "conversation_type" in data
    assert "assignmentDetails" in data
    assert "give_kt_id" in data
    
    # Verify token and conversation type
    assert data["participantToken"] == "mock_jwt_token"
    assert data["conversation_type"] == "bot_takes_kt_from_employee"
    assert data["serverUrl"] == "https://test-livekit-server.com"
    assert data["give_kt_id"] == 1
    
    # Verify assignment details
    assert data["assignmentDetails"]["id"] == 1
    assert data["assignmentDetails"]["name"] == "Test Project"

def test_generate_token(client, employee_token, mock_next_topic):
    """Test generating a general token"""
    response = client.post(
        "/generate_token",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Verify response structure
    assert "participantToken" in data
    assert "serverUrl" in data
    assert "assignmentDetails" in data
    
    # Verify token
    assert data["participantToken"] == "mock_jwt_token"
    assert data["serverUrl"] == "https://test-livekit-server.com"
    
    # Verify assignment details
    assert data["assignmentDetails"]["topic_name"] == "Test Topic"
    assert data["assignmentDetails"]["subject"]["subject_name"] == "Test Subject"

def test_unauthorized_access(client):
    """Test that unauthorized access is rejected"""
    # Try to access endpoints without token
    endpoints = [
        "/generate_token/take_kt",
        "/generate_token/give_kt",
        "/generate_token"
    ]
    
    for endpoint in endpoints:
        response = client.post(endpoint)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_error_handling(client, employee_token, mock_project_info):
    """Test error handling when exceptions occur"""
    # Make the mock function raise an exception
    mock_project_info.side_effect = Exception("Test error")
    
    response = client.post(
        "/generate_token/take_kt",
        headers=employee_token
    )
    
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert "Test error" in response.json()["detail"]

def test_missing_environment_variables(client, employee_token):
    """Test handling of missing environment variables"""
    # Remove environment variables
    with patch.dict(os.environ, {}, clear=True):
        response = client.post(
            "/generate_token/take_kt",
            headers=employee_token
        )
        
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert "Missing required environment variables" in response.json()["detail"]

def test_invalid_room_name(client, employee_token, mock_project_info):
    """Test handling of invalid room name"""
    # Test with invalid characters in room name
    with patch('routers.livekit.project_info_for_give_kt') as mock_func:
        mock_func.return_value = {
            'id': 1,
            'name': 'Test Project with invalid/characters!',
            'description': 'Test Description',
            'give_kt_id': 1
        }
        
        response = client.post(
            "/generate_token/take_kt",
            headers=employee_token
        )
        
        # Should still work, but sanitize the room name
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "participantToken" in data
