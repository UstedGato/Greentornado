FROM ubuntu:20.04

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN apt-get update

RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true && debconf-set-selections /app/preseed.txt && apt-get -y install apt-utils nginx nodejs npm python3

RUN npm install --production

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

COPY . .

ENV PORT=80

EXPOSE 80

CMD nginx & node Bot.js

