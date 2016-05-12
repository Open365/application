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

var mongoose = require('mongoose'),
    baucis = require('baucis'),
    ApplicationModel = require('./model/applicationModel'),
    ApplicationController = require('./applicationController'),
    settings = require('./settings'),
    log2out = require('log2out');

function ApplicationApp () {
    this.controller = new ApplicationController(settings);
    this.settings = settings;
    this.logger = log2out.getLogger("ApplicationApp");
}

ApplicationApp.prototype.init = function () {
    this.applications = mongoose.model(this.settings.mongoose.model, ApplicationModel);
    this.controller.setController(baucis.rest(this.settings.mongoose.model));
    this.controller.filterMethods();

    if(this.settings.security_mode === 'secure') {
        this.controller.authenticateRequest();
        this.controller.filterResults();
    }
    this.controller.prepareResponseLogs();
    return baucis();
};

module.exports = ApplicationApp;
