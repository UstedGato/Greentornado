FROM node:alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN  apk add --no-cache --virtual .gyp \
        python \
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
    && apk --no-cache add pixman \
        cairo \
        pango \
        giflib \
        libjpeg \
        freetype \ 
        fontconfig \
        ttf-roboto \
    && npm install \
    && apk del .gyp

COPY . .

ENV PORT=80
EXPOSE 80

CMD node Bot.js

