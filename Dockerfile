FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/orbit-lab/browser/ /usr/share/nginx/html/
EXPOSE 8080
