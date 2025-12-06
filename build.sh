#!/bin/bash
# Build script for Heroku deployment

echo "Building React frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Copying React build to Django static files..."
mkdir -p backend/staticfiles
cp -r frontend/build/* backend/staticfiles/ 2>/dev/null || true

echo "Build complete!"


