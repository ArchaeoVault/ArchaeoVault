# production.py
import os
from .base import *
DEBUG = False

ALLOWED_HOSTS = [os.environ.get('DJANGO_ALLOWED_HOST_1', 'None'), os.environ.get('DJANGO_ALLOWED_HOST_2', 'None'), os.environ.get('DJANGO_ALLOWED_HOST_3', 'None'), os.environ.get('DJANGO_ALLOWED_HOST_4', 'None')]

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'None')

DATABASES = {
    
    'default': {
        'ENGINE': os.environ.get('ARCHAEODB_ENGINE', 'None'),
        'NAME': os.environ.get('ARCHAEODB_NAME', 'None'),
        'USER': os.environ.get('ARCHAEODB_USER', 'None'),
        'PASSWORD': os.environ.get('ARCHAEODB_PASSWORD', 'None'),
        'HOST': os.environ.get('ARCHAEODB_HOST', 'None'),
        'PORT': os.environ.get('ARCHAEODB_PORT', 'None'),
    }
}

STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
STATIC_URL = '/static/'
