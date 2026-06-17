from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create doctor users'

    def handle(self, *args, **options):
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

        # List all users
        self.stdout.write("\n📋 All users:")
        for user in User.objects.all():
            self.stdout.write(f"  - {user.username} (is_staff: {user.is_staff})")