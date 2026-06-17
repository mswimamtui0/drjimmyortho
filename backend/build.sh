#!/bin/bash
# Build script for Render

echo "🚀 Building Django backend..."

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

echo "✅ Build completed!"