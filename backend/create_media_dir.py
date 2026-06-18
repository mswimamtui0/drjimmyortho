import os

# Create media directories
os.makedirs('media', exist_ok=True)
os.makedirs('media/patient_scans', exist_ok=True)
os.makedirs('media/profile_pics', exist_ok=True)
os.makedirs('media/blog_images', exist_ok=True)

print("✅ Media directories created successfully!")