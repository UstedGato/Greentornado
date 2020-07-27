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
        libpixman-1-dev \
        libcairo2-dev \
        libpango1.0-dev \
        libjpeg8-dev \
        libgif-dev \
    && npm install \
    && apk del .gyp\
    && echo "daemon off;" >> /etc/nginx/nginx.conf

COPY . .

ENV PORT=80
EXPOSE 80

CMD node Bot.js

