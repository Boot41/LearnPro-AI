import os
import json
from re import escape
import requests
from typing import Dict, Any, List
from fastapi import HTTPException
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
        return groq_calling_function(prompt)
        raise Exception(f"Error parsing LLM response as JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error: {str(e)}")

def generate_digested_transcripts(raw_transcripts):
    prompt = f"""
    Below is the full transcript of a conversation containing comprehensive knowledge on a specific topic. Your task is to clean and standardize the transcript without removing or summarizing any information. The cleaned transcript will later be used as input for another LLM to answer questions based on the knowledge shared in the conversation. 

    Please follow these guidelines:
    1. Remove extraneous formatting (e.g., extra spaces, inconsistent line breaks, or non-essential symbols) while preserving all the content.
    2. Standardize speaker labels, punctuation, and capitalization to enhance readability.
    3. Maintain the original order and context of the conversation.
    4. Do not omit or alter any details—the cleaned transcript must contain every piece of information from the original.
    5. Ensure the final output is in plain text, making it easy for another LLM to parse and use for answering subsequent questions.

    Provide the cleaned transcript as the final output.

    Generate a digested version of the following transcripts: {raw_transcripts}.
    """
    print(prompt)
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
        
        return generated_text 
    except Exception as err:
        raise HTTPException(status_code = 500,detail=str(err))

def generate_toic_quiz(topic):
    """
    Generate quiz questions using Groq's LLM API for a single topic
    """

    # there should be a maximum of 3 three questions in this quiz as i am testing my system at this point.

    prompt = f"""Generate a multiple choice quiz for the following topic: {topic}. 
    Create questions that cover the topic with 4 options each and one correct answer.
    The questions should test the in depth knowledge of the topic and should be representative of real world scenarios.
    The quiz should have at least 10 questions.
    Make sure each question has only one correct option out of all four.
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
    prompt = f"""
    Create questions that cover the topics with four options each and one correct answer make sure there are enough questions for each topic.
    The quiz should have more than ten questions and each topic should be represented with different levels of questions (e.g., easy, medium, hard) from a proffessional point of view.
    Generate a multiple choice quiz for the following subjects: \n\n{subject_text}. 
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
    - An estimated number of study hours required for understanding a topic according to the user score in the topic .
    - Take the users score into account while generating the estimated hours if they have scored high in a topic the estimated hours should be less and vice versa.
    - Make sure the estimated hours are appropriate and not long and should NOT be more than actually required for that topic.
    - Make sure the subjects are divided into enough topics such that each topic takes only 2 hours to complete.
    - An assessment configuration that includes a passing threshold.
    - A link to official, freely available documentation (avoid promotional or unofficial sources).
    - Make sure you go in depth with each subject and there are enough numbers of topics in each subject.
Return the response in the following JSON format:
{learning_paths_json_structure}
Make sure the response is a valid JSON string."""

    print(prompt)
    data = groq_calling_function(prompt)

    return data
