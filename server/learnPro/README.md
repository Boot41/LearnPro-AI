# LearnPro API Documentation

This document provides information about the LearnPro API endpoints and how to use them.

## Setup and Installation

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install django
   ```

3. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. Start the development server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### 1. Create a New Project

**Endpoint:** `/api/projects/`  
**Method:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
  "project_name": "Web Development Project",
  "project_description": "A project to develop a web application using React and Django",
  "required_skills": ["React", "Django", "JavaScript", "Python"]
}
```

**Response (Success - 201 Created):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "project_name": "Web Development Project",
    "project_description": "A project to develop a web application using React and Django",
    "required_skills": ["React", "Django", "JavaScript", "Python"],
    "created_at": "2025-03-04T05:30:00.000Z"
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "error": "Project name is required"
}
```

### 2. Add an Employee

**Endpoint:** `/api/employees/`  
**Method:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
  "employee_name": "John Doe",
  "employee_email": "john.doe@example.com",
  "project_assigned": 1  // Can be project ID or project name
}
```

**Response (Success - 201 Created):**
```json
{
  "message": "Employee added successfully",
  "employee": {
    "id": 1,
    "employee_name": "John Doe",
    "employee_email": "john.doe@example.com",
    "project_assigned": {
      "id": 1,
      "project_name": "Web Development Project"
    },
    "created_at": "2025-03-04T05:35:00.000Z"
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "error": "Employee email is required"
}
```

**Response (Error - 404 Not Found):**
```json
{
  "error": "Project not found: 999"
}
```

## Testing the API

You can test the API using tools like curl, Postman, or any HTTP client:

### Create a Project:
```bash
curl -X POST http://localhost:8000/api/projects/ \
  -H "Content-Type: application/json" \
  -d '{"project_name": "Web Development Project", "project_description": "A project to develop a web application", "required_skills": ["React", "Django", "JavaScript"]}'
```

### Add an Employee:
```bash
curl -X POST http://localhost:8000/api/employees/ \
  -H "Content-Type: application/json" \
  -d '{"employee_name": "John Doe", "employee_email": "john.doe@example.com", "project_assigned": 1}'
```
