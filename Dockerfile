FROM node:8.12.0-slim
WORKDIR /usr/src/app/dist
COPY --from=build /usr/src/app/dist/ ./
CMD node ./server.js