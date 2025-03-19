"""
Tests for the llm_utils.py module
Using mocks to avoid making actual API calls
"""

import pytest
import json
import os
import requests
from unittest.mock import patch, MagicMock

import sys
import os
from pathlib import Path

# Make sure we can import from server directory
sys.path.append(str(Path(__file__).parent.parent))

from utils.llm_utils import (
    groq_calling_function, 
    generate_toic_quiz, 
    generate_assignment_questions,
    generate_learning_path
)

# Sample mock responses
MOCK_QUIZ_RESPONSE = {
    "questions": [
        {
            "question": "What is the main purpose of FastAPI?",
            "options": [
                "Data analysis",
                "Web development",
                "Machine learning",
                "Game development"
            ],
            "correct_answer": 1,
            "explanation": "FastAPI is a modern, high-performance web framework for building APIs with Python."
        },
        {
            "question": "Which feature is NOT provided by FastAPI?",
            "options": [
                "Automatic validation",
                "Interactive documentation",
                "Built-in ORM",
                "Dependency injection"
            ],
            "correct_answer": 2,
            "explanation": "FastAPI does not include a built-in ORM."
        }
    ]
}

MOCK_LEARNING_PATH = {
    "subjects": [
        {
            "subject_name": "Python",
            "estimated_hours": 10,
            "assessment": {
                "questions": 5,
                "time_limit_minutes": 30
            },
            "documentation_link": "https://docs.python.org/3/"
        },
        {
            "subject_name": "FastAPI",
            "estimated_hours": 8,
            "assessment": {
                "questions": 4,
                "time_limit_minutes": 25
            },
            "documentation_link": "https://fastapi.tiangolo.com/"
        }
    ]
}

MOCK_ASSIGNMENT = {
    "assignments": [
        {
            "title": "Build a REST API",
            "description": "Create a RESTful API with CRUD operations",
            "difficulty": "Intermediate",
            "estimated_time": "3 hours",
            "requirements": ["FastAPI", "SQLAlchemy", "Pydantic"],
            "grading_criteria": "Functionality, code quality, documentation"
        },
        {
            "title": "Data Visualization Project",
            "description": "Create visualizations for a dataset",
            "difficulty": "Beginner",
            "estimated_time": "2 hours",
            "requirements": ["Pandas", "Matplotlib"],
            "grading_criteria": "Clarity, insights, appropriate chart types"
        }
    ]
}

@patch.dict(os.environ, {"GROQ_API_KEY": "test_api_key"})
@patch('utils.llm_utils.requests.post')
def test_groq_calling_function(mock_post):
    """Test the Groq API calling function"""
    # Set up the mock response
    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        'choices': [
            {
                'message': {
                    'content': json.dumps(MOCK_QUIZ_RESPONSE)
                }
            }
        ]
    }
    mock_post.return_value = mock_response
    
    # Call the function
    result = groq_calling_function("Create a quiz about Python")
    
    # Assert results
    assert result == MOCK_QUIZ_RESPONSE
    mock_post.assert_called_once()
    
    # Verify API key was used
    args, kwargs = mock_post.call_args
    assert "Authorization" in kwargs["headers"]
    assert "Bearer test_api_key" in kwargs["headers"]["Authorization"]

@patch('utils.llm_utils.groq_calling_function')
def test_generate_toic_quiz(mock_groq):
    """Test generating a topic quiz"""
    # Set up the mock
    mock_groq.return_value = MOCK_QUIZ_RESPONSE
    
    # Call the function
    result = generate_toic_quiz("Python")
    
    # Assert the result
    assert "questions" in result
    assert len(result["questions"]) == 2
    mock_groq.assert_called_once()

@patch('utils.llm_utils.groq_calling_function')
def test_generate_assignment_questions(mock_groq):
    """Test generating assignment questions"""
    # Set up the mock
    mock_groq.return_value = MOCK_ASSIGNMENT
    
    # Create the proper subjects format
    subjects = [
        {
            "subject_name": "Python",
            "topics": ["Basics", "OOP", "Libraries"]
        },
        {
            "subject_name": "FastAPI",
            "topics": ["Routing", "Validation", "Middleware"]
        }
    ]
    
    # Call the function
    result = generate_assignment_questions(subjects)
    
    # Assert the result
    assert "assignments" in result
    assert len(result["assignments"]) == 2
    mock_groq.assert_called_once()

@patch('utils.llm_utils.groq_calling_function')
def test_generate_learning_path(mock_groq):
    """Test generating a learning path"""
    # Set up the mock
    mock_groq.return_value = MOCK_LEARNING_PATH
    
    # Call the function
    scores = {"Python": 70, "FastAPI": 50}
    result = generate_learning_path(["Python", "FastAPI"], scores)
    
    # Verify the result
    assert result == MOCK_LEARNING_PATH
    assert "subjects" in result
    assert len(result["subjects"]) == 2
    assert result["subjects"][0]["subject_name"] == "Python"
    assert result["subjects"][1]["subject_name"] == "FastAPI"

@patch('utils.llm_utils.requests.post')
def test_groq_calling_function_error_handling(mock_post):
    """Test error handling in the Groq API calling function"""
    # Test request exception
    mock_post.side_effect = requests.exceptions.RequestException("API error")
    
    with pytest.raises(Exception) as exc_info:
        groq_calling_function("Test prompt")
    
    assert "Error calling Groq API" in str(exc_info.value)
    
    # Test JSON decode error
    mock_post.side_effect = None
    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        'choices': [
            {
                'message': {
                    'content': "Not a valid JSON"
                }
            }
        ]
    }
    mock_post.return_value = mock_response
    
    # Patch json.loads to raise JSONDecodeError
    with patch('json.loads') as mock_loads:
        mock_loads.side_effect = json.JSONDecodeError("Invalid JSON", "", 0)
        with pytest.raises(Exception) as exc_info:
            groq_calling_function("Test prompt")
        
        assert "Error parsing LLM response as JSON" in str(exc_info.value)

@patch.dict(os.environ, {})
@patch('os.getenv', return_value=None)
def test_groq_api_key_missing(mock_getenv):
    """Test behavior when API key is missing"""
    with pytest.raises(ValueError) as exc_info:
        groq_calling_function("Test prompt")
    
    assert "GROQ_API_KEY environment variable is not set" in str(exc_info.value)
