FROM node:alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN  apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        git \
        pkgconfig \
    && npm install \
    && apk del .gyp\
    && echo "daemon off;" >> /etc/nginx/nginx.conf

COPY . .

ENV PORT=80
EXPOSE 80

CMD node Bot.js

