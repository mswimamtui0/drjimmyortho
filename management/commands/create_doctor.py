from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create a doctor user'

    def handle(self, *args, **options):
        username = 'drjimmy'
        email = 'drjimmy@example.com'
        password = 'drjimmy123'
        
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name='Jimmy',
                last_name='Mswima'
            )
            user.is_staff = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f'✅ Doctor "{username}" created!'))
        else:
            self.stdout.write(self.style.WARNING(f'⚠️ Doctor "{username}" already exists!'))