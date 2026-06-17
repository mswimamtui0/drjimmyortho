from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create admin user'

    def handle(self, *args, **options):
        username = 'admin'
        email = 'admin@example.com'
        password = 'admin123'

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username, email, password)
            self.stdout.write(self.style.SUCCESS(f'✅ Admin "{username}" created!'))
        else:
            self.stdout.write(self.style.WARNING(f'⚠️ Admin "{username}" already exists!'))

        # Also create doctor if not exists
        if not User.objects.filter(username='drjimmy').exists():
            user = User.objects.create_user(
                username='drjimmy',
                password='drjimmy123',
                email='drjimmy@example.com',
                first_name='Jimmy',
                last_name='Mswima'
            )
            user.is_staff = True
            user.save()
            self.stdout.write(self.style.SUCCESS('✅ Doctor "drjimmy" created!'))
        else:
            self.stdout.write(self.style.WARNING('⚠️ Doctor "drjimmy" already exists!'))