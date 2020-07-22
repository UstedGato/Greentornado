FROM aadev00/nginx-nodejs

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN apk update
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        git \
    && npm install \
    && apk del .gyp

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

COPY . .

ENV PORT=80
EXPOSE 80

CMD nginx & node Bot.js

