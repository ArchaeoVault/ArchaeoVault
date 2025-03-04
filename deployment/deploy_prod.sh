#!/bin/sh

ssh root@$DJANGO_ALLOWED_HOST_2 <<EOF
cd /var/www/html/ArchaeoVault
git pull
source /var/www/html/ArchaeoVault/myprojectenv
pip install -r requirements.txt
cd app
./manage.py makemigrations
./manage.py migrate  --run-syncdb
sudo service gunicorn restart
sudo service nginx restart
exit
EOF