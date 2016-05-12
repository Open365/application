#!/usr/bin/env node
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

var Server = require('./lib/server');
var Notifier = require('eyeos-service-ready-notify');
var settings = require('./lib/settings');
var log2out = require('log2out'),
	logger = log2out.getLogger("eyeos-application");
var BusToHttp = require('eyeos-bustohttp');

logger.info('================= SETTINGS ================================================');
logger.info(settings);

var server = new Server();
server.prepare();
var conn = server.getConnection();

conn.on('connected', function () {
	server.start();
});

conn.on('error', function (err) {
	logger.error("MONGO CONNECTION ERROR:", err);
	logger.error("Killing process. When the mongo connection is lost we are unabled to recover from that. We trust process will be respawned");
	/**
	 * We have to kill the process because node-amqp is unable to cleantly disconnect and connect.
	 * It appears as in node-amqp/connection.js is not designed to be used as a singleton but
	 * eyeos-amqp is actually one which makes everything go to hell.
	 */
	process.exit(1);
});

server.connect();

// Initialize BusToHttp instances for each amqpQueue configured
settings.amqpServer.queues.forEach(function(queue) {
	var httpToBusOptions = {
		busHost: settings.amqpServer.host,
		busPort: settings.amqpServer.port,
		login: settings.amqpServer.login,
		passcode: settings.amqpServer.passcode,
		queueName: queue
	};
	var busToHttp = new BusToHttp();
	var httpHost = settings.httpServer.host;
	var httpPort = settings.httpServer.port;
	logger.info('Starting BusToHttp instance for HTTP: %s:%d and AMQP: %j', httpHost, httpPort, httpToBusOptions);
	busToHttp.start(httpToBusOptions, httpHost, httpPort, settings.amqpServer.prefetchCount);
});

// notify to systemd that the service is ready
var notifier = new Notifier();
notifier.registerService();
