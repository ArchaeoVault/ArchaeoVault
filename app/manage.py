#!/usr/bin/env python

"""Django's command-line utility for administrative tasks."""
import os
import sys

env = os.environ.get('DJANGO_ENV', 'None')

if env == 'production':
    settings_dir = 'app.production'
else:
    settings_dir = 'app.local'


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_dir)
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
