FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/index.html /usr/share/nginx/html/
COPY deploy/favicon.ico /usr/share/nginx/html/
COPY deploy/*.js /usr/share/nginx/html/
COPY deploy/*.css /usr/share/nginx/html/
COPY deploy/lab/ /usr/share/nginx/html/lab/
COPY deploy/studio/ /usr/share/nginx/html/studio/
EXPOSE 8080
