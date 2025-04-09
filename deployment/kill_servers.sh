ssh root@152.42.155.23 <<EOF
fuser -k 8000/tcp
fuser -k 3000/tcp
exit
EOF