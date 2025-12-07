# Heroku Deployment Guide (Docker)

> **✅ Using Docker Container Registry** - This deployment uses Docker containers, just like your local `docker-compose.yml` setup! This ensures consistency between local and production environments.

## Quick Start

1. **Install Heroku CLI** (if not already installed):
   ```bash
   # Visit https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Login to Heroku Container Registry**:
   ```bash
   heroku container:login
   ```

4. **Navigate to project root**:
   ```bash
   cd /path/to/webAppTemplate
   ```

5. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

6. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```
   (Replace `your-app-name` with your desired name, or omit for random name)

7. **Switch to container stack** (required for Docker):
   ```bash
   heroku stack:set container
   ```
   ⚠️ **Important:** This must be done before pushing containers!

8. **Add PostgreSQL database**:
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

9. **Set environment variables**:

   **For Unix/Mac (bash):**
   ```bash
   heroku config:set SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=$(heroku apps:info | grep "Web URL" | awk '{print $3}' | sed 's|https://||' | sed 's|/||')
   ```

   **For Windows (PowerShell):**
   ```powershell
   heroku config:set SECRET_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=*.herokuapp.com
   ```
   (Using `*.herokuapp.com` allows all Heroku subdomains, which is the simplest approach. Alternatively, you can set your exact domain by running `heroku apps:info` and copying the "Web URL")

10. **Build and push Docker image**:
   ```bash
   heroku container:push web
   ```

11. **Release the container**:
    ```bash
    heroku container:release web
    ```

12. **Open your app**:
    ```bash
    heroku open
    ```

13. **Verify migrations ran** (important!):
    ```bash
    heroku run python manage.py showmigrations
    ```
    All migrations should show `[X]` (applied). If you see `[ ]` (unapplied), run:
    ```bash
    heroku run python manage.py migrate
    ```

## How It Works

> **Docker on Heroku** - Your app runs in the same Docker container on Heroku as it does locally! This ensures:
> - ✅ Same environment (Python, Node.js versions)
> - ✅ Same dependencies
> - ✅ Same build process
> - ✅ Consistency between local and production

1. **Docker Build Process**:
   - **Stage 1 (Frontend)**: Builds React app using Node.js
   - **Stage 2 (Backend)**: Sets up Python/Django environment
   - Copies built React app into Django static files
   - Collects all static files

2. **Heroku Container Registry**:
   - Pushes your Docker image to Heroku's registry
   - Heroku runs your container (same as local Docker)

3. **Release Phase** (from `heroku.yml`):
   - Runs database migrations automatically
   - Collects static files
   - ⚠️ **Important:** If migrations don't run, you'll get 500 errors on API endpoints
   - Always verify with: `heroku run python manage.py showmigrations`

4. **Web Dyno**:
   - Runs your Docker container
   - Serves Django app with Gunicorn
   - React app served as static files
   - API endpoints at `/api/`

## Updating Your Deployment

After making changes:

```bash
# Build and push new image
heroku container:push web

# Release the new version
heroku container:release web
```

Or combine both:
```bash
heroku container:push web && heroku container:release web
```

## Troubleshooting

### 500 Error on API Endpoints (Register/Login)

**Most common cause:** Database migrations haven't run!

**Check:**
```bash
heroku run python manage.py showmigrations
```

**If you see `[ ]` (unapplied migrations):**
```bash
heroku run python manage.py migrate
```

**Why this happens:**
- Release phase migrations might fail silently
- Database was reset
- First deployment after database creation

**Prevention:** Always verify migrations after deployment:
```bash
heroku container:release web
heroku run python manage.py showmigrations
```

### Bad Request (400) Error

If you see a "Bad Request (400)" error, it's likely an `ALLOWED_HOSTS` issue. Django checks the Host header against `ALLOWED_HOSTS`.

**Quick fix:**
```bash
# Option 1: Use wildcard to allow all Heroku subdomains (recommended)
heroku config:set ALLOWED_HOSTS=*.herokuapp.com

# Option 2: Set your exact domain
heroku config:set ALLOWED_HOSTS=your-app-name-b02aeda79c87.herokuapp.com

# Option 3: Get your exact domain automatically (Unix/Mac)
heroku config:set ALLOWED_HOSTS=$(heroku apps:info | grep "Web URL" | awk '{print $3}' | sed 's|https://||' | sed 's|/||')

# Option 3: Get your exact domain (Windows PowerShell)
# First run: heroku apps:info
# Then copy the Web URL and set it:
heroku config:set ALLOWED_HOSTS=your-exact-domain.herokuapp.com
```

After setting `ALLOWED_HOSTS`, restart your app:
```bash
heroku restart
```

### View logs:
```bash
heroku logs --tail
```

### Check what domain your app is using:
```bash
heroku apps:info
```
Look for the "Web URL" - that's your exact domain.

### Check container status:
```bash
heroku ps
```

### Run commands in container:
```bash
heroku run python manage.py <command>
```

### Reset database (if needed):
```bash
heroku pg:reset DATABASE
heroku run python manage.py migrate
```

### Rebuild from scratch:
```bash
heroku container:push web --recursive
heroku container:release web
```

## Environment Variables

Set these in Heroku dashboard or via CLI:

- `SECRET_KEY`: Django secret key (auto-generated if not set)
- `DEBUG`: Set to `False` in production
- `ALLOWED_HOSTS`: Your Heroku app domain (e.g., `your-app.herokuapp.com`)
- `DATABASE_URL`: Automatically set by Heroku Postgres addon
- `PORT`: Automatically set by Heroku (don't set manually)

## Notes

- ✅ Uses the same `Dockerfile` approach as your local setup
- ✅ Frontend and backend are built together in one container
- ✅ React app is built during Docker build, not at runtime
- ✅ Static files are collected during build
- ✅ Database migrations run automatically on release
- ✅ Same Docker environment = fewer surprises!

## Comparison: Docker vs Buildpacks

| Feature | Docker (Current) | Buildpacks (Old) |
|--------|-----------------|------------------|
| Consistency | ✅ Same as local | ❌ Different from local |
| Environment | ✅ Controlled | ⚠️ Heroku-managed |
| Dependencies | ✅ Exact versions | ⚠️ Auto-detected |
| Build Process | ✅ Custom Dockerfile | ⚠️ Heroku decides |
| **Best for** | **Production apps** | Quick prototypes |
