/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var environment = process.env;

var settings = {
    filterPermissions: [{
        permission: 'eyeos.vdi.exec',
        field: 'isVdi',
        value: false
    }],
    httpServer: {
        path: '/application/v1/',
        host: 'localhost',
        port: environment.APPLICATION_PORT || 8085
    },
    amqpServer: {
        host: 'rabbit.service.consul',
        port: 5672,
        login: environment.EYEOS_BUS_MASTER_USER || 'guest',
        passcode: environment.EYEOS_BUS_MASTER_PASSWD || 'guest',
        prefetchCount: +environment.APPLICATION_PREFETCH_COUNT || 0,
        queues: [
            'application.v1'
        ]
    },
    persistence: {
        host: environment.APPLICATION_PERSISTENCE_HOST || 'mongo.service.consul',
        port: environment.APPLICATION_PERSISTENCE_PORT || 27017,
        db: environment.APPLICATION_PERSISTENCE_DB || 'eyeos'
    },
    mongoose: {
        model: environment.APPLICATION_PERSISTENCE_TABLE || 'application'
    },
    security_mode: environment.APPLICATION_SECURITY_MODE || 'secure',
    systemgroups: {
        host: environment.APPLICATION_PROXY_HOST || 'proxy.service.consul',
        path: environment.EYEOS_PRINCIPAL_SYSTEMGROUPS_PATH || '/systemgroups/v1/systemgroups/'
    }
};

module.exports = settings;
