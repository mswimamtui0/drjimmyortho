import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drjimmyortho.settings')
django.setup()

from django.contrib.auth.models import User

print("=" * 50)
print("🚀 CREATING USERS...")
print("=" * 50)

# Create Admin
admin_username = 'admin'
admin_email = 'admin@example.com'
admin_password = 'admin123'

if not User.objects.filter(username=admin_username).exists():
    User.objects.create_superuser(admin_username, admin_email, admin_password)
    print(f'✅ Admin "{admin_username}" created!')
else:
    print(f'⚠️ Admin "{admin_username}" already exists!')

# Create Doctor
doctor_username = 'drjimmy'
doctor_password = 'drjimmy123'
doctor_email = 'drjimmy@example.com'

if not User.objects.filter(username=doctor_username).exists():
    user = User.objects.create_user(
        username=doctor_username,
        password=doctor_password,
        email=doctor_email,
        first_name='Jimmy',
        last_name='Mswima'
    )
    user.is_staff = True
    user.save()
    print(f'✅ Doctor "{doctor_username}" created!')
else:
    print(f'⚠️ Doctor "{doctor_username}" already exists!')

print("=" * 50)
print("📋 ALL USERS:")
for user in User.objects.all():
    print(f"  - {user.username} (staff: {user.is_staff}, superuser: {user.is_superuser})")
print("=" * 50)