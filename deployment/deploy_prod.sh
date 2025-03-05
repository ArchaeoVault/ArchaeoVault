#!/bin/sh

ssh root@152.42.155.23 <<EOF
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