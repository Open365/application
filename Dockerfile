FROM docker-registry.eyeosbcn.com/alpine6-node-base

ENV WHATAMI application

ENV InstallationDir /var/service/

WORKDIR ${InstallationDir}

CMD eyeos-run-server --serf /var/service/src/eyeos-application.js

COPY alpine-*.list /var/service/
COPY . ${InstallationDir}

RUN apk update && \
    /scripts-base/buildDependencies.sh --production --install && \
    npm install --verbose --production && \
    npm cache clean && \
    /scripts-base/buildDependencies.sh --production --purgue && \
    rm -rf /etc/ssl /var/cache/apk/* /tmp/*
