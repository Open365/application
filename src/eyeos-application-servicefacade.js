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
var serviceFacade = require('servicefacade');

logger.info(settings);

var server = new Server();
server.prepare();
var ServiceFacade = serviceFacade.ServiceFacade;

settings.httpServer.app = server.getExpressServer().getApplication();
var server = serviceFacade.createBusToExpressServer(settings);
var persistence = settings.persistence;
var monitor = serviceFacade.createMongoMonitor(persistence.host, persistence.port, persistence.db);
var serviceFacade = new ServiceFacade();

serviceFacade.addServer(server);
serviceFacade.addMonitor(monitor);
serviceFacade.start();

// notify to systemd that the service is ready
var notifier = new Notifier();
notifier.registerService();
