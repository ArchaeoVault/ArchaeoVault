# production.py

from .base import *
DEBUG = False

ALLOWED_HOSTS = ['www.archaeovault.com','152.42.155.23']

# SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'your-production-secret-key')
SECRET_KEY = '2i@c=e*d^6&rohpwq)(5fn%46yo&c=y)j=ynw7=zxvx)gr39@s'

DATABASES = {
    #Prod database is not setup so for now this is connected to the test database
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test',
        'USER': 'postgres',
        'PASSWORD': 'DuffySHIFT34$',
        'HOST': '152.42.155.23',
        'PORT': '5432',
    }
}

# STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
STATIC_URL = '/static/'
