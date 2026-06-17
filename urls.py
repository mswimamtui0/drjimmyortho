from django.contrib import admin
from django.urls import path
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import json

def home_page(request):
    return HttpResponse("<h1>Dr. Jimmy Backend is Running!</h1><p>Go to <a href='/admin/'>admin</a> or use the frontend at port 3000</p>")

def api_root(request):
    return JsonResponse({
        'message': 'Dr. Jimmy Orthopedic API',
        'status': 'running',
        'endpoints': ['/api/upload/', '/api/login/', '/api/register/']
    })

@csrf_exempt
def test_upload(request):
    if request.method == 'POST':
        print("=== UPLOAD RECEIVED ===")
        print("Files:", request.FILES)
        print("POST:", request.POST)
        
        if request.FILES.get('image_file'):
            return JsonResponse({
                'success': True,
                'message': 'File received!',
                'file_name': request.FILES['image_file'].name
            })
        else:
            return JsonResponse({'error': 'No file'}, status=400)
    
    return JsonResponse({'message': 'Send POST request to upload'})

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email', '')
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username exists'}, status=400)
            
            user = User.objects.create_user(username=username, password=password, email=email)
            return JsonResponse({'success': True, 'user_id': user.id})
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
                    'username': user.username,
                    'user_id': user.id
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

urlpatterns = [
    path('', home_page),
    path('admin/', admin.site.urls),
    path('api/', api_root),
    path('api/upload/', test_upload),
    path('api/register/', register_user),
    path('api/login/', login_user),
]