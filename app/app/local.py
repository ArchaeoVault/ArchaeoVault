# local.py

from .base import *
import os
import environ
env = environ.Env()
environ.Env.read_env()
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'None')


ALLOWED_HOSTS = [env('DJANGO_ALLOWED_HOST_1'),env('DJANGO_ALLOWED_HOST_2') ]

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
print(DATABASES)

STATIC_URL = '/static/'

