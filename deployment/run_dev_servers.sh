ssh root@152.42.155.23 <<EOF
cd /var/www/html/ArchaeoVault
source /var/www/html/ArchaeoVault/myprojectenv/bin/activate
pip install -r requirements.txt
cd app
chmod +x manage.py
python manage.py runserver > /dev/null 2>&1 &
deactivate

cd /var/www/html/ArchaeoVault/app/frontend
npm start -- --host 0.0.0.0 > /dev/null 2>&1 &

cd /var/www/html/ArchaeoVault
source /var/www/html/ArchaeoVault/myprojectenv/bin/activate
cd /var/www/html/ArchaeoVault/app
exit
EOF