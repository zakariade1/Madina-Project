FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf.template
# Expand $PORT at runtime
CMD ["/bin/sh","-c","envsubst '$$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]