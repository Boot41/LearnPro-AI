from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime,timedelta

def create_calendar_event(event_details):
    user_email = event_details.get("user_email")
    total_hours = event_details.get("total_hours")
    session_duration = event_details.get("daily_session_duration")
    total_sessions = int(total_hours/session_duration)
    start_date = datetime.now()

    SCOPES = ['https://www.googleapis.com/auth/calendar']

    # SERVICE_ACCOUNT_FILE = 'calendar_creds.json'
    SERVICE_ACCOUNT_FILE = '/home/aryan/Documents/learnPro/server/utils/cal_creds.json'

    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES,subject="aryan@akamboj.co.in")

    # Build the Google Calendar service
    service = build('calendar', 'v3', credentials=credentials)

    start_datetime = start_date.replace(hour=10, minute=0)
    end_datetime = start_datetime + timedelta(hours=session_duration)

    event = {
        'summary': 'Learning Session',
        'location': 'Virtual',
        'description': 'Scheduled learning time.',
        'start': {
            'dateTime': start_datetime.isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
        'end': {
            'dateTime': end_datetime.isoformat(),
            'timeZone': 'Asia/Kolkata',
        },
        'attendees': [
            {'email': user_email},
        ],
        'recurrence': [
            f'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT={total_sessions}'
        ]
    }

    # Insert event into Google Calendar
    created_event = service.events().insert(
        calendarId='primary',
        body=event,
        sendUpdates='all'
    ).execute()

    print(f"Event created: {created_event.get('htmlLink')}")

    return created_event
