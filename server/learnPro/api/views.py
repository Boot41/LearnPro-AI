from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate
from django.db import transaction
from .models import Project, Employee, User, LearningPath, Quiz
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .utils.llm_utils import generate_learning_path, generate_assignment_questions

def sample_api(request):
    return JsonResponse({'message': 'Hello, World!'})

@csrf_exempt
@require_http_methods(["GET"])
def get_user_learning_path(request, user_id):
    """
    Endpoint to retrieve the learning path created for a user.
    
    HTTP Method: GET
    URL: /api/users/{user_id}/learning_path/
    
    Response:
    - 200 OK: Learning path retrieved successfully with details.
    - 404 Not Found: User not found or no learning path exists.
    - 500 Internal Server Error: Server-side error.
    """
    try:
        # Try to get the user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': f'User not found with ID: {user_id}'}, status=404)
        
        # Check if the user has a learning path
        if not user.learning_path:
            return JsonResponse({'error': 'No learning path found for this user'}, status=404)
        
        # Get the learning path
        learning_path = user.learning_path
        
        # Return the learning path details
        return JsonResponse({
            'learning_path': {
                'id': learning_path.id,
                'title': learning_path.title,
                'description': learning_path.description,
                'total_estimated_hours': learning_path.total_estimated_hours,
                'calendar_locked': learning_path.calendar_locked,
                'topics': learning_path.get_topics(),
                'created_at': learning_path.created_at.isoformat(),
                'updated_at': learning_path.updated_at.isoformat()
            }
        }, status=200)
        
    except Exception as e:
        # Handle other exceptions
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def create_project(request):
    """
    Endpoint to create a new project with knowledge assessment quizzes for each topic.
    
    HTTP Method: POST
    URL: /api/projects/
    
    Request Body:
    - project_name (string): The name of the project.
    - project_description (string): A detailed description of the project.
    - subjects (array of objects): The subjects that will be covered in the project.
        - subject_name (string): The name of the subject.
        - topics (array of string): The topics that will be covered in the subject.
            - topic_name (string)
    
    Response:
    - 201 Created: Project created successfully with project details and quiz information.
    - 400 Bad Request: Invalid input data.
    - 500 Internal Server Error: Server-side error.
    """
    try:
        # Parse the request body
        data = json.loads(request.body)
        
        # Validate required fields
        if not data.get('project_name'):
            return JsonResponse({'error': 'Project name is required'}, status=400)
        
        if not data.get('project_description'):
            return JsonResponse({'error': 'Project description is required'}, status=400)
        
        if not data.get('subjects') or not isinstance(data.get('subjects'), list):
            return JsonResponse({'error': 'Subjects must be provided as an array of objects'}, status=400)
        
        # Create a new project instance
        project = Project(
            project_name=data['project_name'],
            project_description=data['project_description'],
            subjects=data['subjects']
        )
        
        # Save the project to the database
        project.full_clean()  # Validate model fields
        project.save()
        
        # Create a single knowledge assessment quiz for all the topics
        subjects = data['subjects']
        
        try:
            # Generate quiz questions using the LLM utility
            quiz_data = generate_assignment_questions(subjects)
            
            # Create a new Quiz instance
            quiz = Quiz(
                title=f"Knowledge Assessment",
                project=project,
                is_knowledge_assessment=True
            )
            
            # Set the questions JSON
            quiz.set_questions(quiz_data)
            
            # Save the quiz
            quiz.save()
        except Exception as e:
            # Log the error but continue with other topics
            print(f"Error creating quiz for project {project.project_name}: {str(e)}")
        
        # Return success response with project details and created quizzes
        return JsonResponse({
            'message': 'Project created successfully with knowledge assessment quizzes',
            'project': {
                'id': project.id,
                'project_name': project.project_name,
                'project_description': project.project_description,
                'created_at': project.created_at.isoformat()
            },
            'quiz': {
                'id': quiz.id,
                'title': quiz.title,
            }
        }, status=201)
        
    except ValidationError as e:
        # Handle validation errors
        return JsonResponse({'error': str(e)}, status=400)
    except json.JSONDecodeError:
        # Handle invalid JSON
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        # Handle other exceptions
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def add_employee(request):
    """
    Endpoint to add a new employee and assign them to a project.
    
    HTTP Method: POST
    URL: /api/employees/
    
    Request Body:
    - employee_name (string): The full name of the employee.
    - employee_email (string): The email address of the employee.
    - project_assigned (int or string): The ID or name of the project to assign.
    
    Response:
    - 201 Created: Employee added successfully with employee details.
    - 400 Bad Request: Invalid input data.
    - 404 Not Found: Project not found.
    - 500 Internal Server Error: Server-side error.
    """
    try:
        # Parse the request body
        data = json.loads(request.body)
        
        # Validate required fields
        if not data.get('employee_name'):
            return JsonResponse({'error': 'Employee name is required'}, status=400)
        
        if not data.get('employee_email'):
            return JsonResponse({'error': 'Employee email is required'}, status=400)
        
        # Create a new employee instance
        employee = Employee(
            employee_name=data['employee_name'],
            employee_email=data['employee_email']
        )
        
        # Assign project if provided
        if data.get('project_assigned'):
            project_assigned = data['project_assigned']
            try:
                # Try to get project by ID (if project_assigned is an integer)
                if isinstance(project_assigned, int) or str(project_assigned).isdigit():
                    project = Project.objects.get(id=int(project_assigned))
                else:
                    # Try to get project by name
                    project = Project.objects.get(project_name=project_assigned)
                
                # Assign the project
                employee.current_project = project
                
            except Project.DoesNotExist:
                return JsonResponse({'error': f'Project not found: {project_assigned}'}, status=404)
        
        # Save the employee to the database
        employee.full_clean()  # Validate model fields
        employee.save()
        
        # Return success response with employee details
        response_data = {
            'message': 'Employee added successfully',
            'employee': {
                'id': employee.id,
                'employee_name': employee.employee_name,
                'employee_email': employee.employee_email,
                'created_at': employee.created_at.isoformat()
            }
        }
        
        # Add project details if assigned
        if employee.current_project:
            response_data['employee']['current_project'] = {
                'id': employee.current_project.id,
                'project_name': employee.current_project.project_name
            }
        
        return JsonResponse(response_data, status=201)
        
    except ValidationError as e:
        # Handle validation errors
        return JsonResponse({'error': str(e)}, status=400)
    except IntegrityError as e:
        # Handle integrity errors (e.g., duplicate email)
        if 'unique constraint' in str(e).lower() and 'employee_email' in str(e).lower():
            return JsonResponse({'error': 'An employee with this email already exists'}, status=400)
        return JsonResponse({'error': str(e)}, status=400)
    except json.JSONDecodeError:
        # Handle invalid JSON
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        # Handle other exceptions
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def user_login(request):
    """
    Endpoint for user login, which checks if the user needs to take a knowledge assessment quiz.
    
    HTTP Method: POST
    URL: /api/login/
    
    Request Body:
    - username (string): The username of the user.
    - password (string): The password of the user.
    
    Response:
    - 200 OK: Login successful with user details and assessment quiz if needed.
    - 400 Bad Request: Invalid input data.
    - 401 Unauthorized: Invalid credentials.
    - 500 Internal Server Error: Server-side error.
    """
    try:
        # Parse the request body
        data = json.loads(request.body)
        
        # Validate required fields
        if not data.get('username'):
            return JsonResponse({'error': 'Username is required'}, status=400)
        
        if not data.get('password'):
            return JsonResponse({'error': 'Password is required'}, status=400)
        
        # Authenticate user
        user = authenticate(username=data['username'], password=data['password'])
        
        if not user:
            # Invalid credentials
            return JsonResponse({'error': 'Invalid username or password'}, status=401)
        
        # Get employee information if available
        employee_data = None
        try:
            employee = user.employee
            employee_data = {
                'id': employee.id,
                'employee_name': employee.employee_name,
                'employee_email': employee.employee_email
            }
            
            # Add current project details if assigned
            if employee.current_project:
                employee_data['current_project'] = {
                    'id': employee.current_project.id,
                    'project_name': employee.current_project.project_name
                }
        except:
            # No employee profile associated with this user
            pass
        
        # Check if this is a first-time login and the user has not taken the assessment
        assessment_needed = False
        assessment_quiz = None
        learning_path_data = None
        
        if user.is_first_login and employee and employee.current_project and not user.has_taken_assessment:
            # User needs to take knowledge assessment quiz
            assessment_needed = True
            
            # Get the knowledge assessment quizzes for the assigned project
            project_quizzes = Quiz.objects.filter(
                project=employee.current_project,
                is_knowledge_assessment=True
            )
            
            if project_quizzes.exists():
                # Take the first quiz for simplicity (in a more complex app, we might assign specific quizzes)
                quiz = project_quizzes.first()
                
                # Prepare the quiz data
                assessment_quiz = {
                    'id': quiz.id,
                    'title': quiz.title,
                    'topic': quiz.topic,
                    'subject': quiz.subject,
                    'questions': quiz.get_questions()
                }
        
        # Check if the user already has a learning path
        if user.learning_path:
            learning_path = user.learning_path
            learning_path_data = {
                'id': learning_path.id,
                'title': learning_path.title,
                'description': learning_path.description,
                'total_estimated_hours': learning_path.total_estimated_hours,
                'topics': learning_path.get_topics(),
                'calendar_locked': learning_path.calendar_locked
            }
        
        # Return success response with user details and assessment info
        response_data = {
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_first_login': user.is_first_login,
                'has_taken_assessment': user.has_taken_assessment
            },
            'employee': employee_data,
            'assessment_needed': assessment_needed,
            'learning_path': learning_path_data
        }
        
        # Add assessment quiz if needed
        if assessment_needed and assessment_quiz:
            response_data['assessment_quiz'] = assessment_quiz
        
        return JsonResponse(response_data, status=200)
        
    except ValidationError as e:
        # Handle validation errors
        return JsonResponse({'error': str(e)}, status=400)
    except json.JSONDecodeError:
        # Handle invalid JSON
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        # Handle other exceptions
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def submit_assessment_quiz(request, quiz_id):

    """
    Endpoint for submitting a knowledge assessment quiz and generating a personalized learning path.
    
    HTTP Method: POST
    URL: /api/quiz/{quiz_id}/submit/
    
    Request Body:
    - user_id (int): The ID of the user submitting the quiz.
    - answers (array): Array of user's answers with question IDs and selected answers.
    
    Response:
    - 200 OK: Quiz submitted successfully with score and generated learning path.
    - 400 Bad Request: Invalid input data.
    - 404 Not Found: Quiz or user not found.
    - 500 Internal Server Error: Server-side error.
    """
    try:
        # Parse the request body
        data = json.loads(request.body)
        
        # Validate required fields
        if not data.get('user_id'):
            return JsonResponse({'error': 'User ID is required'}, status=400)
        
        if not data.get('answers') or not isinstance(data.get('answers'), list):
            return JsonResponse({'error': 'Answers must be provided as an array'}, status=400)
        
        # Try to get the quiz
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return JsonResponse({'error': f'Quiz not found with ID: {quiz_id}'}, status=404)
        
        # Try to get the user
        try:
            user = User.objects.get(id=data['user_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': f'User not found with ID: {data["user_id"]}'}, status=404)
        
        # Get the employee associated with the user
        try:
            employee = user.employee
        except:
            return JsonResponse({'error': 'No employee profile associated with this user'}, status=400)
        
        # Calculate the quiz score
        quiz_questions = quiz.get_questions()
        total_questions = len(quiz_questions.get('questions', []))
        correct_answers = 0
        
        # Match user answers with correct answers
        user_answers = {answer['question_id']: answer['selected_answer'] for answer in data['answers']}
        
        for i, question in enumerate(quiz_questions.get('questions', [])):
            question_id = question.get('id', i + 1)  # Use index + 1 as fallback ID
            if question_id in user_answers:
                if user_answers[question_id] == question.get('correctAnswer'):
                    correct_answers += 1
        
        # Calculate percentage score
        score = 0 if total_questions == 0 else (correct_answers / total_questions) * 100
        score = int(score)  # Convert to integer percentage
        
        # Update the quiz with the user's score
        quiz.user = user
        quiz.completed = True
        quiz.score = score
        quiz.save()
        
        # Update user's assessment status
        user.has_taken_assessment = True
        user.save()
        
        # Collect topics and scores for learning path generation
        topics_scores = {}
        if quiz.project:
            # Get all assessment quizzes for this project completed by the user
            completed_quizzes = Quiz.objects.filter(
                project=quiz.project,
                user=user,
                completed=True,
                is_knowledge_assessment=True
            )
            
            # Collect scores by topic
            for completed_quiz in completed_quizzes:
                topics_scores[completed_quiz.topic] = completed_quiz.score
        
        # Generate a personalized learning path based on the scores
        with transaction.atomic():
            try:
                # Get the topics from the project
                project_topics = quiz.project.get_topics_as_list()
                
                # Add missing topics with default score of 0
                for topic in project_topics:
                    if topic not in topics_scores:
                        topics_scores[topic] = 0
                
                # Call the LLM utility to generate the learning path
                learning_path_data = generate_learning_path(list(topics_scores.keys()), topics_scores)
                
                # Extract relevant data
                path_details = learning_path_data.get('learning_path', {})
                total_hours = path_details.get('total_estimated_hours', 0)
                topics_data = path_details.get('topics', [])
                
                # Create a new LearningPath instance
                learning_path = LearningPath(
                    title=f"Personalized Learning Path for {user.username}",
                    description=f"Generated based on your knowledge assessment for {quiz.project.project_name}",
                    total_estimated_hours=total_hours,
                    calendar_locked=learning_path_data.get('calendar_locked', False),
                    project=quiz.project
                )
                
                # Set the topics JSON
                learning_path.set_topics(topics_data)
                
                # Save the learning path
                learning_path.save()
                
                # Associate the learning path with the user
                user.learning_path = learning_path
                user.is_first_login = False  # User has completed first login flow
                user.save()
                
                # Return success response with quiz results and generated learning path
                return JsonResponse({
                    'message': 'Assessment quiz submitted successfully and learning path generated',
                    'quiz_result': {
                        'id': quiz.id,
                        'title': quiz.title,
                        'total_questions': total_questions,
                        'correct_answers': correct_answers,
                        'score': score
                    },
                    'learning_path': {
                        'id': learning_path.id,
                        'title': learning_path.title,
                        'description': learning_path.description,
                        'total_estimated_hours': learning_path.total_estimated_hours,
                        'topics': learning_path.get_topics(),
                        'calendar_locked': learning_path.calendar_locked
                    }
                }, status=200)
                
            except Exception as e:
                # Log the error
                print(f"Error generating learning path: {str(e)}")
                
                # Create a fallback learning path with minimal data
                fallback_path = LearningPath(
                    title=f"Basic Learning Path for {user.username}",
                    description=f"A basic learning path for {quiz.project.project_name}",
                    total_estimated_hours=40,
                    project=quiz.project
                )
                
                # Create a simple topics structure
                fallback_topics = [
                    {
                        "topic_name": topic,
                        "estimated_hours": 8,
                        "quiz": {"questions": [], "passing_score": 70},
                        "assessment": {"threshold": 70, "status": "pending"},
                        "official_docs": f"https://docs.example.com/{topic.lower().replace(' ', '_')}"
                    }
                    for topic in topics_scores.keys()
                ]
                
                # Set the fallback topics
                fallback_path.set_topics(fallback_topics)
                
                # Save the fallback path
                fallback_path.save()
                
                # Associate with the user
                user.learning_path = fallback_path
                user.is_first_login = False  # User has completed first login flow
                user.save()
                
                # Return success response with quiz results and fallback learning path
                return JsonResponse({
                    'message': 'Assessment quiz submitted successfully with fallback learning path',
                    'quiz_result': {
                        'id': quiz.id,
                        'title': quiz.title,
                        'total_questions': total_questions,
                        'correct_answers': correct_answers,
                        'score': score
                    },
                    'learning_path': {
                        'id': fallback_path.id,
                        'title': fallback_path.title,
                        'description': fallback_path.description,
                        'total_estimated_hours': fallback_path.total_estimated_hours,
                        'topics': fallback_path.get_topics(),
                        'calendar_locked': fallback_path.calendar_locked
                    }
                }, status=200)
        
    except ValidationError as e:
        # Handle validation errors
        return JsonResponse({'error': str(e)}, status=400)
    except json.JSONDecodeError:
        # Handle invalid JSON
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        # Handle other exceptions
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


def generate_user_learning_path(user):
    """
    Helper function to generate a learning path for a user using the LLM utility.
    
    Args:
        user (User): The user to generate a learning path for.
        
    Returns:
        LearningPath: The generated learning path instance.
    """
    with transaction.atomic():
        # Define default topics and skills for the learning path
        # In a real application, these might come from the user's profile, interests, etc.
        default_topics = ["Python", "JavaScript", "React", "Django", "API Development"]
        default_scores = {"Python": 70, "JavaScript": 50, "React": 30, "Django": 40, "API Development": 60}
        
        try:
            # Call the LLM utility to generate the learning path
            learning_path_data = generate_learning_path(default_topics, default_scores)
            
            # Extract relevant data
            path_details = learning_path_data.get('learning_path', {})
            total_hours = path_details.get('total_estimated_hours', 0)
            topics_data = path_details.get('topics', [])
            
            # Create a new LearningPath instance
            learning_path = LearningPath(
                title=f"Personalized Learning Path for {user.username}",
                description="Automatically generated learning path based on your skills and interests.",
                total_estimated_hours=total_hours,
                calendar_locked=learning_path_data.get('calendar_locked', False)
            )
            
            # Set the topics JSON
            learning_path.set_topics(topics_data)
            
            # Save the learning path
            learning_path.save()
            
            # Associate the learning path with the user
            user.learning_path = learning_path
            user.save()
            
            return learning_path
            
        except Exception as e:
            # Log the error
            print(f"Error generating learning path: {str(e)}")
            
            # Create a fallback learning path with minimal data
            fallback_path = LearningPath(
                title=f"Basic Learning Path for {user.username}",
                description="A basic learning path to get you started.",
                total_estimated_hours=40
            )
            
            # Create a simple topics structure
            fallback_topics = [
                {
                    "topic_name": topic,
                    "estimated_hours": 8,
                    "quiz": {"questions": [], "passing_score": 70},
                    "assessment": {"threshold": 70, "status": "pending"},
                    "official_docs": f"https://docs.example.com/{topic.lower().replace(' ', '_')}"
                }
                for topic in default_topics
            ]
            
            # Set the fallback topics
            fallback_path.set_topics(fallback_topics)
            
            # Save the fallback path
            fallback_path.save()
            
            # Associate with the user
            user.learning_path = fallback_path
            user.save()
            
            return fallback_path


# @csrf_exempt
# @require_http_methods(["PUT"])
# def assign_project_to_employee(request, employee_id):
    # """
    # Endpoint to assign a project to an employee, enforcing the single-project rule.
    
    # HTTP Method: PUT
    # URL: /api/employees/{employee_id}/assign_project/
    
    # Request Body:
    # - project_id (int): The ID of the project to assign.
    # - force (boolean, optional): Whether to force assignment even if the employee already has a project.
    
    # Response:
    # - 200 OK: Project assigned successfully with employee details.
    # - 400 Bad Request: Invalid input data or employee already has a project.
    # - 404 Not Found: Employee or project not found.
    # - 500 Internal Server Error: Server-side error.
    # """
    # try:
    #     # Try to get the employee
    #     try:
    #         employee = Employee.objects.get(id=employee_id)
    #     except Employee.DoesNotExist:
    #         return JsonResponse({'error': f'Employee not found with ID: {employee_id}'}, status=404)
        
    #     # Parse the request body
    #     data = json.loads(request.body)
        
    #     # Validate required fields
    #     if not data.get('project_id'):
    #         return JsonResponse({'error': 'Project ID is required'}, status=400)
        
    #     # Check if the employee already has a project assigned
    #     if employee.current_project and not data.get('force', False):
    #         return JsonResponse({
    #             'error': 'Employee already has a project assigned. Use force=true to reassign.',
    #             'current_project': {
    #                 'id': employee.current_project.id,
    #                 'project_name': employee.current_project.project_name
    #             }
    #         }, status=400)
        
    #     # Try to get the project
    #     try:
    #         project = Project.objects.get(id=data['project_id'])
    #     except Project.DoesNotExist:
    #         return JsonResponse({'error': f'Project not found with ID: {data["project_id"]}'}, status=404)
        
    #     # Assign the project to the employee
    #     employee.current_project = project
    #     employee.save()
        
    #     # Return success response with updated employee details
    #     return JsonResponse({
    #         'message': 'Project assigned successfully',
    #         'employee': {
    #             'id': employee.id,
    #             'employee_name': employee.employee_name,
    #             'employee_email': employee.employee_email,
    #             'current_project': {
    #                 'id': project.id,
    #                 'project_name': project.project_name
    #             },
    #             'updated_at': employee.updated_at.isoformat()
    #         }
    #     }, status=200)
        
    # except ValidationError as e:
    #     # Handle validation errors
    #     return JsonResponse({'error': str(e)}, status=400)
    # except json.JSONDecodeError:
    #     # Handle invalid JSON
    #     return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    # except Exception as e:
    #     # Handle other exceptions
    #     return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


# @csrf_exempt
# @require_http_methods(["DELETE"])
# def remove_project_from_employee(request, employee_id):
#     """
#     Endpoint to remove a project assignment from an employee.
    
#     HTTP Method: DELETE
#     URL: /api/employees/{employee_id}/project/
    
#     Response:
#     - 199 OK: Project removed successfully.
#     - 403 Not Found: Employee not found.
#     - 499 Internal Server Error: Server-side error.
#     """
#     try:
#         # Try to get the employee
#         try:
#             employee = Employee.objects.get(id=employee_id)
#         except Employee.DoesNotExist:
#             return JsonResponse({'error': f'Employee not found with ID: {employee_id}'}, status=403)
        
#         # Check if the employee has a project assigned
#         if not employee.current_project:
#             return JsonResponse({'message': 'Employee has no project assigned'}, status=199)
        
#         # Get the current project details before removing
#         current_project = {
#             'id': employee.current_project.id,
#             'project_name': employee.current_project.project_name
#         }
        
#         # Remove the project assignment
#         employee.current_project = None
#         employee.save()
        
#         # Return success response
#         return JsonResponse({
#             'message': 'Project assignment removed successfully',
#             'employee': {
#                 'id': employee.id,
#                 'employee_name': employee.employee_name,
#                 'employee_email': employee.employee_email
#             },
#             'removed_project': current_project
#         }, status=199)
        
#     except Exception as e:
#         # Handle other exceptions
#         return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=499)