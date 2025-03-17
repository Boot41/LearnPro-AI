from requests import status_codes
import models
import json
from fastapi import HTTPException,Depends
from database import get_db

async def get_kt_info_for_user(user_id):
    db =  next(get_db())
    try:
        take_kt_session = db.query(models.TakeKt).filter(
            models.TakeKt.employee_id == user_id
        ).first()
        if not take_kt_session:
            raise HTTPException(status_code=404,detail="No Take KT assigned to user")
        kt_info = db.query(models.KtInfo).filter(
            models.KtInfo.project_id == take_kt_session.project_id
        ).first()
        print(kt_info)
        return kt_info
    except Exception as err:
        if "No Take" in str(err):
            raise err
        else:
            raise HTTPException(status_code = 500,detail=str(err))
    
def project_info_for_give_kt(user_id, db):
    try:
        give_kt_obj = db.query(models.GiveKT).filter(
            models.GiveKT.employee_id == user_id
        ).first()
        if not give_kt_obj:
            raise HTTPException(status_code=404, detail='No GiveKT found for user')
        project = db.query(models.Project).filter(
            models.Project.id == give_kt_obj.project_id 
        ).first()
        if not project:
            raise HTTPException(status_code=404, detail='No project found for GiveKT')
        return {'id': project.id, 'name': project.name,'give_kt_id':give_kt_obj.id, 'description': project.description}
    except Exception as e:
        print(f"Error getting project info: {e}")
        if hasattr(e, 'detail') and e.detail.find("found"):
            raise HTTPException(status_code=404, detail=str(e.detail))
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