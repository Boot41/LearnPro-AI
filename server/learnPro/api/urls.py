from django.urls import path
from .views import (
    sample_api, 
    create_project, 
    add_employee, 
    user_login, 
    assign_project_to_employee, 
    remove_project_from_employee
)

urlpatterns = [
    path('sample/', sample_api, name='sample_api'),
    path('projects/', create_project, name='create_project'),
    path('employees/', add_employee, name='add_employee'),
    path('login/', user_login, name='user_login'),
    path('employees/<int:employee_id>/assign_project/', assign_project_to_employee, name='assign_project_to_employee'),
    path('employees/<int:employee_id>/project/', remove_project_from_employee, name='remove_project_from_employee'),
]