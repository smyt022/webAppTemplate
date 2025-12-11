# Troubleshooting 500 Errors on Heroku

> **Note:** For local Docker development, migrations run automatically via `docker-compose.yml` command. On Heroku, migrations should run in the release phase, but sometimes they don't. Always verify!

## Common Causes of 500 Errors

### 1. **Database Migrations Not Run (500 Error on API)**
**Symptoms:** 
- 500 error when trying to register/login
- `showmigrations` shows all migrations as `[ ]` (unapplied)
- Error about table not existing

**Why this happens:**
- Release phase migrations might not have run
- Database was reset
- New deployment without migrations

**Fix:**
```bash
# Check migration status
heroku run python manage.py showmigrations

# Run migrations manually (if they show [ ])
heroku run python manage.py migrate

# Verify migrations applied
heroku run python manage.py showmigrations
# Should now show [X] for applied migrations
```

**Prevention:** Always check migrations after deployment:
```bash
heroku run python manage.py showmigrations
```

### 2. **Database Connection Issues**
**Symptoms:** Error about database connection
**Fix:**
```bash
# Check if DATABASE_URL is set
heroku config:get DATABASE_URL

# Check database connection
heroku run python manage.py dbshell
```

### 2. **Missing Environment Variables**
**Symptoms:** SECRET_KEY or other config errors
**Fix:**
```bash
# Check all config vars
heroku config

# Set missing variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
```

### 3. **Static Files Not Collected**
**Symptoms:** CSS/JS files not loading, or collectstatic errors
**Fix:**
```bash
# Run collectstatic manually
heroku run python manage.py collectstatic --noinput

# Check if staticfiles directory exists
heroku run ls -la staticfiles/
```

### 4. **Template Not Found**
**Symptoms:** TemplateDoesNotExist error
**Fix:**
```bash
# Check if template exists
heroku run ls -la todoapp/templates/

# Verify template is in the right location
heroku run python manage.py shell
# Then in shell: from django.template.loader import get_template; get_template('index.html')
```

### 5. **Import Errors or Code Issues**
**Symptoms:** Various Python errors in logs
**Fix:**
```bash
# Check logs for specific error
heroku logs --tail

# Test imports
heroku run python manage.py shell
# Try importing your modules
```

## Debugging Steps

1. **View detailed logs:**
   ```bash
   heroku logs --tail --num 100
   ```

2. **Enable DEBUG temporarily** (to see detailed error pages):
   ```bash
   heroku config:set DEBUG=True
   heroku restart
   ```
   ⚠️ **Remember to set it back to False after debugging!**

3. **Run Django check:**
   ```bash
   heroku run python manage.py check --deploy
   ```

4. **Test database connection:**
   ```bash
   heroku run python manage.py dbshell
   ```

5. **Check static files:**
   ```bash
   heroku run python manage.py collectstatic --noinput --verbosity 2
   ```

6. **Test a simple view:**
   ```bash
   heroku run python manage.py shell
   # Then test: from django.http import HttpResponse; HttpResponse("Test")
   ```

## Quick Fixes

### Rebuild and redeploy:
```bash
heroku container:push web
heroku container:release web
heroku restart
```

### Reset and start fresh:
```bash
# Reset database (⚠️ deletes all data!)
heroku pg:reset DATABASE
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

## Getting Help

If you're still stuck, check the logs and look for:
- **Traceback** - Shows the exact line causing the error
- **Error type** - e.g., `DoesNotExist`, `TemplateDoesNotExist`, `OperationalError`
- **File path** - Shows which file/module has the issue

Common error patterns:
- `OperationalError` → Database issue
- `TemplateDoesNotExist` → Template path issue
- `ModuleNotFoundError` → Missing dependency
- `AttributeError` → Code issue

