import pytest
from fastapi import status

def test_debug_login(client, db_session):
    """Debug test for login endpoint"""
    # Create user
    from models import User, UserType
    import auth as auth_utils
    
    employee_data = {
        "username": "debug_user@test.com",
        "email": "debug_user@test.com",
        "password": "debug_password"
    }
    
    # Create user directly in the database
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
    
    # Test login endpoint
    response = client.post(
        "/api/login", 
        json={
            "username": employee_data["username"],
            "password": employee_data["password"]
        }
    )
    
    
    # Print response for debugging
    print(f"Login response status: {response.status_code}")
    print(f"Login response body: {response.text}")
    
    assert response.status_code == status.HTTP_200_OK
    
    # Debug output
    data = response.json()
    for key in data:
        print(f"Response key: {key}")
    
    assert "access_token" in data
