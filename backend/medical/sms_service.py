import requests
import logging

logger = logging.getLogger(__name__)

class SMSService:
    """SMS notification service using Africa's Talking or Twilio"""
    
    def __init__(self):
        # For Africa's Talking
        self.api_key = "YOUR_AFRICASTALKING_API_KEY"
        self.username = "YOUR_AFRICASTALKING_USERNAME"
        
        # For Twilio
        self.account_sid = "YOUR_TWILIO_ACCOUNT_SID"
        self.auth_token = "YOUR_TWILIO_AUTH_TOKEN"
        self.twilio_phone = "YOUR_TWILIO_PHONE_NUMBER"
    
    def send_sms_africastalking(self, phone_number, message):
        """Send SMS via Africa's Talking (for Tanzania)"""
        try:
            # Remove leading 0 or +
            phone_number = str(phone_number).replace('+', '').replace(' ', '')
            if phone_number.startswith('0'):
                phone_number = '255' + phone_number[1:]
            
            url = "https://api.africastalking.com/version1/messaging"
            headers = {
                "apiKey": self.api_key,
                "Content-Type": "application/x-www-form-urlencoded"
            }
            data = {
                "username": self.username,
                "to": phone_number,
                "message": message
            }
            
            response = requests.post(url, headers=headers, data=data)
            logger.info(f"SMS sent to {phone_number}")
            return True
            
        except Exception as e:
            logger.error(f"SMS failed: {str(e)}")
            return False
    
    def send_sms_twilio(self, phone_number, message):
        """Send SMS via Twilio (alternative)"""
        try:
            from twilio.rest import Client
            
            client = Client(self.account_sid, self.auth_token)
            message = client.messages.create(
                body=message,
                from_=self.twilio_phone,
                to=phone_number
            )
            
            logger.info(f"Twilio SMS sent to {phone_number}")
            return True
            
        except Exception as e:
            logger.error(f"Twilio SMS failed: {str(e)}")
            return False
    
    def send_appointment_reminder(self, patient, appointment_date, zoom_link):
        """Send appointment reminder SMS"""
        message = f"""
        Dr. Jimmy Reminder: Your video consultation is on {appointment_date}.
        Join here: {zoom_link}
        Questions? Call +255 712 345 678
        """
        
        phone = getattr(patient, 'phone_number', None)
        if phone:
            return self.send_sms_africastalking(phone, message)
        return False
    
    def send_diagnosis_notification_sms(self, patient, scan_type):
        """Send SMS when diagnosis is ready"""
        message = f"""
        Dr. Jimmy: Your {scan_type} scan has been reviewed.
        Log in to your dashboard to view diagnosis.
        https://drjimmy.com/dashboard
        """
        
        phone = getattr(patient, 'phone_number', None)
        if phone:
            return self.send_sms_africastalking(phone, message)
        return False