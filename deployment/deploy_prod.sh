#!/bin/sh

ssh root@152.42.155.23 <<EOF
cd /var/www/html/ArchaeoVault
git pull
source /var/www/html/ArchaeoVault/myprojectenv
pip install -r requirements.txt
cd app
chmod +x manage.py
./manage.py makemigrations
./manage.py migrate  --run-syncdb

cd /var/www/html/ArchaeoVault/app/frontend
npm run build
cd /var/www/html
mv /var/www/html/ArchaeoVault/app/frontend/build/* /var/www/html/production/
sudo chown -R www-data:www-data /var/www/html/production
sudo chmod -R 755 /var/www/html/production
sudo service nginx restart


sudo service gunicorn restart
sudo service nginx restart
exit
EOF