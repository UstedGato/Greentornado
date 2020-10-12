FROM node:current-alpine3.12

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN    apk add --no-cache \
        #for dotnet
        icu-libs \
        krb5-libs \
        libgcc \
        libintl \
        libssl1.1 \
        libstdc++ \
        zlib \
        gcompat \
    && apk add --no-cache --virtual .gyp \
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
    && apk --no-cache add \
       ttf-roboto \
       --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
    && apk --no-cache add \
       neofetch \
       --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main \
    && dotnet_version=3.1.8 \
    && wget -O dotnet.tar.gz https://dotnetcli.azureedge.net/dotnet/Runtime/$dotnet_version/dotnet-runtime-$dotnet_version-linux-musl-x64.tar.gz \
    && dotnet_sha512='6b441b3d658026af0c4ba3d852f4cde5c3a6336c01f0bfb244b1a2619becb44730c2bdb2c0a86b9ef3767660c776e44ce72b9a0e0bcf428b1e9d82c8a7d96267' \
    && echo "$dotnet_sha512  dotnet.tar.gz" | sha512sum -c - \
    && mkdir -p /usr/share/dotnet \
    && tar -C /usr/share/dotnet -oxzf dotnet.tar.gz \
    && ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet \
    && rm dotnet.tar.gz \
    && dotnet_sdk_version=3.1.402 \
    && wget -O dotnet.tar.gz https://dotnetcli.azureedge.net/dotnet/Sdk/$dotnet_sdk_version/dotnet-sdk-$dotnet_sdk_version-linux-musl-x64.tar.gz \
    && dotnet_sha512='30916407ee1f99c0f1398a45aa1a480b6d75c5e42488c877b7879ea68a03de07b29943e89e9324c3b14df4ca1d2723116a5c4812b2265cbb103488706aa56b70' \
    && echo "$dotnet_sha512  dotnet.tar.gz" | sha512sum -c - \
    && mkdir -p /usr/share/dotnet \
    && tar -C /usr/share/dotnet -oxzf dotnet.tar.gz ./packs ./sdk ./templates ./LICENSE.txt ./ThirdPartyNotices.txt \
    && rm dotnet.tar.gz \
    && yarn install --production \
    && apk del .gyp

COPY among-us ./among-us

WORKDIR /app/among-us/Client

RUN dotnet build

WORKDIR /app

COPY . .

ENV PORT=80 BOT_ENV=prod
EXPOSE 80

CMD node Bot.js
