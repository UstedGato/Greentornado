FROM node:current-alpine3.12

WORKDIR /app

COPY package.json .
COPY yarn.lock .

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
        libtool \
        autoconf \
        automake \
    && apk --no-cache add \
        pixman \
        cairo \
        pango \
        giflib \
        libjpeg \
        freetype \ 
        fontconfig \
        #for dotnet
        icu-libs \
        krb5-libs \
        libgcc \
        libintl \
        libssl1.1 \
        libstdc++ \
        zlib \
    && dotnet_version=3.1.8 \
    && wget -O dotnet.tar.gz https://dotnetcli.azureedge.net/dotnet/Runtime/$dotnet_version/dotnet-runtime-$dotnet_version-linux-musl-x64.tar.gz \
    && dotnet_sha512='6b441b3d658026af0c4ba3d852f4cde5c3a6336c01f0bfb244b1a2619becb44730c2bdb2c0a86b9ef3767660c776e44ce72b9a0e0bcf428b1e9d82c8a7d96267' \
    && echo "$dotnet_sha512  dotnet.tar.gz" | sha512sum -c - \
    && mkdir -p /usr/share/dotnet \
    && tar -C /usr/share/dotnet -oxzf dotnet.tar.gz \
    && ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet \
    && rm dotnet.tar.gz \
    && apk --no-cache add \
       ttf-roboto \
       --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
    && apk --no-cache add \
       neofetch \
       --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main \
    && yarn install --production \
    && apk del .gyp

COPY . .

ENV PORT=80 BOT_ENV=prod
EXPOSE 80

CMD node Bot.js
