FROM ubuntu:20.04

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN apt-get update

RUN apt-get -y install nginx

RUN apt-get -y install apt-utils

RUN apt-get -y install nodejs

RUN apt-get -y install npm

RUN apt-get -y install python3

RUN npm install --production

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

COPY . .

ENV PORT=80

EXPOSE 80

CMD nginx & node Bot.js

