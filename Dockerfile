FROM  node:latest as build

COPY . /opt/game

WORKDIR /opt/game

RUN npm install && npm run js:build


FROM node:10.16.3-alpine

WORKDIR /opt/game

COPY --from=build /opt/game/public ./public

COPY --from=build /opt/game/server.js .

USER node

CMD ["node", "./server.js"]

EXPOSE 3000

