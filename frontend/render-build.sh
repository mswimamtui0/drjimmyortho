#!/bin/bash
echo "🚀 Building React frontend for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🏗️ Building the app..."
CI=false npm run build

# Install serve for serving the build
echo "📡 Installing serve..."
npm install -g serve

echo "✅ Build completed successfully!"