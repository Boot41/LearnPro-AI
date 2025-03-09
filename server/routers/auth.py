from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from datetime import timedelta

import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/api", tags=["authentication"])

# @router.post("/signup", response_model=schemas.User)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     # Check if username already exists
#     db_user = db.query(models.User).filter(models.User.username == user.username).first()
#     if db_user:
#         raise HTTPException(status_code=400, detail="Username already registered")
    
#     # Check if email already exists
#     db_email = db.query(models.User).filter(models.User.email == user.email).first()
#     if db_email:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     # Create new user
#     hashed_password = auth.get_password_hash(user.password).decode('utf-8')
#     db_user = models.User(
#         username=user.username,
#         email=user.email,
#         hashed_password=hashed_password,
#         user_type=user.user_type
#     )
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

@router.post("/register", response_model=schemas.User)
def register_user(user_data: dict, db: Session = Depends(get_db)):
    # Check if username/email already exists
    db_user = db.query(models.User).filter(models.User.email == user_data["email"]).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = auth.get_password_hash(user_data["password"])
    if user_data["user_type"]==models.UserType.ADMIN:
        user_type = models.UserType.ADMIN
    else:
        user_type = models.UserType.EMPLOYEE

    db_user = models.User(
        username=user_data["email"],  # Using email as username
        email=user_data["email"],
        hashed_password=hashed_password,
        user_type=user_type
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(
    response: Response,
    user_credentials: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "user_type": user.user_type}, 
        expires_delta=access_token_expires
    )
    
    # Set cookie with the token
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=1800,  # 30 minutes in seconds
        expires=1800,
        samesite="lax",
        secure=False,  # Set to True in production with HTTPS
    )
    
    return {
        "access_token": access_token,
        "id": user.id,
        "email": user.username,
        "user_type": f"{user.user_type.value}",
        "token_type": "bearer"
    }
