from django.contrib.auth import get_user_model
from django.db import transaction
from api.models import Project, Employee, LearningPath, Quiz

@transaction.atomic
def setup_sample_data():
    # Create sample project
    project = Project.objects.create(
        project_name="Full Stack Development",
        project_description="Comprehensive full stack development learning path",
        subjects=[
            {
                "subject_name": "Frontend Development",
                "topics": ["HTML", "CSS", "JavaScript", "React"]
            },
            {
                "subject_name": "Backend Development",
                "topics": ["Python", "Django", "REST APIs", "Database Design"]
            }
        ]
    )

    # Create admin user
    admin_user = get_user_model().objects.create_user(
        email="admin@example.com",
        password="admin123",
        is_staff=True
    )

    # Create sample employee
    employee_user = get_user_model().objects.create_user(
        email="employee1@example.com",
        password="password123"
    )
    employee = Employee.objects.create(
        employee_name="John Doe",
        employee_email="employee1@example.com",
        user=employee_user
    )

    # Create learning path
    learning_path = LearningPath.objects.create(
        title="Full Stack Development Path",
        description="Comprehensive path covering frontend and backend technologies",
        total_estimated_hours=120,
        calendar_locked=False,
        user=employee_user
    )

    # Create quiz
    quiz = Quiz.objects.create(
        title="Full Stack Development Assessment",
        project=project,
        is_knowledge_assessment=True
    )

    print("Sample data setup complete!")

if __name__ == "__main__":
    setup_sample_data()
