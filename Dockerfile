# Production Dockerfile for Heroku Container Registry
# This builds both frontend and backend in one container, ensuring consistency with local Docker setup
# Multi-stage build for production
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy and install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Python/Django stage
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built React app from frontend-builder stage
COPY --from=frontend-builder /app/frontend/build ./react_build

# Copy React index.html to templates (needed for serving the app)
RUN mkdir -p todoapp/templates && \
    cp react_build/index.html todoapp/templates/ 2>/dev/null || true

# Copy React static files directly to staticfiles/ during build
# React builds to: react_build/static/js/ and react_build/static/css/
# WhiteNoise serves from STATIC_ROOT (staticfiles/) with STATIC_URL (/static/)
# So /static/js/main.xxx.js → WhiteNoise looks for staticfiles/js/main.xxx.js
# We need to copy react_build/static/* to staticfiles/ (not staticfiles/static/)
RUN echo "=== Starting React static files copy ===" && \
    mkdir -p staticfiles && \
    echo "Checking react_build/static..." && \
    ls -la react_build/ 2>&1 | head -5 && \
    if [ -d "react_build/static" ]; then \
        echo "Found react_build/static, copying to staticfiles/..." && \
        cp -r react_build/static/. staticfiles/ && \
        echo "=== React static files copied successfully ===" && \
        echo "Verifying JS files:" && \
        ls -la staticfiles/js/ 2>&1 | head -5 && \
        echo "Verifying CSS files:" && \
        ls -la staticfiles/css/ 2>&1 | head -5; \
    else \
        echo "ERROR: react_build/static directory not found!" && \
        echo "Contents of react_build:" && \
        ls -la react_build/ 2>&1; \
    fi

# Expose port (Heroku sets PORT env var, default to 8000 for local)
EXPOSE ${PORT:-8000}

# Start server (migrations run in release phase via heroku.yml)
CMD gunicorn todoapp.wsgi --bind 0.0.0.0:${PORT:-8000}

