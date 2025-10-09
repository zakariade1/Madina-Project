FROM nginx:stable-alpine
RUN apk add --no-cache bash netcat-openbsd
COPY nginx.conf /etc/nginx/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]