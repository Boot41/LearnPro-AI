from django.db import models
from django.contrib.auth.models import AbstractUser
import json

# Create your models here.

class Project(models.Model):
    """
    Project model representing a project in the system.
    
    Fields:
    - project_name: The name of the project
    - project_description: A detailed description of the project
    - required_skills: Skills required for the project (stored as comma-separated string)
    """
    project_name = models.CharField(max_length=255)
    project_description = models.TextField()
    required_skills = models.TextField()  # Stored as comma-separated string
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.project_name
    
    def get_skills_as_list(self):
        """Return the required_skills as a list of strings"""
        if not self.required_skills:
            return []
        return [skill.strip() for skill in self.required_skills.split(',')]
    
    def set_skills_from_list(self, skills_list):
        """Set required_skills from a list of strings"""
        if isinstance(skills_list, list):
            self.required_skills = ', '.join(skills_list)
        else:
            self.required_skills = skills_list


class LearningPath(models.Model):
    """
    Learning Path model representing a personalized learning journey for a user.
    
    Fields:
    - title: Title or name of the learning path
    - description: Brief description of the learning path
    - total_estimated_hours: Total estimated hours for completion
    - topics: Topics included in the learning path (stored as JSON)
    - calendar_locked: Whether the calendar/schedule is locked
    """
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    total_estimated_hours = models.PositiveIntegerField(default=0)
    topics = models.TextField()  # Stored as JSON
    calendar_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    def get_topics(self):
        """Return the topics as a Python object (list or dict)"""
        if not self.topics:
            return []
        return json.loads(self.topics)
    
    def set_topics(self, topics_data):
        """Set topics from a Python object (list or dict)"""
        self.topics = json.dumps(topics_data)


class Quiz(models.Model):
    """
    Quiz model representing a set of questions on a specific topic or topics.
    
    Fields:
    - title: The title of the quiz
    - subject: The subject area of the quiz
    - topic: The specific topic(s) of the quiz
    - questions: The quiz questions and answers (stored as JSON)
    - user: The user who the quiz belongs to (can be null for system-generated quizzes)
    """
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    topic = models.CharField(max_length=255)
    questions = models.TextField()  # Stored as JSON
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='quizzes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    def get_questions(self):
        """Return the questions as a Python object"""
        if not self.questions:
            return {}
        return json.loads(self.questions)
    
    def set_questions(self, questions_data):
        """Set questions from a Python object"""
        self.questions = json.dumps(questions_data)


class User(AbstractUser):
    """
    User model extending Django's AbstractUser.
    
    Additional Fields:
    - is_first_login: Whether this is the user's first login
    - learning_path: One-to-one relationship with a LearningPath
    """
    # Add related_name attributes to avoid clashes with auth.User
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    is_first_login = models.BooleanField(default=True)
    learning_path = models.OneToOneField(
        LearningPath, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='user'
    )
    
    def __str__(self):
        return self.username


class Employee(models.Model):
    """
    Employee model representing an employee in the system.
    
    Fields:
    - employee_name: The full name of the employee
    - employee_email: The email address of the employee
    - current_project: Foreign key reference to the Project model
    - user: One-to-one relationship with the User model
    """
    employee_name = models.CharField(max_length=255)
    employee_email = models.EmailField(unique=True)
    current_project = models.ForeignKey(
        Project, 
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
        related_name='employees'
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='employee'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.employee_name
