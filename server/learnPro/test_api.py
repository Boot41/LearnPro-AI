#!/usr/bin/env python
"""
Test script for the LearnPro API endpoints.
This script tests the project creation and employee addition endpoints.
"""

import requests
import json
import sys

# API base URL
BASE_URL = "http://localhost:8001/api"

def test_create_project():
    """Test the project creation endpoint."""
    endpoint = f"{BASE_URL}/projects/"
    
    # Test data
    project_data = {
        "project_name": "Test Project",
        "project_description": "This is a test project created for testing the API",
        "required_skills": ["Python", "Django", "API Development"]
    }
    
    # Send POST request
    response = requests.post(endpoint, json=project_data)
    
    # Print results
    print("\n=== Create Project Test ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    # Return project ID if successful
    if response.status_code == 201:
        return response.json()["project"]["id"]
    return None

def test_add_employee(project_id=None):
    """Test the employee addition endpoint."""
    endpoint = f"{BASE_URL}/employees/"
    
    # Test data
    employee_data = {
        "employee_name": "Test Employee",
        "employee_email": "test.employee@example.com",
        "project_assigned": project_id or "Test Project"  # Use project ID if provided, otherwise use project name
    }
    
    # Send POST request
    response = requests.post(endpoint, json=employee_data)
    
    # Print results
    print("\n=== Add Employee Test ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def main():
    """Main function to run the tests."""
    print("Starting API tests...")
    
    # Test project creation
    project_id = test_create_project()
    
    # Test employee addition
    if project_id:
        test_add_employee(project_id)
    else:
        print("\nSkipping employee test because project creation failed.")
    
    print("\nTests completed.")

if __name__ == "__main__":
    main()
