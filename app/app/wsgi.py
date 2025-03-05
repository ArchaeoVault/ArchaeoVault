"""
WSGI config for app project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

env = os.environ.get('DJANGO_ENV', 'None')

if env == 'production':
    settings_dir = 'app.production'
else:
    settings_dir = 'app.local'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_dir)

application = get_wsgi_application()
