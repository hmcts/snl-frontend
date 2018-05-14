#!/usr/bin/env bash
echo Starting NGINX
export DOLLAR='$'
envsubst < config.json.template > /usr/share/nginx/html/browser/config.json
nginx -g "daemon off;"
