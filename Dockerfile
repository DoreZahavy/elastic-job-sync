FROM node:21-alpine3.18

COPY package.json /app/
COPY dist 

WORKDIR /app

RUN npm install

RUN set NODE_ENV=production

CMD ["node","server.js"]