from django.db import models
from django.contrib.auth.models import AbstractUser
import json

# Create your models here.

class Project(models.Model):
    """
    Project model representing a project in the system.
    
    - project_name (string): The name of the project.
    - project_description (string): A detailed description of the project.
    - subjects (array of objects): The subjects that will be covered in the project.
        - subject_name (string): The name of the subject.
        - topics (array of strings): The topics that will be covered in the subject.
    """
    id = models.AutoField(primary_key=True)
    project_name = models.CharField(max_length=255)
    project_description = models.TextField()
    subjects = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.project_name
    
    @property
    def subjects_data(self):
        """Return the subjects as a Python object"""
        return json.loads(self.subjects)
    


class LearningPath(models.Model):
    """
    Learning Path model representing a personalized learning journey for a user.
    
    Fields:
    - title: Title or name of the learning path
    - description: Brief description of the learning path
    - total_estimated_hours: Total estimated hours for completion
    - topics: Topics included in the learning path (stored as JSON)
    - calendar_locked: Whether the calendar/schedule is locked
    - project: The project this learning path is for
    """
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    total_estimated_hours = models.PositiveIntegerField(default=0)
    topics = models.TextField()  # Stored as JSON
    calendar_locked = models.BooleanField(default=False)
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='learning_paths'
    )
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
    - project: The project this quiz is associated with (for knowledge assessment)
    - user: The user who the quiz belongs to (can be null for system-generated quizzes)
    - is_knowledge_assessment: Whether this quiz is a knowledge assessment quiz
    - completed: Whether the user has completed this quiz
    - score: The user's score on this quiz (if completed)
    """
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    topic = models.CharField(max_length=255)
    questions = models.TextField()  # Stored as JSON
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='quizzes'
    )
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='quizzes'
    )
    is_knowledge_assessment = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    score = models.IntegerField(null=True, blank=True)
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
    - has_taken_assessment: Whether the user has taken the knowledge assessment
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
    has_taken_assessment = models.BooleanField(default=False)
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
