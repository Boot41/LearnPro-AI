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

class GiveKT(Base):
    __tablename__ = "give_kt"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    given_kt_info_id = Column(Integer, ForeignKey("kt_info.id"), nullable=True)
    
    # Relationships
    project = relationship("Project", backref="give_kt")
    employee = relationship("User", backref="give_kt")
    given_kt_info = relationship("KtInfo", backref="give_kt")

class KtInfo(Base):
    __tablename__ = "kt_info"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    kt_info = Column(String)  # JSON string for KT information
    original_transcripts = Column(String)  # JSON string for original transcripts
    # Relationships
    project = relationship("Project", backref="kt_info")
    employee = relationship("User", backref="kt_info")

class TakeKt(Base):
    __tablename__ = "take_kt"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    kt_info_id = Column(Integer, ForeignKey("kt_info.id"), nullable=True)
    status = Column(String, nullable=False, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    # Relationships
    project = relationship("Project", backref="take_kt")
    employee = relationship("User", backref="take_kt")

class GiveProjectOverview(Base):
    __tablename__ = "give_project_overview"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    # Relationships
    project = relationship("Project", backref="give_project_overview")
    employee = relationship("User", backref="give_project_overview")

class GiveKtNew(Base):
    __tablename__ = "give_kt_new"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    repo_url = Column(String, nullable=False)
    username = Column(String, nullable=False)
    commit_info = Column(String)  # Reduced commit string from GitHub
    kt_info_id = Column(Integer, ForeignKey("kt_info_new.id"), nullable=True)  # Nullable
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship("User", backref="give_kt_new")
    # Explicitly specify the foreign key column for this relationship.
    kt_info = relationship("KtInfoNew", foreign_keys=[kt_info_id], backref="give_kt_new_ref")


class KtInfoNew(Base):
    __tablename__ = "kt_info_new"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    give_kt_new_id = Column(Integer, ForeignKey("give_kt_new.id"), nullable=False)  # Not nullable
    kt_info = Column(String)  # Processed and digested commit information
    original_commits = Column(String)  # Original commit information JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship("User", backref="kt_info_new")


class TakeKtNew(Base):
    __tablename__ = "take_kt_new"
    id = Column(Integer, primary_key=True, index=True)
    give_kt_new_id = Column(Integer, ForeignKey("give_kt_new.id"), nullable=False)  # Not nullable
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="Kt not created")  # Status can be "Kt not created", "Pending", "Completed"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship("User", backref="take_kt_new")
    give_kt_new = relationship("GiveKtNew", backref="take_kt_new")

# class GiveKtNew(Base):
#     __tablename__ = "give_kt_new"
#     id = Column(Integer, primary_key=True, index=True)
#     employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     repo_url = Column(String, nullable=False)
#     username = Column(String, nullable=False)
#     commit_info = Column(String)  # Reduced commit string from GitHub
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
#     # Relationships
#     employee = relationship("User", backref="give_kt_new")
#     take_kt_info_new = relationship("TakeKtNew", backref="give_kt_new")

# class KtInfoNew(Base):
#     __tablename__ = "kt_info_new"
#     id = Column(Integer, primary_key=True, index=True)
#     employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     give_kt_new_id = Column(Integer, ForeignKey("give_kt_new.id"), nullable=False)
#     kt_info = Column(String)  # Processed and digested commit information
#     original_commits = Column(String)  # Original commit information JSON
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
#     # Relationships
#     employee = relationship("User", backref="kt_info_new")
#     give_kt_new = relationship("GiveKtNew", backref="kt_info_new")

# class TakeKtNew(Base):
#     __tablename__ = "take_kt_new"
#     id = Column(Integer, primary_key=True, index=True)
#     give_kt_new_id = Column(Integer, ForeignKey("give_kt_new.id"), nullable=False)
#     employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     kt_info_id = Column(Integer, ForeignKey("kt_info_new.id"), nullable=True)
#     status = Column(String, default="Kt not created")  # Status can be "Kt not created", "Pending", "Completed"
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
#     # Relationships
#     employee = relationship("User", backref="take_kt_new")
#     kt_info = relationship("KtInfoNew", backref="take_kt_new")
#     give_kt_new = relationship("GiveKtNew", backref="take_kt_new")