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

var Auth = require('eyeos-auth'),
    log2out = require('log2out');

function ApplicationController(settings, auth, logger) {
    this.settings = settings;
    this.auth = auth || new Auth();
    this.logger = logger || log2out.getLogger("ApplicationController");
}

ApplicationController.prototype.setController = function(controller) {
    this.controller = controller;
};

ApplicationController.prototype.filterMethods = function() {
    this.logger.debug("*** Don't allow PUT method");
    this.controller.methods('put', false);
};

ApplicationController.prototype.filterResults = function() {
    this.logger.debug("*** Filter results by permissions");
    var self = this;
    this.controller.query('get', function (req, res, next) {
        var permissions = self.settings.filterPermissions;
        var hasPermission;
        permissions.forEach(function (perm) {
            hasPermission = self.auth.hasPermission(req, perm.permission);
            if (!hasPermission) {
                self.logger.info("Request does not have permission", perm.permission);
                req.baucis.query.where(perm.field, perm.value);
            }
        });


        var userAppsPermissions = self.auth.getApplicationsPermissions(req);

        if (!self.auth.hasPermission(req, "EYEOS_ADMINISTRATOR")) {

            userAppsPermissions = userAppsPermissions.map(function (item) {
                return item.split(".").pop();
            });

            req.baucis.query.where( "appID").in(userAppsPermissions).sort({ _id: 1 });
        }

        req.baucis.query.select('-_id -__v');

        next();
    });
};

ApplicationController.prototype.authenticateRequest = function () {
    this.logger.info("*** Authenticate request");
    var self = this;
    this.controller.request(function (req, res, next) {
        self.logger.info("Authenticating...", req.method, req.originalUrl, req.headers);
        if (self.auth.verifyRequest(req)) {
            self.logger.debug("next()");
            return next();
        }
        self.logger.warn("Reject request", req);
        return res.sendStatus(401);
    });
};

ApplicationController.prototype.prepareResponseLogs = function () {
    var self = this;
    this.controller.request(function (request, response, next) {
        request.baucis.outgoing(function (context, callback) {
            self.logger.info(context);
            callback(null, context);
        });
        next();
    });
};

module.exports = ApplicationController;