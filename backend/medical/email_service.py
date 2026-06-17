from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """Email notification service for patients"""
    
    @staticmethod
    def send_diagnosis_notification(patient, scan, diagnosis, recommendations):
        """Send email notification when doctor adds diagnosis"""
        try:
            subject = f"Dr. Jimmy - Your {scan.scan_type} Scan has been reviewed"
            
            # HTML Email Template
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                    .header {{ background: linear-gradient(135deg, #1976d2, #0d47a1); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ padding: 20px; }}
                    .diagnosis-box {{ background-color: #e3f2fd; padding: 15px; border-left: 4px solid #1976d2; margin: 15px 0; }}
                    .recommendations-box {{ background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 15px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; }}
                    .button {{ display: inline-block; background: #1976d2; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🏥 Dr. Jimmy Orthopedic Center</h2>
                    </div>
                    <div class="content">
                        <h3>Hello {patient.get_full_name() or patient.username},</h3>
                        <p>Dr. Jimmy has reviewed your <strong>{scan.scan_type}</strong> scan.</p>
                        
                        <div class="diagnosis-box">
                            <h4>📋 Diagnosis:</h4>
                            <p>{diagnosis}</p>
                        </div>
                        
                        <div class="recommendations-box">
                            <h4>💊 Recommendations:</h4>
                            <p>{recommendations}</p>
                        </div>
                        
                        <p>Please log into your patient dashboard to view the full report.</p>
                        <p>
                            <a href="http://localhost:3000/dashboard" class="button">View Dashboard</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Dr. Jimmy Orthopedic Center | Dar es Salaam, Tanzania</p>
                        <p>This is an automated message, please do not reply directly.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            plain_message = f"""
            Dr. Jimmy - Your {scan.scan_type} Scan has been reviewed
            
            Hello {patient.get_full_name() or patient.username},
            
            Dr. Jimmy has reviewed your {scan.scan_type} scan.
            
            Diagnosis: {diagnosis}
            Recommendations: {recommendations}
            
            Please log into your patient dashboard to view the full report.
            
            ---
            Dr. Jimmy Orthopedic Center
            Mbeya, Tanzania
            """
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[patient.email],
                html_message=html_message,
                fail_silently=False
            )
            
            logger.info(f"Email sent to {patient.email}")
            return True
            
        except Exception as e:
            logger.error(f"Email sending failed: {str(e)}")
            return False
    
    @staticmethod
    def send_appointment_confirmation(patient, appointment_date, zoom_link):
        """Send appointment confirmation email"""
        try:
            subject = "Dr. Jimmy - Video Consultation Confirmation"
            
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                    .header {{ background: linear-gradient(135deg, #4caf50, #2e7d32); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ padding: 20px; }}
                    .meeting-details {{ background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 15px 0; }}
                    .button {{ display: inline-block; background: #1976d2; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🎥 Video Consultation Confirmed</h2>
                    </div>
                    <div class="content">
                        <h3>Dear {patient.get_full_name() or patient.username},</h3>
                        <p>Your video consultation with Dr. Jimmy has been confirmed.</p>
                        
                        <div class="meeting-details">
                            <h4>📅 Appointment Details:</h4>
                            <p><strong>Date & Time:</strong> {appointment_date}</p>
                            <p><strong>Duration:</strong> 30 minutes</p>
                            <p><strong>Doctor:</strong> Dr. Jimmy</p>
                        </div>
                        
                        <div class="meeting-details">
                            <h4>🔗 Join Meeting:</h4>
                            <p><a href="{zoom_link}" class="button">Join Zoom Meeting</a></p>
                        </div>
                        
                        <h4>Before your appointment:</h4>
                        <ul>
                            <li>Ensure you have a stable internet connection</li>
                            <li>Test your camera and microphone</li>
                            <li>Have your medical questions ready</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>© 2024 Dr. Jimmy Orthopedic Center</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            send_mail(
                subject=subject,
                message=f"Appointment confirmed for {appointment_date}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[patient.email],
                html_message=html_message,
                fail_silently=False
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Appointment email failed: {str(e)}")
            return False