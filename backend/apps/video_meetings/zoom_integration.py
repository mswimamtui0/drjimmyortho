import requests
import base64
import json
from datetime import datetime, timedelta
from django.conf import settings

class ZoomAPI:
    def __init__(self):
        self.client_id = settings.ZOOM_CLIENT_ID
        self.client_secret = settings.ZOOM_CLIENT_SECRET
        self.account_id = settings.ZOOM_ACCOUNT_ID
        self.access_token = None
        self.token_expiry = None
        
    def get_access_token(self):
        if self.access_token and self.token_expiry > datetime.now():
            return self.access_token
        
        url = "https://zoom.us/oauth/token"
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
        
        headers = {
            "Authorization": f"Basic {auth_b64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        data = {
            "grant_type": "account_credentials",
            "account_id": self.account_id
        }
        
        response = requests.post(url, headers=headers, data=data)
        if response.status_code == 200:
            token_data = response.json()
            self.access_token = token_data['access_token']
            self.token_expiry = datetime.now() + timedelta(seconds=token_data['expires_in'])
            return self.access_token
        else:
            raise Exception(f"Failed to get Zoom token: {response.text}")
    
    def create_meeting(self, topic, start_time, duration_minutes=30, timezone="Africa/Dar_es_Salaam"):
        """Create a Zoom meeting"""
        access_token = self.get_access_token()
        url = "https://api.zoom.us/v2/users/me/meetings"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "topic": topic,
            "type": 2,  # Scheduled meeting
            "start_time": start_time.isoformat(),
            "timezone": timezone,
            "duration": duration_minutes,
            "settings": {
                "host_video": True,
                "participant_video": True,
                "join_before_host": False,
                "mute_upon_entry": True,
                "waiting_room": True,
                "approval_type": 0,  # Automatically approve
                "registrants_email_notification": False,
                "encryption_type": "enhanced_encryption",
                "focus_mode": True,
                "private_meeting": False
            }
        }
        
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 201:
            meeting_data = response.json()
            return {
                'meeting_id': meeting_data['id'],
                'join_url': meeting_data['join_url'],
                'start_url': meeting_data['start_url'],
                'password': meeting_data.get('password', '')
            }
        else:
            raise Exception(f"Failed to create Zoom meeting: {response.text}")
    
    def update_meeting(self, meeting_id, topic=None, start_time=None, duration=None):
        """Update existing meeting"""
        access_token = self.get_access_token()
        url = f"https://api.zoom.us/v2/meetings/{meeting_id}"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {}
        if topic:
            payload['topic'] = topic
        if start_time:
            payload['start_time'] = start_time.isoformat()
        if duration:
            payload['duration'] = duration
        
        response = requests.patch(url, headers=headers, json=payload)
        return response.status_code == 204
    
    def delete_meeting(self, meeting_id):
        """Cancel/delete meeting"""
        access_token = self.get_access_token()
        url = f"https://api.zoom.us/v2/meetings/{meeting_id}"
        
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        response = requests.delete(url, headers=headers)
        return response.status_code == 204