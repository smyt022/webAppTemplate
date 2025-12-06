# Todo App - SaaS Template

## Overview

This is a bare-bones starting place that can later be built on to create a web app software. It includes a basic todo list app with user authentication using JWT tokens.

## Features

- User registration and login with JWT authentication
- Todo tasks can be added and deleted
- Todos are saved under each user's account and persist across sessions
- Clean, modern UI with gradient design

## Tech Stack

- **Frontend**: React.js
- **Backend**: Django with Django REST Framework
- **Authentication**: JWT (JSON Web Tokens) using djangorestframework-simplejwt
- **Database**: SQLite (default, can be changed to PostgreSQL for production)

## Project Structure

```
webAppTemplate/
├── backend/              # Django backend
│   ├── todoapp/         # Django project settings
│   ├── todos/           # Todos app with models, views, serializers
│   ├── manage.py
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── utils/       # Utility functions
│   │   └── App.js
│   └── package.json
├── docker-compose.yml   # Docker orchestration
└── README.md
```

## Docker Setup (Recommended)

### Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)

### Quick Start with Docker

1. **Clone or navigate to the project directory**

2. **Build and start the containers:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

4. **Stop the containers:**
   ```bash
   docker-compose down
   ```

### Docker Commands

- **Start containers in background:**
  ```bash
  docker-compose up -d
  ```

- **View logs:**
  ```bash
  docker-compose logs -f
  ```

- **View logs for specific service:**
  ```bash
  docker-compose logs -f backend
  docker-compose logs -f frontend
  ```

- **Rebuild containers (after dependency changes):**
  ```bash
  docker-compose up --build
  ```

- **Stop and remove containers:**
  ```bash
  docker-compose down
  ```

- **Stop and remove containers with volumes (clears database):**
  ```bash
  docker-compose down -v
  ```

## Local Development Setup (Without Docker)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional, for admin access):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

   The backend will be available at http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will be available at http://localhost:3000

## API Endpoints

- `POST /api/register/` - Register a new user
- `POST /api/token/` - Login and get JWT tokens
- `POST /api/token/refresh/` - Refresh access token
- `GET /api/todos/` - Get all todos for authenticated user
- `POST /api/todos/` - Create a new todo
- `DELETE /api/todos/<id>/` - Delete a todo

## Environment Variables

For production, create a `.env` file in the backend directory with:

```
SECRET_KEY=your-secret-key-here
DEBUG=False
```

The Docker setup uses default development values. Update `docker-compose.yml` for production settings.

## Notes

- The database is SQLite by default (stored in `backend/db.sqlite3`)
- For production, consider switching to PostgreSQL
- JWT tokens expire after 1 hour (access) and 7 days (refresh)
- CORS is configured to allow requests from localhost:3000

## Heroku Deployment

> **📖 For detailed deployment instructions, see [DEPLOY.md](DEPLOY.md)**

### Quick Deployment Steps

1. **Prerequisites:**
   - Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
   - Create a [Heroku account](https://signup.heroku.com)
   - Login: `heroku login`

2. **From project root** (not backend folder):
   ```bash
   # Initialize git if needed
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create Heroku app
   heroku create your-app-name
   
   # Add PostgreSQL database
   heroku addons:create heroku-postgresql:essential-0
   
   # Set up buildpacks (Node.js first, then Python)
   heroku buildpacks:add heroku/nodejs
   heroku buildpacks:add heroku/python
   
   # Set environment variables
   heroku config:set SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS=$(heroku apps:info | grep "Web URL" | awk '{print $3}' | sed 's|https://||' | sed 's|/||')
   
   # Deploy
   git push heroku main
   ```

3. **Open your app:**
   ```bash
   heroku open
   ```

### Important Notes

- ✅ React frontend builds automatically during deployment
- ✅ Frontend and backend served from same domain
- ✅ API endpoints at `/api/`
- ✅ Admin panel at `/admin/`
- ✅ Database migrations run automatically

### Common Commands

```bash
# View logs
heroku logs --tail

# Run migrations manually
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser

# Update deployment
git push heroku main
```

## CI/CD Considerations

The Docker setup makes this project ready for CI/CD pipelines:

1. **Build and test in CI:**
   ```bash
   docker-compose build
   docker-compose up -d
   docker-compose exec backend python manage.py test
   ```

2. **Deploy to production:**
   - Update `docker-compose.yml` with production settings
   - Use environment variables for secrets
   - Consider using a production-ready database (PostgreSQL)
   - Set up proper reverse proxy (nginx) for production

## License

This is a template project - feel free to use and modify as needed.
