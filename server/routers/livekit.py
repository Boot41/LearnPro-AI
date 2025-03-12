
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
router = APIRouter(tags=["livekit"])

api_key = os.getenv('LIVEKIT_API_KEY')
api_secret = os.getenv('LIVEKIT_API_SECRET')
livekit_server_url = os.getenv('LIVEKIT_SERVER_URL')

@router.post("/generate_token/{room}")
def generate_token( 
    room:str,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        print(current_user.id,current_user.email)
        if not room:
            return JSONResponse({'error': 'Missing room name'}, status=400)

        topic = next_incomplete_topic(current_user.id, db)

        json_data = json.dumps({
            'subject': topic['subject']['subject_name'],
            'topic': topic['topic_name']
        }) 
        print(json_data) 
        token = api.AccessToken(api_key, api_secret) \
            .with_identity(current_user.id) \
            .with_name(current_user.email) \
            .with_metadata(json_data)\
            .with_grants(api.VideoGrants(
                room_join=True,
                room=room,
            ))

        return JSONResponse({
            'participantToken': token.to_jwt(),
            'serverUrl': livekit_server_url,
            'assignmentDetails': topic
        })
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))

def next_incomplete_topic(user_id, db):
    try:
        learning_path = db.query(models.LearningPath).filter(
            models.LearningPath.user_id == user_id
        ).order_by(models.LearningPath.created_at.desc()).first()
        if not learning_path:
            return {'error': 'No learning path found for user'},500
        learning_path = json.loads(learning_path.learning_path)
        for subject in learning_path["subjects"]:
            for topic in subject['topics']:
                if topic['is_completed'] == 'false':
                    topic['subject'] = {"subject_name": subject['subject_name']}
                    print(topic)
                    return topic
        return None
    except Exception as e:
        print(f"Error getting next incomplete assignment: {e}")
        return {'error': str(e)},500

