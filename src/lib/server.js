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

var mongoose = require('mongoose');
var settings = require('./settings');
var ExpressServer = require('./expressServer');
var ApplicationApp = require('./applicationApp');
var log2out = require('log2out');

function Server (customSettings, customMongoose, applicationApp, expressServer) {
    this.mongoose = customMongoose || mongoose;
    this.settings = customSettings || settings;
    this.applicationApp = applicationApp || new ApplicationApp();
    this.expressServer = expressServer || new ExpressServer(this.applicationApp);
    this.logger = log2out.getLogger("Server");
}

Server.prototype.prepare = function () {
    this.expressServer.prepareServerApp();
};

Server.prototype.getConnection = function () {
    return this.mongoose.connection;
};

Server.prototype.getExpressServer = function () {
    return this.expressServer;
};

Server.prototype.connect = function () {
    this.logger.debug("============================ Mongo connection", this.settings.persistence);

    this.mongoose.connect('mongodb://'
        + this.settings.persistence.host + ':'
        + this.settings.persistence.port + '/'
        + this.settings.persistence.db);
};

Server.prototype.start = function () {
    this.expressServer.start();
};

Server.prototype.stop = function () {
    this.expressServer.stop();
};

module.exports = Server;
