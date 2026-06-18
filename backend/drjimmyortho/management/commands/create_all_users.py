from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create all required users (admin and doctors)'

    def handle(self, *args, **options):
        self.stdout.write("=" * 50)
        self.stdout.write("🚀 CREATING USERS...")
        self.stdout.write("=" * 50)

        # Create Admin
        admin_username = 'admin'
        admin_email = 'admin@example.com'
        admin_password = 'admin123'

        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(admin_username, admin_email, admin_password)
            self.stdout.write(self.style.SUCCESS(f'✅ Admin "{admin_username}" created!'))
        else:
            self.stdout.write(self.style.WARNING(f'⚠️ Admin "{admin_username}" already exists!'))

        # Create Doctors
        doctors = [
            {
                'username': 'drjimmy',
                'password': 'drjimmy123',
                'email': 'drjimmy@example.com',
                'first_name': 'Jimmy',
                'last_name': 'Mswima'
            },
            {
                'username': 'drjames',
                'password': 'drjames123',
                'email': 'drjames@example.com',
                'first_name': 'James',
                'last_name': 'Johnson'
            }
        ]

        for doctor_data in doctors:
            username = doctor_data['username']
            
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    password=doctor_data['password'],
                    email=doctor_data['email'],
                    first_name=doctor_data['first_name'],
                    last_name=doctor_data['last_name']
                )
                user.is_staff = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f'✅ Doctor "{username}" created!'))
            else:
                self.stdout.write(self.style.WARNING(f'⚠️ Doctor "{username}" already exists!'))

        # Summary
        self.stdout.write("=" * 50)
        self.stdout.write("📋 ALL USERS IN DATABASE:")
        for user in User.objects.all():
            is_admin = "👑" if user.is_superuser else "👨‍⚕️" if user.is_staff else "👤"
            self.stdout.write(f"  {is_admin} {user.username} (staff: {user.is_staff}, superuser: {user.is_superuser})")
        self.stdout.write("=" * 50)
        self.stdout.write(self.style.SUCCESS("✅ User creation completed!"))