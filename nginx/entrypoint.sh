#!/bin/sh
set -e
echo "Waiting for backend (127.0.0.1:9000)..."
# Avoid 502s when Nginx starts before Flask
until nc -z 127.0.0.1 9000; do sleep 1; done
echo "Backend up. Starting Nginx."
# Expand $PORT into nginx.conf
envsubst '$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'