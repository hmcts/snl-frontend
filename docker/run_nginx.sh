#!/usr/bin/env bash
export DOLLAR='$'
envsubst < config.json.template > /usr/share/nginx/html/browser/config.json
nginx -g "daemon off;"
