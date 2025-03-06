import os
import json
import requests
from typing import Dict, Any, List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def groq_calling_function(prompt):
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}"
    }

    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{
            "role": "user",
            "content": prompt
        }]
    }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data
        )
        response.raise_for_status()
        
        # Extract the generated text from the response
        generated_text = response.json()['choices'][0]['message']['content']
        
        # Parse the JSON from the generated text
        # Find the first { and last } to handle any extra text
        start = generated_text.find('{')
        end = generated_text.rfind('}') + 1
        json_str = generated_text[start:end]
        
        data = json.loads(json_str)
        return data

    except requests.exceptions.RequestException as e:
        raise Exception(f"Error calling Groq API: {str(e)}")
    except json.JSONDecodeError as e:
        raise Exception(f"Error parsing LLM response as JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error: {str(e)}")

def generate_toic_quiz(topic):
    """
    Generate quiz questions using Groq's LLM API for a single topic
    """

    prompt = f"""Generate a multiple choice quiz for the following topic: {topic}. 
    Create questions that cover the topic with 4 options each and one correct answer make sure there are enough questions.
    The quiz should have more than 8 questions.
    The question should test the in depth knowledge of the topic and should be representative of real world scenarios.
    Return the response in the following JSON format:
    {{
        "title": "Quiz title",
        "questions": [
            {{
                "id": 1,
                "question": "Question text",
                "options": ["option1", "option2", "option3", "option4"],
                "correctAnswer": "correct option",
                "points": 10,
                "topic":"topic"
            }}
        ]
    }}
    Make sure the response is a valid JSON string."""

    data = groq_calling_function(prompt)

    return data

def generate_assignment_questions(subjects):
    """
    Generate assignment questions using Groq's LLM API
    """

    subject_text = "\n\n".join(
    f"Subject: {subject['subject_name']}\nTopics: {', '.join(subject['topics'])}"
    for subject in subjects
    )

    prompt = f"""Generate a multiple choice quiz for the following subjects: \n\n{subject_text}. 
    Create questions that cover the topics with 4 options each and one correct answer make sure there are enough questions for each topic.
    The quiz should have more than 15 questions and each topic should be represented with different levels of questions (e.g., easy, medium, hard) from a proffessional point of view.
    Return the response in the following JSON format:
    {{
        "title": "Quiz title",
        "questions": [
            {{
                "id": 1,
                "question": "Question text",
                "options": ["option1", "option2", "option3", "option4"],
                "correctAnswer": "correct option",
                "points": 10,
                "topic":"topic"
            }}
        ]
    }}
    Make sure the response is a valid JSON string."""

    data = groq_calling_function(prompt)

    return data


learning_paths_json_structure = """ 
{
    "path_name":'<learning_path_name>',
    "total_estimated_hours": '<total_hours>',
    "subjects":[
        {
            "subject_name": "<subject_name>",
            "is_completed": "false",
            "is_started": "false",
            "estimated_hours": '<estimated_hours>',
            "assessment": {
                "threshold": '<threshold>',
                "score": 'null',
                "status": "pending"
            },
            "topics": [
                {
                    "topic_name": "<topic_name>",
                    "is_completed": "false"
                }
                ]
            "official_docs": ["<official_documentation_link>"]
        }
    ],
}
"""

def generate_learning_path(topics: List[str], scores: Dict[str, int]) -> Dict[str, Any]:
    """
    Generate a personalized learning path based on the provided topics and initial quiz scores.
    For each topic, the generated learning path will include an estimated number of study hours,
    an assessment configuration, and a link to official documentation.
    """
    
    # Map each topic to its initial score for context
    topics_scores = " ".join([f"{topic}: {scores.get(topic, 'N/A')}" for topic in topics])
    
    prompt = f"""Generate a personalized learning path for a professional project using the following topics and their corresponding initial quiz scores: {topics_scores}

For each topic, generate:
    - An estimated number of study hours required for mastery.
    - An assessment configuration that includes a passing threshold.
    - A link to official, freely available documentation (avoid promotional or unofficial sources).
    - Make sure you go in depth with each subject and there are enough numbers of topics in each subject.
Return the response in the following JSON format:
{learning_paths_json_structure}
Make sure the response is a valid JSON string."""

    data = groq_calling_function(prompt)

    return data
