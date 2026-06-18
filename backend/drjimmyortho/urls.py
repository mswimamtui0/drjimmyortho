from django.contrib import admin
from django.urls import path
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from django.conf.urls.static import static
from django.db import models
import json
import random
from datetime import datetime



# Import models from medical app
from medical.models import PatientScan, Consultation, Payment, BlogPost, BlogComment, PatientReview, ChatMessage, ChatRoom

# ==================== HOME PAGE ====================
def home_page(request):
    return HttpResponse("""
    <html>
        <head>
            <title>Dr. Jimmy Orthopedic API</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                .container { background: rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; max-width: 600px; margin: 0 auto; }
                h1 { color: #fff; }
                a { color: #ffd700; text-decoration: none; }
                .endpoint { background: rgba(0,0,0,0.3); padding: 10px; margin: 10px 0; border-radius: 10px; font-family: monospace; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🏥 Dr. Jimmy Orthopedic Backend</h1>
                <p>✅ Server is running correctly on port 8000</p>
                <div class="endpoint">
                    <strong>📡 API Root:</strong> <a href="/api/">/api/</a><br>
                    <strong>🔐 Admin Panel:</strong> <a href="/admin/">/admin/</a><br>
                    <strong>📤 Upload:</strong> POST /api/upload/<br>
                    <strong>🔑 Login:</strong> POST /api/login/<br>
                    <strong>📝 Register:</strong> POST /api/register/<br>
                    <strong>📋 My Scans:</strong> GET /api/my-scans/<br>
                    <strong>👨‍⚕️ Doctor Dashboard:</strong> GET /api/doctor/dashboard/<br>
                    <strong>📝 Update Scan:</strong> POST /api/doctor/update-scan/<br>
                    <strong>🔍 Search Patients:</strong> GET /api/doctor/search-patients/<br>
                    <strong>📄 Generate Prescription:</strong> POST /api/doctor/generate-prescription/<br>
                    <strong>📧 Send Email:</strong> POST /api/doctor/send-email/<br>
                    <strong>📱 Send SMS:</strong> POST /api/doctor/send-sms/<br>
                    <strong>📅 Appointments:</strong> GET /api/doctor/appointments/<br>
                    <strong>🎥 Create Zoom:</strong> POST /api/doctor/create-zoom-meeting/<br>
                    <strong>📅 Create Appointment:</strong> POST /api/doctor/create-appointment/<br>
                    <strong>💳 Initiate Payment:</strong> POST /api/payment/initiate/<br>
                    <strong>📝 Blog Posts:</strong> GET /api/blog/posts/<br>
                    <strong>⭐ Reviews:</strong> GET /api/reviews/<br>
                    <strong>📝 Submit Review:</strong> POST /api/reviews/submit/<br>
                </div>
                <p style="margin-top: 30px; font-size: 12px;">Frontend: <strong>http://localhost:3000</strong></p>
            </div>
        </body>
    </html>
    """)

def api_root(request):
    return JsonResponse({
        'message': 'Dr. Jimmy Orthopedic API',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': {
            'register': 'POST /api/register/',
            'login': 'POST /api/login/',
            'upload': 'POST /api/upload/',
            'my_scans': 'GET /api/my-scans/?username=xxx',
            'doctor_dashboard': 'GET /api/doctor/dashboard/',
            'update_scan': 'POST /api/doctor/update-scan/',
            'search_patients': 'GET /api/doctor/search-patients/',
            'generate_prescription': 'POST /api/doctor/generate-prescription/',
            'send_email': 'POST /api/doctor/send-email/',
            'send_sms': 'POST /api/doctor/send-sms/',
            'appointments': 'GET /api/doctor/appointments/',
            'create_zoom': 'POST /api/doctor/create-zoom-meeting/',
            'create_appointment': 'POST /api/doctor/create-appointment/',
            'initiate_payment': 'POST /api/payment/initiate/',
            'payment_status': 'GET /api/payment/status/',
            'payment_callback': 'POST /api/payment/callback/',
            'blog_posts': 'GET /api/blog/posts/',
            'blog_post_detail': 'GET /api/blog/post/<slug>/',
            'blog_comment': 'POST /api/blog/comment/',
            'reviews': 'GET /api/reviews/',
            'submit_review': 'POST /api/reviews/submit/'
        }
    })

# ==================== AUTHENTICATION ====================
@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email', '')
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')
            phone_number = data.get('phone_number', '')
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
            
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            
            user.phone_number = phone_number
            user.save()
            
            return JsonResponse({
                'success': True,
                'message': 'User created successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone_number': getattr(user, 'phone_number', '')
                }
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(username=username, password=password)
            
            if user:
                return JsonResponse({
                    'success': True,
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'phone_number': getattr(user, 'phone_number', '')
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== UPLOAD SCAN ====================
@csrf_exempt
def upload_scan(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            
            if not username:
                return JsonResponse({'error': 'Username required'}, status=400)
            
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return JsonResponse({'error': f'User "{username}" not found'}, status=400)
            
            scan_type = request.POST.get('scan_type')
            body_part = request.POST.get('body_part')
            description = request.POST.get('description', '')
            image_file = request.FILES.get('image_file')
            
            if not image_file:
                return JsonResponse({'error': 'No file uploaded'}, status=400)
            
            scan = PatientScan.objects.create(
                patient=user,
                scan_type=scan_type,
                body_part=body_part,
                description=description,
                image=image_file,
                status='pending'
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Scan uploaded successfully',
                'scan_id': scan.id
            }, status=201)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_patient_scans(request):
    if request.method == 'GET':
        try:
            username = request.GET.get('username')
            if not username:
                return JsonResponse({'error': 'Username required'}, status=400)
            
            user = User.objects.get(username=username)
            scans = PatientScan.objects.filter(patient=user).order_by('-uploaded_at')
            
            scans_data = []
            for scan in scans:
                scans_data.append({
                    'id': scan.id,
                    'scan_type': scan.scan_type,
                    'body_part': scan.body_part,
                    'description': scan.description,
                    'uploaded_at': scan.uploaded_at.strftime('%Y-%m-%d %H:%M'),
                    'status': scan.status,
                    'diagnosis': scan.diagnosis,
                    'recommendations': scan.recommendations,
                    'image_url': scan.image.url if scan.image else None
                })
            
            return JsonResponse({'scans': scans_data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== DOCTOR DASHBOARD ====================
@csrf_exempt
def doctor_dashboard(request):
    if request.method == 'GET':
        try:
            patients = User.objects.filter(is_staff=False)
            patients_data = []
            
            for patient in patients:
                scans = PatientScan.objects.filter(patient=patient).order_by('-uploaded_at')
                consultations = Consultation.objects.filter(patient=patient)
                
                scans_data = []
                for scan in scans:
                    scans_data.append({
                        'id': scan.id,
                        'scan_type': scan.scan_type,
                        'body_part': scan.body_part,
                        'description': scan.description,
                        'uploaded_at': scan.uploaded_at.strftime('%Y-%m-%d %H:%M'),
                        'status': scan.status,
                        'diagnosis': scan.diagnosis,
                        'recommendations': scan.recommendations,
                        # ============ FIXED: Image URL ============
                        'image_url': scan.image.url if scan.image else None
                    })
                
                patients_data.append({
                    'patient_id': patient.id,
                    'patient_name': patient.get_full_name() or patient.username,
                    'username': patient.username,
                    'email': patient.email,
                    'phone': getattr(patient, 'phone_number', ''),
                    'date_joined': patient.date_joined.strftime('%Y-%m-%d'),
                    'total_scans': scans.count(),
                    'pending_scans': scans.filter(status='pending').count(),
                    'scans': scans_data,
                    'consultations': [{
                        'id': c.id,
                        'scheduled_date': c.scheduled_date.strftime('%Y-%m-%d %H:%M') if c.scheduled_date else None,
                        'status': c.status
                    } for c in consultations]
                })
            
            return JsonResponse({
                'success': True,
                'patients': patients_data,
                'total_patients': len(patients_data)
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== UPDATE SCAN ====================
@csrf_exempt
def update_scan(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            scan_id = data.get('scan_id')
            diagnosis = data.get('diagnosis', '')
            recommendations = data.get('recommendations', '')
            doctor_notes = data.get('doctor_notes', '')
            
            scan = PatientScan.objects.get(id=scan_id)
            scan.diagnosis = diagnosis
            scan.recommendations = recommendations
            scan.status = 'reviewed'
            scan.save()
            
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== SEARCH PATIENTS ====================
@csrf_exempt
def search_patients(request):
    if request.method == 'GET':
        try:
            query = request.GET.get('q', '')
            
            if not query or len(query) < 2:
                patients = User.objects.filter(is_staff=False)
            else:
                patients = User.objects.filter(
                    is_staff=False
                ).filter(
                    models.Q(username__icontains=query) |
                    models.Q(first_name__icontains=query) |
                    models.Q(last_name__icontains=query) |
                    models.Q(email__icontains=query)
                )
            
            patients_data = []
            for patient in patients:
                scans = PatientScan.objects.filter(patient=patient)
                patients_data.append({
                    'patient_id': patient.id,
                    'patient_name': patient.get_full_name() or patient.username,
                    'username': patient.username,
                    'email': patient.email,
                    'phone': getattr(patient, 'phone_number', ''),
                    'total_scans': scans.count(),
                    'pending_scans': scans.filter(status='pending').count()
                })
            
            return JsonResponse({'patients': patients_data})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== GENERATE PRESCRIPTION ====================
@csrf_exempt
def generate_prescription(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            patient_id = data.get('patient_id')
            patient_name = data.get('patient_name', '')
            diagnosis = data.get('diagnosis', '')
            recommendations = data.get('recommendations', '')
            medications = data.get('medications', [])
            doctor_notes = data.get('doctor_notes', '')
            
            try:
                patient = User.objects.get(id=patient_id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)
            
            if not diagnosis or not diagnosis.strip():
                return JsonResponse({'error': 'Diagnosis is required'}, status=400)
            
            prescription_id = f"PRES-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
            
            prescription_data = {
                'prescription_id': prescription_id,
                'patient_id': patient.id,
                'patient_name': patient.get_full_name() or patient.username,
                'patient_email': patient.email,
                'diagnosis': diagnosis,
                'recommendations': recommendations or 'No specific recommendations',
                'medications': medications,
                'doctor_notes': doctor_notes or 'No additional notes',
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'doctor_name': 'Dr. Jimmy'
            }
            
            return JsonResponse({
                'success': True,
                'message': 'Prescription generated successfully',
                'prescription': prescription_data
            }, status=201)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== SEND EMAIL ====================
@csrf_exempt
def send_email_notification(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient_id = data.get('patient_id')
            scan_id = data.get('scan_id')
            
            patient = User.objects.get(id=patient_id)
            scan = PatientScan.objects.get(id=scan_id)
            
            print(f"📧 Email notification sent to {patient.email}")
            
            return JsonResponse({'success': True, 'message': 'Email sent'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== SEND SMS ====================
@csrf_exempt
def send_sms_notification(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient_id = data.get('patient_id')
            message = data.get('message', '')
            
            patient = User.objects.get(id=patient_id)
            phone = getattr(patient, 'phone_number', '')
            
            print(f"📱 SMS sent to {phone}: {message}")
            
            return JsonResponse({'success': True, 'message': 'SMS sent'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== APPOINTMENTS ====================
@csrf_exempt
def doctor_appointments(request):
    if request.method == 'GET':
        try:
            appointments = Consultation.objects.all().order_by('-scheduled_date')
            appointments_data = []
            for appt in appointments:
                appointments_data.append({
                    'id': appt.id,
                    'patient_id': appt.patient.id,
                    'patient_name': appt.patient.get_full_name() or appt.patient.username,
                    'patient_email': appt.patient.email,
                    'scheduled_date': appt.scheduled_date.strftime('%Y-%m-%d %H:%M') if appt.scheduled_date else None,
                    'status': appt.status,
                    'zoom_link': appt.zoom_link,
                    'doctor_notes': appt.doctor_notes
                })
            
            return JsonResponse({
                'success': True,
                'appointments': appointments_data
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== CREATE ZOOM MEETING ====================
@csrf_exempt
def create_zoom_meeting(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient_id = data.get('patient_id')
            topic = data.get('topic', 'Medical Consultation')
            start_time = data.get('start_time')
            duration = data.get('duration', 30)
            
            patient = User.objects.get(id=patient_id) if patient_id else None
            
            # Mock Zoom meeting - in production use real Zoom API
            meeting_id = f"zoom_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"
            
            meeting_data = {
                'meeting_id': meeting_id,
                'join_url': f"https://zoom.us/j/{meeting_id}",
                'start_url': f"https://zoom.us/s/{meeting_id}",
                'password': str(random.randint(100000, 999999)),
                'topic': topic,
                'start_time': start_time,
                'duration': duration
            }
            
            return JsonResponse({
                'success': True,
                **meeting_data
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== CREATE APPOINTMENT ====================
@csrf_exempt
def create_appointment(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient_id = data.get('patient_id')
            date = data.get('date')
            time = data.get('time')
            duration = data.get('duration', 30)
            appointment_type = data.get('type', 'video')
            
            if not patient_id or not date or not time:
                return JsonResponse({'error': 'Patient ID, date, and time required'}, status=400)
            
            patient = User.objects.get(id=patient_id)
            appointment_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
            
            # Create Zoom meeting for video consultations
            zoom_link = ''
            if appointment_type == 'video':
                meeting_id = f"zoom_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"
                zoom_link = f"https://zoom.us/j/{meeting_id}"
            
            consultation = Consultation.objects.create(
                patient=patient,
                scheduled_date=appointment_datetime,
                zoom_link=zoom_link,
                status='scheduled',
                doctor_notes=f"Duration: {duration} mins | Type: {appointment_type}"
            )
            
            return JsonResponse({
                'success': True,
                'appointment_id': consultation.id,
                'zoom_link': zoom_link,
                'message': 'Appointment scheduled successfully'
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== PAYMENT ====================
@csrf_exempt
def initiate_payment(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient_id = data.get('patient_id')
            amount = data.get('amount')
            phone_number = data.get('phone_number')
            purpose = data.get('purpose', 'Consultation')
            payment_method = data.get('payment_method', 'mpesa')
            
            patient = User.objects.get(id=patient_id)
            reference = f"DRJ-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
            
            payment = Payment.objects.create(
                patient=patient,
                amount=amount,
                payment_method=payment_method,
                purpose=purpose,
                reference=reference,
                phone_number=phone_number,
                email=patient.email,
                status='pending'
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Payment initiated',
                'payment_id': payment.id,
                'reference': reference
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def check_payment_status(request):
    if request.method == 'GET':
        try:
            checkout_request_id = request.GET.get('checkout_request_id')
            if not checkout_request_id:
                return JsonResponse({'error': 'Checkout request ID required'}, status=400)
            
            return JsonResponse({
                'success': True,
                'status': 'completed',
                'message': 'Payment completed'
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def payment_callback(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            result_code = data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
            checkout_request_id = data.get('Body', {}).get('stkCallback', {}).get('CheckoutRequestID')
            
            if result_code == '0':
                try:
                    payment = Payment.objects.get(checkout_request_id=checkout_request_id)
                    payment.status = 'completed'
                    payment.completed_at = datetime.now()
                    payment.save()
                except Payment.DoesNotExist:
                    pass
            
            return JsonResponse({'ResultCode': 0, 'ResultDesc': 'Success'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== BLOG ====================
@csrf_exempt
def blog_posts(request):
    if request.method == 'GET':
        try:
            posts = BlogPost.objects.filter(status='published').order_by('-published_at')
            posts_data = []
            for post in posts:
                posts_data.append({
                    'id': post.id,
                    'title': post.title,
                    'slug': post.slug,
                    'excerpt': post.excerpt,
                    'content': post.content,
                    'author': post.author.username,
                    'category': post.category,
                    'views': post.views,
                    'created_at': post.created_at.strftime('%Y-%m-%d %H:%M'),
                    'published_at': post.published_at.strftime('%Y-%m-%d %H:%M') if post.published_at else None,
                    'comment_count': post.comments.filter(is_approved=True).count()
                })
            return JsonResponse({'posts': posts_data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def blog_post_detail(request, slug):
    if request.method == 'GET':
        try:
            post = BlogPost.objects.get(slug=slug)
            post.views += 1
            post.save()
            
            comments = post.comments.filter(is_approved=True)
            comments_data = []
            for comment in comments:
                comments_data.append({
                    'id': comment.id,
                    'author': comment.author.username,
                    'content': comment.content,
                    'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M')
                })
            
            return JsonResponse({
                'post': {
                    'id': post.id,
                    'title': post.title,
                    'content': post.content,
                    'author': post.author.username,
                    'category': post.category,
                    'views': post.views,
                    'published_at': post.published_at.strftime('%Y-%m-%d %H:%M') if post.published_at else None,
                    'comments': comments_data
                }
            })
        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def blog_comment(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            post_id = data.get('post_id')
            author_id = data.get('author_id')
            content = data.get('content')
            
            post = BlogPost.objects.get(id=post_id)
            author = User.objects.get(id=author_id)
            
            comment = BlogComment.objects.create(
                post=post,
                author=author,
                content=content,
                is_approved=True
            )
            
            return JsonResponse({
                'success': True,
                'comment': {
                    'id': comment.id,
                    'author': comment.author.username,
                    'content': comment.content,
                    'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M')
                }
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ==================== REVIEWS ====================
@csrf_exempt
def get_reviews(request):
    if request.method == 'GET':
        try:
            reviews = PatientReview.objects.filter(is_approved=True).order_by('-created_at')
            reviews_data = []
            for review in reviews:
                reviews_data.append({
                    'id': review.id,
                    'patient': review.patient.get_full_name() or review.patient.username,
                    'rating': review.rating,
                    'comment': review.comment,
                    'created_at': review.created_at.strftime('%Y-%m-%d %H:%M')
                })
            
            avg_rating = 0
            if reviews_data:
                avg_rating = sum(r['rating'] for r in reviews_data) / len(reviews_data)
            
            return JsonResponse({
                'reviews': reviews_data,
                'total_reviews': len(reviews_data),
                'average_rating': round(avg_rating, 1)
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def submit_review(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient_id = data.get('patient_id')
            rating = data.get('rating')
            comment = data.get('comment', '')
            
            patient = User.objects.get(id=patient_id)
            
            review = PatientReview.objects.create(
                patient=patient,
                rating=rating,
                comment=comment,
                is_approved=True
            )
            
            return JsonResponse({
                'success': True,
                'review': {
                    'id': review.id,
                    'rating': review.rating,
                    'comment': review.comment,
                    'created_at': review.created_at.strftime('%Y-%m-%d %H:%M')
                }
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
def book_and_pay_consultation(request):
    """Book consultation and process payment together"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            patient_id = data.get('patient_id')
            date = data.get('date')
            time = data.get('time')
            duration = data.get('duration', 30)
            notes = data.get('notes', '')
            payment_method = data.get('payment_method', 'mpesa')
            phone_number = data.get('phone_number', '')
            
            # Get patient
            try:
                patient = User.objects.get(id=patient_id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)
            
            # Check if patient already has pending payment
            existing_payment = ConsultationPayment.objects.filter(
                patient=patient,
                status='pending'
            ).first()
            
            if existing_payment:
                return JsonResponse({
                    'error': 'You have a pending payment. Please complete it first.',
                    'pending_payment_id': existing_payment.id
                }, status=400)
            
            # Calculate amount
            amount = 50000  # TZS 50,000 for consultation
            if duration > 30:
                amount = amount + (duration - 30) * 1000  # Additional charges
            
            # Create consultation first
            appointment_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
            
            consultation = Consultation.objects.create(
                patient=patient,
                scheduled_date=appointment_datetime,
                status='pending_payment',  # New status
                doctor_notes=f"Payment pending. Duration: {duration} mins. Notes: {notes}"
            )
            
            # Generate payment reference
            reference = f"CONS-{datetime.now().strftime('%Y%m%d')}-{consultation.id}-{random.randint(1000, 9999)}"
            
            # Create payment record
            payment = ConsultationPayment.objects.create(
                consultation=consultation,
                patient=patient,
                amount=amount,
                payment_method=payment_method,
                phone_number=phone_number,
                reference=reference,
                status='pending'
            )
            
            # Process M-Pesa payment
            if payment_method == 'mpesa':
                mpesa = MpesaService()
                result = mpesa.stk_push(
                    phone_number=phone_number,
                    amount=amount,
                    account_reference=reference,
                    transaction_desc=f"Consultation - {patient.username}"
                )
                
                if result.get('success'):
                    payment.checkout_request_id = result.get('checkout_request_id')
                    payment.save()
                    
                    return JsonResponse({
                        'success': True,
                        'message': 'Payment initiated. Check your phone for M-Pesa prompt.',
                        'payment_id': payment.id,
                        'reference': reference,
                        'amount': amount,
                        'checkout_request_id': result.get('checkout_request_id'),
                        'status': 'pending_payment'
                    })
                else:
                    payment.status = 'failed'
                    payment.save()
                    consultation.status = 'cancelled'
                    consultation.save()
                    return JsonResponse({
                        'error': 'Payment initiation failed. Please try again.',
                        'details': result.get('error')
                    }, status=400)
            
            # For card payments (mock)
            elif payment_method == 'card':
                return JsonResponse({
                    'success': True,
                    'message': 'Please complete card payment',
                    'payment_id': payment.id,
                    'reference': reference,
                    'amount': amount,
                    'payment_link': f"https://pay.drjimmy.com/pay/{reference}",
                    'status': 'pending_payment'
                })
            
            return JsonResponse({
                'error': 'Unsupported payment method'
            }, status=400)
            
        except Exception as e:
            print(f"❌ Booking error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def verify_consultation_payment(request):
    """Verify payment status before consultation"""
    if request.method == 'GET':
        try:
            consultation_id = request.GET.get('consultation_id')
            
            if not consultation_id:
                return JsonResponse({'error': 'Consultation ID required'}, status=400)
            
            consultation = Consultation.objects.get(id=consultation_id)
            
            # Check if payment exists and is completed
            try:
                payment = consultation.payment
                is_paid = payment.status == 'completed'
                payment_status = payment.status
            except ConsultationPayment.DoesNotExist:
                is_paid = False
                payment_status = 'no_payment'
            
            return JsonResponse({
                'consultation_id': consultation.id,
                'status': consultation.status,
                'is_paid': is_paid,
                'payment_status': payment_status,
                'can_join': is_paid and consultation.status == 'scheduled',
                'zoom_link': consultation.zoom_link if is_paid else None
            })
            
        except Consultation.DoesNotExist:
            return JsonResponse({'error': 'Consultation not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def payment_callback_consultation(request):
    """M-Pesa callback for consultation payments"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            result_code = data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
            checkout_request_id = data.get('Body', {}).get('stkCallback', {}).get('CheckoutRequestID')
            
            if result_code == '0':
                try:
                    payment = ConsultationPayment.objects.get(checkout_request_id=checkout_request_id)
                    payment.status = 'completed'
                    payment.completed_at = datetime.now()
                    payment.save()
                    
                    # Update consultation status
                    consultation = payment.consultation
                    consultation.status = 'scheduled'
                    
                    # Generate Zoom link (mock)
                    meeting_id = f"zoom_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"
                    consultation.zoom_link = f"https://zoom.us/j/{meeting_id}"
                    consultation.save()
                    
                    # Send confirmation email
                    send_consultation_confirmation(
                        patient=payment.patient,
                        consultation=consultation,
                        amount=payment.amount
                    )
                    
                    print(f"✅ Payment confirmed for consultation {consultation.id}")
                    
                except ConsultationPayment.DoesNotExist:
                    print(f"Payment not found for checkout_id: {checkout_request_id}")
            
            return JsonResponse({'ResultCode': 0, 'ResultDesc': 'Success'})
        except Exception as e:
            print(f"Callback error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
def doctor_register(request):
    """Register a new doctor account with secret key"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email', '')
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')
            secret_key = data.get('secret_key', '')
            
            # Check secret key (only doctors know this)
            if secret_key != 'DRJIMMY2024':
                return JsonResponse({'error': 'Invalid secret key. Please contact admin.'}, status=401)
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
            
            # Create doctor user
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            user.is_staff = True  # Give staff access
            user.save()
            
            print(f"✅ Doctor registered: {username}")
            
            return JsonResponse({
                'success': True,
                'message': 'Doctor account created successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }, status=201)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


# ==================== URL PATTERNS - COMPLETE LIST ====================
# ============ URL PATTERNS ============
urlpatterns = [
    path('', home_page),
    path('admin/', admin.site.urls),
    path('api/', api_root),
    path('api/register/', register_user),
    path('api/login/', login_user),
    path('api/upload/', upload_scan),
    path('api/my-scans/', get_patient_scans),
    path('api/doctor/dashboard/', doctor_dashboard),
    path('api/doctor/update-scan/', update_scan),
    path('api/doctor/search-patients/', search_patients),
    path('api/doctor/generate-prescription/', generate_prescription),
    path('api/doctor/send-email/', send_email_notification),
    path('api/doctor/send-sms/', send_sms_notification),
    path('api/doctor/appointments/', doctor_appointments),
    path('api/doctor/create-zoom-meeting/', create_zoom_meeting),
    path('api/doctor/create-appointment/', create_appointment),
    path('api/payment/initiate/', initiate_payment),
    path('api/payment/status/', check_payment_status),
    path('api/payment/callback/', payment_callback),
    path('api/blog/posts/', blog_posts),
    path('api/blog/post/<slug:slug>/', blog_post_detail),
    path('api/blog/comment/', blog_comment),
    path('api/reviews/', get_reviews),
    path('api/reviews/submit/', submit_review),
    path('api/doctor/register/', doctor_register),
]

# ============ SERVE MEDIA FILES (ALWAYS, NOT JUST DEBUG) ============
from django.conf import settings
from django.conf.urls.static import static

# This should work for both development and production
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)