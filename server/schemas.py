from pydantic import BaseModel, EmailStr, field_validator, validator, Field
from typing import Optional, List, Dict
from models import UserType
from datetime import datetime
from enum import Enum

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    user_type: UserType = UserType.EMPLOYEE

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_type: str
    email: str
    id: int

class TokenData(BaseModel):
    username: Optional[str] = None
    user_type: Optional[UserType] = None

class User(UserBase):
    id: int
    user_type: UserType
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    name: str
    topics: List[str]

    @field_validator('topics', mode='before')
    @classmethod
    def split_topics(cls, v):
        if isinstance(v, str):
            # Split the string into a list, handling empty strings
            return v.split(',') if v else []
        return v

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    description: str

class ProjectCreate(ProjectBase):
    subjects: List[SubjectCreate]

class Project(ProjectBase):
    id: int
    name: str
    description: str
    skill_assessment_quiz: Optional[str] = None
    subjects: List[Subject]

    class Config:
        from_attributes = True

class AssignedProject(BaseModel):
    id: int
    name: str
    progress: float
    last_activity: Optional[datetime] = None

class EmployeeWithProgress(BaseModel):
    id: int
    email: EmailStr
    name: str
    progress: float
    assigned_projects: List[AssignedProject] = []
    last_activity: Optional[datetime] = None

    class Config:
        from_attributes = True

class LearningPathBase(BaseModel):
    user_id: int
    project_id: int
    total_topics: int = 0
    completed_topics: int = 0
    learning_path: str  # JSON string

class LearningPathCreate(LearningPathBase):
    pass

class LearningPath(LearningPathBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TopicScore(BaseModel):
    """Schema for individual topic score"""
    score: int
    total: int
    percentage: float

class QuizSubmission(BaseModel):
    """Schema for quiz submission with answers and topic scores"""
    answers: Dict[str, str]
    topicScores: Dict[str, TopicScore]

class AssignProject(BaseModel):
    """Schema for assigning a project to a user"""
    email: EmailStr
    project_id: int

    class Config:
        json_schema_extra = {
            "example": {
                "email": "employee@example.com",
                "project_id": 1
            }
        }

class LearningPathUpdate(BaseModel):
    """Schema for updating a learning path"""
    learning_path: str  # JSON string
    total_topics: Optional[int] = None
    completed_topics: Optional[int] = None

class ProjectCompletionStats(BaseModel):
    """Schema for project completion statistics"""
    id: int
    name: str
    completionRate: float

class GiveKTBase(BaseModel):
    """Base schema for KT sessions"""
    project_id: int
    employee_id: int
    given_kt_info_id: Optional[int] = None

class GiveKTCreate(GiveKTBase):
    """Schema for creating a new KT session"""
    pass

class GiveKTDelete(BaseModel):
    """Schema for deleting a KT session"""
    project_id: int

class GiveKT(GiveKTBase):
    """Schema for KT session response"""
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PendingKTProjectDetails(BaseModel):
    """Schema for detailed project information in pending KT assignments"""
    give_kt_id: int
    project_id: int
    project_name: str
    project_description: str
    employee_id: int
    employee_name: str
    employee_email: str

    class Config:
        from_attributes = True

class TakeKTCreate(BaseModel):
    """Schema for creating a new Take KT session"""
    project_id: int
    email: EmailStr

    class Config:
        json_schema_extra = {
            "example": {
                "project_id": 1,
                "email": "employee@example.com"
            }
        }
