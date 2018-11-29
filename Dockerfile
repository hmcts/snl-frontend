FROM nginx:1.15.7

## Copy our default nginx config
COPY docker/nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## Copydist folder to default nginx public folder
COPY dist /usr/share/nginx/html

COPY docker/config.json.template config.json.template
COPY docker/run_nginx.sh run_nginx.sh
RUN chmod +x run_nginx.sh

CMD "./run_nginx.sh"
