from livekit import api
from livekit.api import LiveKitAPI, CreateRoomRequest
from fastapi import APIRouter, Request,Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

import json
import models
import os
import auth

from database import get_db
from utils.voice_bot_utils import project_info_for_give_kt, next_incomplete_topic
router = APIRouter(tags=["livekit"])

api_key = os.getenv('LIVEKIT_API_KEY')
api_secret = os.getenv('LIVEKIT_API_SECRET')
livekit_server_url = os.getenv('LIVEKIT_URL')


@router.post("/generate_token/give_kt")
def generate_token_for_give_kt( 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        # print(current_user.id,current_user.email)
        project_info = project_info_for_give_kt(current_user.id, db)
        # print(project_info,"288888888888888888")
        room_name = current_user.email.split("@")[0]
        json_data = json.dumps({
            'user_email': current_user.email,
            'project_name': project_info['name'],
            'project_id': project_info['id'],
            'bot_type': 'kt_recieve'
        }) 
        # print(json_data) 
        token = api.AccessToken(api_key, api_secret) \
            .with_identity(room_name) \
            .with_name(room_name) \
            .with_metadata(json_data)\
            .with_grants(api.VideoGrants(
                room_join=True,
                room=room_name,
            ))
        # print(token.to_jwt())
        return JSONResponse({
            'participantToken': token.to_jwt(),
            'serverUrl': livekit_server_url,
            'assignmentDetails': project_info
        })
    except Exception as e:
        print(f"Error generating token: {e}")
        if hasattr(e, 'detail') and e.detail.find("found"):
            raise HTTPException(status_code=404, detail=str(e.detail))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate_token")
def generate_token( 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        print(current_user.id,current_user.email)
        topic = next_incomplete_topic(current_user.id, db)
        room_name = current_user.email.split("@")[0]
        json_data = json.dumps({
            'user_email': current_user.email,
            'subject_name': topic['subject']['subject_name'],
            'topic_name': topic['topic_name']
        }) 
        # print(json_data) 
        token = api.AccessToken(api_key, api_secret) \
            .with_identity(room_name) \
            .with_name(room_name) \
            .with_metadata(json_data)\
            .with_grants(api.VideoGrants(
                room_join=True,
                room=room_name,
            ))
        # print(token.to_jwt())
        return JSONResponse({
            'participantToken': token.to_jwt(),
            'serverUrl': livekit_server_url,
            'assignmentDetails': topic
        })
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))


