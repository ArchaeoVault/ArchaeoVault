# local.py

from .base import *
import os
import environ
env = environ.Env()
environ.Env.read_env()
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'None')

ALLOWED_HOSTS = [env('DJANGO_ALLOWED_HOST_1'), env('DJANGO_ALLOWED_HOST_2'),env('DJANGO_ALLOWED_HOST_3')]

DATABASES = {
    'default': {
        'ENGINE': env('ARCHAEODB_ENGINE'),
        'NAME': env('ARCHAEODB_NAME'),
        'USER': env('ARCHAEODB_USER'),
        'PASSWORD': env('ARCHAEODB_PASSWORD'),
        'HOST': env('ARCHAEODB_HOST'),
        'PORT': env('ARCHAEODB_PORT'),
    }
}

STATIC_URL = '/static/'

# Email configuration
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')

EMAIL_BACKEND = "sendgrid_backend.SendgridBackend"
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_HOST_USER = 'apikey'  #This is exactly the value apikey
EMAIL_HOST_PASSWORD = SENDGRID_API_KEY
EMAIL_PORT = 587
EMAIL_USE_TLS = True

