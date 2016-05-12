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
var ExpressServer = require('../lib/expressServer');

suite("ExpressServer Suite", function () {
    var sut;
    var app, settings, server;

    setup(function () {
        app = {
            use: sinon.stub(),
            delete: sinon.stub(),
            post: sinon.stub(),
            listen: sinon.stub()
        };
        settings = {
            httpServer: {
                path: "fake path",
                port: 'fake port'
            }
        };
        server = {
            close: sinon.stub()
        };

        var serverApp = {
            init: function(){
                return "fake init";
            }
        };

        sut = new ExpressServer(serverApp, app, settings, server);
    });

    suite("#prepareServerApp", function () {
        test("should call app.use app.post and app.delete with data", function() {

            sut.prepareServerApp();
            sinon.assert.calledWithExactly(app.use, settings.httpServer.path, "fake init");
            sinon.assert.calledWith(app.post, settings.httpServer.path + 'applications');
            sinon.assert.calledWith(app.delete, settings.httpServer.path + 'applications');
        });
    });

    suite('#start', function () {
        test("should call app.listen with port", function () {
            var serverApp = "fake serverApp";
            sut.start(serverApp);
            sinon.assert.calledWithExactly(app.listen, settings.httpServer.port);
        });

        test('should set the server as started', function () {
            var serverApp = "fake serverApp";
            sut.start(serverApp);
            assert.isTrue(sut.started);
        });
    });

    suite('#stop', function () {
        test("should do nothing when the server is not running", function () {
            sut.stop();
            sinon.assert.neverCalledWithMatch(server.close);
        });

        function executeStartAndStop() {
            app.listen.returns(server);
            sut.start();
            sut.stop();
        }

        test("should close the server when it's running", function () {
            executeStartAndStop();
            sinon.assert.calledWithExactly(server.close);
        });

        test("should set server as not running", function () {
            executeStartAndStop();
            assert.isFalse(sut.started);
        });
    });
});
