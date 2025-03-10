from sqlalchemy import Boolean, Column, Integer, String, Enum, ForeignKey, Table, DateTime, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from database import Base

class UserType(str, enum.Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    user_type = Column(Enum(UserType), default=UserType.EMPLOYEE)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    assigned_project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    
    # Relationships
    assigned_project = relationship("Project", foreign_keys=[assigned_project_id], backref="assigned_users")

# Association table for Subject-Topic relationship
subject_topics = Table('subject_topics', Base.metadata,
    Column('subject_id', Integer, ForeignKey('subjects.id')),
    Column('topic_id', Integer, ForeignKey('topics.id'))
)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    skill_assessment_quiz = Column(String)  # JSON string for quiz data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    subjects = relationship("Subject", back_populates="project", cascade="all, delete-orphan")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    topics = Column(String) # Will store topics as comma-separated string
    project_id = Column(Integer, ForeignKey("projects.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="subjects")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    total_topics = Column(Integer, default=0)
    completed_topics = Column(Integer, default=0)
    learning_path = Column(String)  # JSON string for learning path data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="learning_paths")
    project = relationship("Project", backref="learning_paths")
