# local.py

from .base import *
import os
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "=q_#@(h(e!t=9-n%w$5xe)*clur*ty6_--=1a+4h)5q9p2c7_d"


ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test',
        'USER': 'postgres',
        'PASSWORD': 'DuffySHIFT34$',
        'HOST': '152.42.155.23',
        'PORT': '5432',
    }
}

STATIC_URL = '/static/'

