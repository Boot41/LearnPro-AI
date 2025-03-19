import pytest
from unittest.mock import patch, MagicMock
import datetime
from utils.calendar_utils import (
    create_calendar_event,
    create_calendar_event_recurring
)

# Mock data for testing
MOCK_EVENT_DETAILS = {
    "user_email": "test@example.com",
    "session_duration": 2,
    "start_date": datetime.datetime(2025, 3, 19, 9, 0)
}

MOCK_RECURRING_EVENT_DETAILS = {
    "user_email": "test@example.com",
    "total_hours": 10,
    "daily_session_duration": 2
}

MOCK_EVENT_RESPONSE = {
    "id": "event123",
    "htmlLink": "https://calendar.google.com/event?id=123"
}

@pytest.fixture
def mock_calendar_service():
    with patch('utils.calendar_utils.build') as mock_build:
        mock_service = MagicMock()
        mock_events = MagicMock()
        mock_events_insert = MagicMock()
        mock_events_insert.execute.return_value = MOCK_EVENT_RESPONSE
        mock_events.insert.return_value = mock_events_insert
        mock_service.events.return_value = mock_events
        mock_build.return_value = mock_service
        yield mock_service

@pytest.fixture
def mock_credentials():
    with patch('utils.calendar_utils.service_account.Credentials.from_service_account_file') as mock_creds:
        mock_creds.return_value = MagicMock()
        yield mock_creds

@pytest.fixture
def enable_calendar():
    with patch('utils.calendar_utils.CALENDAR_ENABLED', True):
        yield

def test_create_calendar_event(mock_calendar_service, mock_credentials, enable_calendar):
    """Test creating a calendar event"""
    result = create_calendar_event(MOCK_EVENT_DETAILS)
    
    assert result == MOCK_EVENT_RESPONSE
    mock_calendar_service.events.assert_called_once()
    mock_calendar_service.events().insert.assert_called_once()

def test_create_calendar_event_disabled():
    """Test creating a calendar event when calendar is disabled"""
    with patch('utils.calendar_utils.CALENDAR_ENABLED', False):
        result = create_calendar_event(MOCK_EVENT_DETAILS)
    
    assert result is None

def test_create_calendar_event_recurring(mock_calendar_service, mock_credentials, enable_calendar):
    """Test creating a recurring calendar event"""
    result = create_calendar_event_recurring(MOCK_RECURRING_EVENT_DETAILS)
    
    assert result == MOCK_EVENT_RESPONSE
    mock_calendar_service.events.assert_called_once()
    mock_calendar_service.events().insert.assert_called_once()
