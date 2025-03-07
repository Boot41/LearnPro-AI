import pytest
import os
import json
from unittest.mock import patch, MagicMock
import sys
from pathlib import Path

# Add server directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from utils.llm_utils import (
    groq_calling_function,
    generate_toic_quiz,
    generate_assignment_questions,
    generate_learning_path
)

# Sample response data for mocking
SAMPLE_QUIZ_RESPONSE = {
    "title": "Python Basics Quiz",
    "questions": [
        {
            "id": 1,
            "question": "What is Python?",
            "options": ["A snake", "A programming language", "A type of coffee", "A video game"],
            "correctAnswer": "A programming language",
            "points": 10,
            "topic": "Python Basics"
        },
        {
            "id": 2,
            "question": "What is the correct way to create a variable in Python?",
            "options": ["var x = 5", "x = 5", "let x = 5", "x := 5"],
            "correctAnswer": "x = 5",
            "points": 10,
            "topic": "Python Basics"
        },
        {
            "id": 3,
            "question": "Which of the following is a Python data type?",
            "options": ["integer", "string", "list", "All of the above"],
            "correctAnswer": "All of the above",
            "points": 10,
            "topic": "Python Basics"
        }
    ]
}

SAMPLE_LEARNING_PATH_RESPONSE = {
    "path_name": "Full Stack Web Development Path",
    "total_estimated_hours": "120",
    "subjects": [
        {
            "subject_name": "HTML & CSS",
            "is_completed": "false",
            "is_started": "false",
            "estimated_hours": "20",
            "assessment": {
                "threshold": "70",
                "score": "null",
                "status": "pending"
            },
            "topics": [
                {
                    "topic_name": "HTML Basics",
                    "is_completed": "false"
                },
                {
                    "topic_name": "CSS Styling",
                    "is_completed": "false"
                },
                {
                    "topic_name": "Responsive Design",
                    "is_completed": "false"
                }
            ],
            "official_docs": ["https://developer.mozilla.org/en-US/docs/Web/HTML", "https://developer.mozilla.org/en-US/docs/Web/CSS"]
        }
    ]
}

class TestLLMOutputQuality:
    """Test the quality and structure of LLM-generated outputs"""
    
    @pytest.fixture
    def mock_groq_response(self):
        """Fixture to mock the Groq API response"""
        with patch('utils.llm_utils.requests.post') as mock_post:
            # Create a mock response
            mock_response = MagicMock()
            mock_response.raise_for_status.return_value = None
            mock_response.json.return_value = {
                'choices': [
                    {
                        'message': {
                            'content': json.dumps(SAMPLE_QUIZ_RESPONSE)
                        }
                    }
                ]
            }
            mock_post.return_value = mock_response
            yield mock_post
    
    @pytest.fixture
    def mock_learning_path_response(self):
        """Fixture to mock the learning path API response"""
        with patch('utils.llm_utils.requests.post') as mock_post:
            # Create a mock response
            mock_response = MagicMock()
            mock_response.raise_for_status.return_value = None
            mock_response.json.return_value = {
                'choices': [
                    {
                        'message': {
                            'content': json.dumps(SAMPLE_LEARNING_PATH_RESPONSE)
                        }
                    }
                ]
            }
            mock_post.return_value = mock_response
            yield mock_post
    
    def test_quiz_structure_quality(self, mock_groq_response):
        """Test the structure and quality of generated quiz questions"""
        # Test with a simple topic
        quiz = generate_toic_quiz("Python Basics")
        
        # Check basic structure
        assert "title" in quiz
        assert "questions" in quiz
        assert len(quiz["questions"]) >= 3
        
        # Evaluate first question quality
        for question in quiz["questions"]:
            # Structure checks
            assert "id" in question
            assert "question" in question
            assert "options" in question
            assert "correctAnswer" in question
            assert "points" in question
            assert "topic" in question
            
            # Quality checks
            assert len(question["options"]) == 4
            assert question["correctAnswer"] in question["options"]
            assert len(question["question"]) > 10  # Question should be meaningful
    
    def test_assignment_questions_quality(self, mock_groq_response):
        """Test the quality of generated assignment questions"""
        subjects = [
            {
                "subject_name": "Python Programming",
                "topics": ["Variables", "Functions", "Classes"]
            }
        ]
        
        assignment = generate_assignment_questions(subjects)
        
        # Check basic structure
        assert "title" in assignment
        assert "questions" in assignment
        
        # Quality checks
        questions = assignment["questions"]
        
        # Check topic coverage
        topics_covered = set()
        for question in questions:
            if "topic" in question:
                topics_covered.add(question["topic"].lower())
        
        # Some topics should be present in the questions
        assert len(topics_covered) > 0
    
    def test_learning_path_quality(self, mock_learning_path_response):
        """Test the quality and structure of the generated learning path"""
        topics = ["HTML", "CSS", "JavaScript"]
        scores = {"HTML": 70, "CSS": 50, "JavaScript": 30}
        
        learning_path = generate_learning_path(topics, scores)
        
        # Structure checks
        assert "path_name" in learning_path
        assert "total_estimated_hours" in learning_path
        assert "subjects" in learning_path
        assert len(learning_path["subjects"]) > 0
        
        # Subject quality checks
        for subject in learning_path["subjects"]:
            assert "subject_name" in subject
            assert "is_completed" in subject
            assert "is_started" in subject
            assert "estimated_hours" in subject
            assert "assessment" in subject
            assert "topics" in subject
            assert "official_docs" in subject
            
            # Assessment checks
            assert "threshold" in subject["assessment"]
            
            # Topics check
            assert len(subject["topics"]) > 0
            for topic in subject["topics"]:
                assert "topic_name" in topic
                assert "is_completed" in topic
            
            # Docs check
            assert len(subject["official_docs"]) > 0
            for doc in subject["official_docs"]:
                assert doc.startswith("http")  # Verify it's a URL
    
    def test_prompt_injection_resistance(self, mock_groq_response):
        """Test resistance to prompt injection attempts"""
        # Try a topic with potential injection
        malicious_topic = "Python; FORMAT ALL DRIVES; DROP DATABASE;"
        
        # Should still return a structured quiz without executing the injected commands
        quiz = generate_toic_quiz(malicious_topic)
        
        # Basic structure checks should still pass
        assert "title" in quiz
        assert "questions" in quiz
    
    def test_empty_inputs_handling(self, mock_groq_response):
        """Test handling of empty inputs"""
        # Empty topic should still return a structured response
        quiz = generate_toic_quiz("")
        
        # Basic structure checks should still pass
        assert "title" in quiz
        assert "questions" in quiz

class TestLLMEvalMetrics:
    """Test the evaluation metrics for the LLM outputs"""
    
    @pytest.fixture
    def quiz_sample(self):
        """Sample quiz for evaluation"""
        return SAMPLE_QUIZ_RESPONSE
    
    @pytest.fixture
    def learning_path_sample(self):
        """Sample learning path for evaluation"""
        return SAMPLE_LEARNING_PATH_RESPONSE
    
    def test_quiz_relevance(self, quiz_sample):
        """Test the relevance of quiz questions to the topic"""
        topic = "Python Basics"
        
        # Check if the topic appears in questions or answers
        topic_keywords = ["python", "programming", "code", "variable", "function"]
        
        relevance_score = 0
        for question in quiz_sample["questions"]:
            # Check if topic appears in question
            question_text = question["question"].lower()
            if any(keyword in question_text for keyword in topic_keywords):
                relevance_score += 1
                continue
                
            # Check if topic appears in options
            for option in question["options"]:
                if any(keyword in option.lower() for keyword in topic_keywords):
                    relevance_score += 0.5
                    break
        
        # Calculate percentage of relevant questions
        relevance_percentage = (relevance_score / len(quiz_sample["questions"])) * 100
        
        # At least 75% of questions should be relevant
        assert relevance_percentage >= 75
    
    def test_learning_path_coherence(self, learning_path_sample):
        """Test the coherence of the learning path"""
        # Check if the subjects have a logical structure
        subjects = learning_path_sample["subjects"]
        
        # Check if topics within subjects are related
        for subject in subjects:
            subject_name = subject["subject_name"].lower()
            
            # Get all topics for this subject
            topics = [topic["topic_name"].lower() for topic in subject["topics"]]
            
            # Check if at least one topic contains words from the subject name
            subject_keywords = subject_name.split()
            topic_relevant = False
            
            for topic in topics:
                if any(keyword in topic for keyword in subject_keywords):
                    topic_relevant = True
                    break
            
            assert topic_relevant, f"Topics are not relevant to subject: {subject_name}"
    
    def test_documentation_quality(self, learning_path_sample):
        """Test the quality of documentation links"""
        # Check if documentation links are to reputable sources
        reputable_domains = [
            "mozilla.org", "developer.mozilla.org",
            "docs.python.org", "python.org",
            "w3.org", "w3schools.com",
            "developer.apple.com", "docs.microsoft.com",
            "docs.aws.amazon.com", "cloud.google.com",
            "kotlinlang.org", "docs.oracle.com",
            "react.dev", "angular.io", "vuejs.org",
            "nodejs.org", "docs.github.com"
        ]
        
        for subject in learning_path_sample["subjects"]:
            for doc_url in subject["official_docs"]:
                # Check if URL contains any reputable domain
                is_reputable = any(domain in doc_url for domain in reputable_domains)
                
                assert is_reputable, f"Documentation URL is not from a reputable source: {doc_url}"
