FROM node:current-alpine3.12

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN  apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
        git \
        build-base \
        cairo-dev \
        jpeg-dev \
        pango-dev \
        musl-dev \
        giflib-dev \
        pixman-dev \
        pangomm-dev \
        libjpeg-turbo-dev \
        freetype-dev \
    && apk --no-cache add \
        pixman \
        cairo \
        pango \
        giflib \
        libjpeg \
        freetype \ 
        fontconfig \
    && apk --no-cache add \
       ttf-roboto \
       --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
    && apk --no-cache add \
       neofetch \
       --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main \
    && npm install -g yarn \
    && yarn \
    && apk del .gyp

COPY . .

ENV PORT=80
EXPOSE 80

CMD node Bot.js

