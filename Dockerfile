FROM node:8.12.0-slim
WORKDIR /usr/src/app/dist
COPY dist ./
CMD node ./server.js