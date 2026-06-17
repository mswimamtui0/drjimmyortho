#!/bin/bash
# Deployment Script for Dr. Jimmy Orthopedic

set -e

echo "🚀 Starting deployment..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Backend deployment
echo "📦 Deploying backend..."
cd /var/www/drjimmyortho/backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Restart backend service
echo "🔄 Restarting backend service..."
sudo systemctl restart gunicorn

# Frontend deployment
echo "📦 Deploying frontend..."
cd /var/www/drjimmyortho/frontend
npm install
npm run build

# Restart nginx
echo "🔄 Restarting nginx..."
sudo systemctl restart nginx

echo "✅ Deployment completed successfully!"