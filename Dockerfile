#############################################################
# DOCKERFILE FOR APPLICATION SERVICE
#############################################################
# DEPENDENCIES
# * NodeJS (provided)
#############################################################
# BUILD FLOW
# 3. Copy the service to the docker at /var/service
# 4. Run the default installatoin
# 5. Add the docker-startup.sh file which knows how to start
#    the service
#############################################################

FROM docker-registry.eyeosbcn.com/eyeos-fedora21-node-base

ENV WHATAMI application

ENV InstallationDir /var/service/

WORKDIR ${InstallationDir}

CMD eyeos-run-server --serf /var/service/src/eyeos-application.js

RUN mkdir -p ${InstallationDir}/src/ && touch ${InstallationDir}/src/application-installed.js

COPY . ${InstallationDir}

RUN npm install -g eyeos-run-server && \
    npm install --verbose && \
    npm cache clean
