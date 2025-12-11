#!/bin/bash
# Script to check static files in Heroku container
echo "=== Checking staticfiles directory ==="
ls -la staticfiles/ 2>/dev/null || echo "staticfiles/ not found or empty"
echo ""
echo "=== Checking staticfiles/static/ ==="
ls -la staticfiles/static/ 2>/dev/null || echo "staticfiles/static/ not found"
echo ""
echo "=== Checking react_build directory ==="
ls -la react_build/ 2>/dev/null || echo "react_build/ not found"
echo ""
echo "=== Checking react_build/static/ ==="
ls -la react_build/static/ 2>/dev/null || echo "react_build/static/ not found"
echo ""
echo "=== Running collectstatic to see what happens ==="
python manage.py collectstatic --noinput --verbosity 2

