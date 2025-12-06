"""
URL configuration for todoapp project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from pathlib import Path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('todos.urls')),
]

# Serve React app for all non-API routes
REACT_BUILD_DIR = Path(__file__).resolve().parent.parent.parent / 'frontend' / 'build'
if REACT_BUILD_DIR.exists() or not settings.DEBUG:
    # Catch-all pattern: serve React app for any route that doesn't match above
    urlpatterns += [
        re_path(r'^(?!api|admin).*', TemplateView.as_view(template_name='index.html')),
    ]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

