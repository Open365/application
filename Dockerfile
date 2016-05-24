FROM docker-registry.eyeosbcn.com/alpine6-node-base

ENV WHATAMI sync

ENV InstallationDir /var/service/

WORKDIR ${InstallationDir}

CMD eyeos-run-server --serf /var/service/src/eyeos-application.js

RUN mkdir -p ${InstallationDir}/src/ && touch ${InstallationDir}src/application-installed.js

COPY . ${InstallationDir}

RUN apk update && apk add --no-cache curl make gcc g++ git python dnsmasq bash && \
    npm install --verbose --production && \
    npm cache clean && \
    apk del openssl ca-certificates libssh2 curl binutils-libs binutils gmp isl \
    libgomp libatomic pkgconf pkgconfig mpfr3 mpc1 gcc musl-dev libc-dev g++ expat \
    pcre git make libbz2 libffi gdbm ncurses-terminfo-base ncurses-terminfo ncurses-libs readline sqlite-libs python && \
    rm -r /etc/ssl /var/cache/apk/* /tmp/*
