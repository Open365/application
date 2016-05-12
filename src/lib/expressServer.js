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

var express = require('express'),
    settings = require('./settings'),
    log2out = require('log2out'),
    Auth = require('eyeos-auth'),
    bodyParser = require('body-parser');

function ExpressServer (httpServerApp, app, customSettings) {
    this.app = app || express();
    this.settings = customSettings || settings;
    this.logger = log2out.getLogger("ExpressServer");
    this.started = false;
    this.auth = new Auth();
    this.httpServerApp = httpServerApp;
}

ExpressServer.prototype.getApplication = function () {
    return this.app;
};


ExpressServer.prototype._checkAdminPrivileges = function(req, res, next) {

    if (this.auth.verifyRequest(req)) {
        if (this.auth.hasPermission(req, 'EYEOS_ADMINISTRATOR')) {
            next();
            return;
        }
    }

    res.status(403).send('Not authorized').end();

};


ExpressServer.prototype.prepareServerApp = function () {

    var baucisRest = this.httpServerApp.init();

    this.app.use(bodyParser.json());

    // you need to be admin to post and delete
    this.app.delete(this.settings.httpServer.path + 'applications', this._checkAdminPrivileges.bind(this));
    this.app.post(this.settings.httpServer.path + 'applications', this._checkAdminPrivileges.bind(this));

    this.app.use(this.settings.httpServer.path, baucisRest);

};

ExpressServer.prototype.start = function () {
    this.logger.debug("****************************************************************");
    this.logger.debug("Start httpServer", this.settings.httpServer.path, this.settings.httpServer.port);
    this.logger.debug("****************************************************************");
    this.httpServer = this.app.listen(this.settings.httpServer.port);
    this.started = true;
};

ExpressServer.prototype.stop = function () {
    if (this.started) {
        this.httpServer.close();
        this.started = false;
    }
};

module.exports = ExpressServer;
