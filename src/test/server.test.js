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

var sinon = require('sinon');
var assert = require('chai').assert;
var Server = require('../lib/server');
var ApplicationApp = require('../lib/applicationApp');
var ExpressServer = require('../lib/expressServer');

suite("Server Suite", function () {
    var sut;
    var mongoose, settings,
        applicationApp, applicationInitStub,
        serverApp,
        expressServer,
        expressServerStartStub, expressServerPrepareServerAppStub, expressServerStopStub;

    setup(function () {
        settings = {
            persistence: {
                host: 'FAKE_HOST',
                port: 27017,
                db: 'FAKE_DB'
            }
        };
        mongoose = {
            connect: sinon.stub()
        };
        serverApp = "fake server app";
        applicationApp = new ApplicationApp();
        applicationInitStub = sinon.stub(applicationApp, 'init').returns(serverApp);
        expressServer = new ExpressServer();
        expressServerStartStub = sinon.stub(expressServer, 'start');
        expressServerStopStub = sinon.stub(expressServer, 'stop');
        expressServerPrepareServerAppStub = sinon.stub(expressServer, 'prepareServerApp');
        sut = new Server(settings, mongoose, applicationApp, expressServer);
    });

    suite("#prepare", function () {
        test("should prepare the server", function () {
            sut.prepare();
            sinon.assert.calledWithExactly(expressServerPrepareServerAppStub);
        });
    });

    suite('#start', function () {
        test("should start the expressServer", function () {
            sut.start();
            sinon.assert.calledWithExactly(expressServerStartStub);
        });
    });

    suite('#connect', function () {
        test("should connect to mongo", function() {
            sut.connect();
            var expectedMongoUrl = 'mongodb://'
                + settings.persistence.host + ':'
                + settings.persistence.port + '/'
                + settings.persistence.db;
            sinon.assert.calledWithExactly(mongoose.connect, expectedMongoUrl);
        });
    });

    suite('#stop', function () {
        test("should stop the server", function () {
            sut.stop();
            sinon.assert.calledWithExactly(expressServerStopStub);
        });
    });

});
