from django.core.mail import send_mail
from django.conf import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_patient_email(patient_email, patient_name, subject, message_html):
    """Send email to patient"""
    try:
        # For demo, print the email
        print(f"\n📧 EMAIL TO: {patient_email}")
        print(f"Subject: {subject}")
        print(f"Message: {message_html[:200]}...")
        
        # In production, uncomment this:
        """
        send_mail(
            subject=subject,
            message=message_html,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[patient_email],
            fail_silently=False,
            html_message=message_html
        )
        """
        
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

def send_scan_review_notification(patient_email, patient_name, scan_type, diagnosis, recommendations):
    """Send notification when doctor reviews a scan"""
    subject = f"Dr. Jimmy - Your {scan_type} has been reviewed"
    
    html_message = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #1976d2; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f5f5f5; }}
            .diagnosis {{ background-color: #e3f2fd; padding: 15px; margin: 15px 0; border-left: 4px solid #1976d2; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Dr. Jimmy Orthopedic & Spine Center</h2>
            </div>
            <div class="content">
                <h3>Hello {patient_name},</h3>
                <p>Dr. Jimmy has reviewed your <strong>{scan_type}</strong> scan.</p>
                
                <div class="diagnosis">
                    <h4>📋 Diagnosis:</h4>
                    <p>{diagnosis}</p>
                    
                    <h4>💊 Recommendations:</h4>
                    <p>{recommendations}</p>
                </div>
                
                <p>Please log into your patient dashboard to view the full report and any additional notes from Dr. Jimmy.</p>
                
                <p>If you have any questions or would like to schedule a follow-up consultation, please book a video appointment.</p>
            </div>
            <div class="footer">
                <p>© 2024 Dr. Jimmy Orthopedic & Spine Center | <a href="http://localhost:3000">Login to Dashboard</a></p>
                <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_patient_email(patient_email, patient_name, subject, html_message)

def send_appointment_confirmation(patient_email, patient_name, appointment_date, zoom_link):
    """Send confirmation when video appointment is booked"""
    subject = "Dr. Jimmy - Video Consultation Confirmation"
    
    html_message = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #4caf50; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f5f5f5; }}
            .meeting-details {{ background-color: #e8f5e9; padding: 15px; margin: 15px 0; border-left: 4px solid #4caf50; }}
            .button {{ background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Video Consultation Confirmed</h2>
            </div>
            <div class="content">
                <h3>Dear {patient_name},</h3>
                <p>Your video consultation with Dr. Jimmy has been confirmed.</p>
                
                <div class="meeting-details">
                    <h4>📅 Appointment Details:</h4>
                    <p><strong>Date & Time:</strong> {appointment_date}</p>
                    <p><strong>Duration:</strong> 30 minutes</p>
                    <p><strong>Doctor:</strong> Dr. Jimmy (Orthopedic & Spine Surgeon)</p>
                </div>
                
                <div class="meeting-details">
                    <h4>🔗 Zoom Meeting Link:</h4>
                    <p><a href="{zoom_link}" class="button">Join Consultation</a></p>
                    <p><strong>Meeting ID:</strong> {zoom_link.split('/')[-1]}</p>
                    <p><strong>Password:</strong> 123456 (if required)</p>
                </div>
                
                <p><strong>Before your appointment:</strong></p>
                <ul>
                    <li>Ensure you have a stable internet connection</li>
                    <li>Test your camera and microphone</li>
                    <li>Have your medical history and questions ready</li>
                    <li>Upload any relevant scans before the meeting</li>
                </ul>
                
                <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
            </div>
            <div class="footer">
                <p>© 2024 Dr. Jimmy Orthopedic & Spine Center</p>
                <p>Questions? Call: +255 XXX XXX XXX | Email: info@drjimmy.com</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_patient_email(patient_email, patient_name, subject, html_message)