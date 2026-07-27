FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
USER root
RUN rm -f /usr/share/nginx/html/index.html
USER 101
COPY deploy/lab/ /usr/share/nginx/html/lab/
COPY deploy/studio/ /usr/share/nginx/html/studio/
COPY deploy/landing/ /usr/share/nginx/html/landing/
EXPOSE 8080
