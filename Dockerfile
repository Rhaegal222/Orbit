FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY site/ /usr/share/nginx/html/
COPY src/styles/tokens.css /usr/share/nginx/html/orbit.css
EXPOSE 8080
