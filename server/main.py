from fastapi import FastAPI,Depends
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from utils.voice_bot_utils import get_kt_info_for_user
from sqlalchemy.orm import Session

from pydantic import BaseModel
import models
from database import engine, SessionLocal,get_db
from routers import auth, users, projects, learning_paths, skill_assessments, livekit, give_kt, take_kt, give_kt_new, take_kt_new
from fastapi.staticfiles import StaticFiles
from utils.calendar_utils import create_calendar_event
import subprocess

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="LearnPro API", description="API for LearnPro application")

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default development server
    "http://localhost:5174",  # Vite default development server
    "http://localhost:3000",  # Just in case you use a different port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:8000",
    "https://learnpro-mha4s7stfa-el.a.run.app"
    "http://0.0.0.0:8000",
    "http://127.0.0.1:3000",
]

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create default admin user if database is empty
def create_default_admin():
    db = SessionLocal()
    try:
        # Check if any users exist
        user_count = db.query(models.User).count()
        if user_count == 0:
            # Create admin user
            admin_email = "admin@learnpro.com"
            admin_password = "admin"
            hashed_password = auth.get_password_hash(admin_password)
            
            admin_user = models.User(
                username=admin_email,
                email=admin_email,
                hashed_password=hashed_password,
                user_type=models.UserType.ADMIN
            )
            
            db.add(admin_user)
            db.commit()
            print(f"Default admin user created. Email: {admin_email}, Password: {admin_password}")
    except Exception as e:
        print(f"Error creating default admin: {e}")
    finally:
        db.close()

# Create default admin user on startup
create_default_admin()

# @app.on_event("startup")
# def startup_event():
#     subprocess.Popen(["python", "agent.py","start"])

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(learning_paths.router)
app.include_router(skill_assessments.router)
app.include_router(livekit.router)
app.include_router(give_kt.router)
app.include_router(take_kt.router)
app.include_router(give_kt_new.router)
app.include_router(take_kt_new.router)

@app.get("/", response_class=HTMLResponse)
async def serve_home():
    with open("static/index.html", "r") as f:
        return f.read()




# @app.post("/test_github")
# def test_github(test_git:TestGit):
#     print(test_git.username)
#     print(test_git.repo)
#     commits = get_github_commits(test_git.repo,test_git.username)
#     return JSONResponse(content=commits)


# @app.get("/test_take_kt_token/{user_id}")
# def generate_token(user_id:int):
#     return get_kt_info_for_user(user_id)

# @app.get("/test_calendar")
# def schedule_event():
#     create_calendar_event({
#         "user_email": "aryankambozz@gmail.com",
#         "total_hours": 10,
#         "daily_session_duration": 2
#     })

@app.get("/test")
def read_root():
    return {"Hello": "Welcome to LearnPro API"}
