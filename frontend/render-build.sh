#!/bin/bash
echo "🚀 Building React frontend for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🏗️ Building the app..."
CI=false npm run build

# Check if build was successful
if [ -d "build" ]; then
  echo "✅ Build completed successfully! Build folder exists."
  echo "📁 Contents of build folder:"
  ls -la build/
else
  echo "❌ Build failed - build folder not found!"
  exit 1
fi

echo "✅ Build completed successfully!"