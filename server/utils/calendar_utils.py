from google.oauth2 import service_account
from googleapiclient.discovery import build

def create_calendar_event(event_details):
    user_email = event_details.get("user_email")

    SCOPES = ['https://www.googleapis.com/auth/calendar']

    # SERVICE_ACCOUNT_FILE = 'calendar_creds.json'
    SERVICE_ACCOUNT_FILE = '/home/aryan/Documents/learnPro/server/utils/cal_creds.json'

    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES,subject="aryan@akamboj.co.in")

    # Build the Google Calendar service
    service = build('calendar', 'v3', credentials=credentials)

    # Invitee's email address
    invitee_email = user_email

    # Define the event details, including the attendee
    event = {
        'summary': 'Meeting with Invitee',
        'location': 'Virtual',
        'description': '  its aliveeeeeeeeeeeeeeeeee.',
        'start': {
            'dateTime': '2025-04-01T10:00:00-07:00',
            'timeZone': 'America/Los_Angeles',
        },
        'end': {
            'dateTime': '2025-04-01T11:00:00-07:00',
            'timeZone': 'America/Los_Angeles',
        },
        'attendees': [
            {'email': invitee_email},
        ],
    }

    # Insert the event into the calendar and send the invitation
    created_event = service.events().insert(
        calendarId='primary',
        body=event,
        sendUpdates='all'  # This makes sure the invite email is sent to the attendee
    ).execute()

    print(f"Event created: {created_event.get('htmlLink')}")
