release: cd backend && python manage.py collectstatic --noinput && python manage.py migrate
web: cd backend && gunicorn todoapp.wsgi --log-file -

