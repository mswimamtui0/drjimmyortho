import requests
import json
from datetime import datetime, timedelta
import random

class VideoMeetingService:
    """Handles video meeting creation for consultations"""
    
    def __init__(self):
        # For demo, we'll generate mock meeting links
        # In production, integrate with Zoom API or Google Meet
        pass
    
    def create_meeting(self, patient_name, doctor_name, scheduled_time):
        """
        Create a video meeting link
        Returns meeting URL and details
        """
        # Generate a unique meeting ID
        meeting_id = f"drjimmy_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"
        
        # For demo - generate a mock meeting link
        # In production, replace with actual Zoom/Google Meet API call
        meeting_link = f"https://meet.drjimmy.com/{meeting_id}"
        
        # Alternative: Use Google Meet (free)
        # meeting_link = f"https://meet.google.com/{meeting_id}"
        
        # Alternative: Use Zoom
        # meeting_link = f"https://zoom.us/j/{meeting_id}"
        
        return {
            'meeting_id': meeting_id,
            'join_url': meeting_link,
            'start_url': meeting_link,
            'password': str(random.randint(100000, 999999)),
            'instructions': """
            📋 **Video Consultation Instructions:**
            1. Click the meeting link 5 minutes before your appointment
            2. Allow camera and microphone access
            3. Ensure you have good internet connection
            4. Have your medical questions ready
            5. Upload any relevant scans before the meeting
            """
        }
    
    def send_reminder(self, patient_email, patient_phone, meeting_time, meeting_link):
        """
        Send appointment reminder via email and SMS
        """
        # Email reminder
        email_content = f"""
        <html>
        <body>
            <h2>Video Consultation Reminder</h2>
            <p>Dear Patient,</p>
            <p>This is a reminder for your video consultation with Dr. Jimmy.</p>
            <p><strong>Date & Time:</strong> {meeting_time}</p>
            <p><strong>Meeting Link:</strong> <a href='{meeting_link}'>{meeting_link}</a></p>
            <p><strong>Password:</strong> 123456</p>
            <p>Please join 5 minutes before your scheduled time.</p>
            <p>Best regards,<br>Dr. Jimmy Orthopedic Center</p>
        </body>
        </html>
        """
        
        # SMS reminder (mock - integrate with Africa's Talking or Twilio)
        sms_content = f"Dr. Jimmy Reminder: Your video consultation is at {meeting_time}. Join here: {meeting_link}"
        
        return {
            'email_sent': True,
            'sms_sent': True,
            'email_content': email_content,
            'sms_content': sms_content
        }