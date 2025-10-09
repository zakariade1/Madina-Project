#!/bin/sh
# Wait for the backend container (Flask) to start up
echo "Waiting for backend to be available on port 9000..."
until nc -z 127.0.0.1 9000; do
  sleep 1
done
echo "Backend is up! Starting Nginx..."

# Substitute $PORT and launch Nginx
envsubst '$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'