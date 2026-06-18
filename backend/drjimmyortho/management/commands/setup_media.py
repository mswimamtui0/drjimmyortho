import os
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Setup media directories'

    def handle(self, *args, **options):
        self.stdout.write("📁 Setting up media directories...")
        
        # Create main media directory
        media_root = settings.MEDIA_ROOT
        if not os.path.exists(media_root):
            os.makedirs(media_root)
            self.stdout.write(self.style.SUCCESS(f"✅ Created: {media_root}"))
        
        # Create subdirectories
        subdirs = ['patient_scans', 'profile_pics', 'blog_images']
        for subdir in subdirs:
            subdir_path = os.path.join(media_root, subdir)
            if not os.path.exists(subdir_path):
                os.makedirs(subdir_path)
                self.stdout.write(self.style.SUCCESS(f"✅ Created: {subdir_path}"))
        
        self.stdout.write(self.style.SUCCESS("✅ Media directories setup complete!"))