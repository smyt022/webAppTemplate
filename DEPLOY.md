# Heroku Deployment Guide

## Quick Start

1. **Install Heroku CLI** (if not already installed):
   ```bash
   # Visit https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Navigate to project root** (not backend folder):
   ```bash
   cd /path/to/webAppTemplate
   ```

4. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```
   (Replace `your-app-name` with your desired name, or omit for random name)

6. **Add PostgreSQL database**:
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

7. **Set up buildpacks** (Node.js first, then Python):
   ```bash
   heroku buildpacks:add heroku/nodejs
   heroku buildpacks:add heroku/python
   ```

8. **Set environment variables**:
   ```bash
   heroku config:set SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=$(heroku apps:info | grep "Web URL" | awk '{print $3}' | sed 's|https://||' | sed 's|/||')
   ```

9. **Deploy**:
   ```bash
   git push heroku main
   ```
   (Use `master` if that's your default branch: `git push heroku master`)

10. **Open your app**:
    ```bash
    heroku open
    ```

## How It Works

1. **Node.js buildpack** runs first:
   - Installs Node.js dependencies
   - Runs `heroku-postbuild` script from root `package.json`
   - Builds the React frontend

2. **Python buildpack** runs second:
   - Installs Python dependencies
   - Runs Django setup

3. **Release phase** (from Procfile):
   - Collects static files (including React build)
   - Runs database migrations

4. **Web dyno** starts:
   - Serves the Django app with Gunicorn
   - React app is served as static files
   - API endpoints at `/api/`

## Troubleshooting

### View logs:
```bash
heroku logs --tail
```

### Check buildpacks:
```bash
heroku buildpacks
```

### Run commands:
```bash
heroku run python manage.py <command>
```

### Reset database (if needed):
```bash
heroku pg:reset DATABASE
heroku run python manage.py migrate
```

### Update deployment:
```bash
git add .
git commit -m "Your changes"
git push heroku main
```

## Environment Variables

Set these in Heroku dashboard or via CLI:

- `SECRET_KEY`: Django secret key (auto-generated if not set)
- `DEBUG`: Set to `False` in production
- `ALLOWED_HOSTS`: Your Heroku app domain (e.g., `your-app.herokuapp.com`)
- `DATABASE_URL`: Automatically set by Heroku Postgres addon

## Notes

- The React app will be built automatically during deployment
- Frontend and backend are served from the same domain
- API calls use relative URLs (`/api/`) in production
- Static files are served via WhiteNoise middleware


