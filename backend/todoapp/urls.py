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
# Always add the catch-all route - template should be in todoapp/templates/index.html
urlpatterns += [
    re_path(r'^(?!api|admin|static).*', TemplateView.as_view(template_name='index.html')),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

