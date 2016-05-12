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
var ApplicationController = require('../lib/applicationController');
var Auth = require('eyeos-auth');

suite("ApplicationController Suite", function () {
    var sut;
    var controller, auth, settings;
    var logger;

    setup(function () {
        controller = {
            methods: sinon.stub(),
            query: sinon.stub(),
            request: sinon.stub()
        };
        auth = new Auth();
        settings = {
            filterPermissions: [{
                permission: 'eyeos.vdi.exec',
                field: 'isVdi',
                value: false
            }]
        };
        logger = {
            debug: sinon.stub(),
            info: sinon.stub(),
            warn: sinon.stub()
        };
        sut = new ApplicationController(settings, auth, logger);
        sut.setController(controller);
    });

    suite('#filterResults', function () {
        function createFakeRequest () {
            var query = {
                where: sinon.stub(),
                select: sinon.stub()
            };

            var where_in = {
                in: sinon.stub()
            };

            var in_sort = {
                sort: sinon.stub()
            };

            where_in.in.returns(in_sort);
            query.where.returns(where_in);


            var fakeReq = {
                baucis: {
                    query: query
                }
            };
            return fakeReq;
        }

        test("should prepare the filter query", function() {
            sut.filterResults();
            sinon.assert.calledWithExactly(controller.query, 'get', sinon.match.func);
        });

        test("should filter when there's no permissions", function () {
            var fakeReq = createFakeRequest();
            controller.query.callsArgWith(1, fakeReq, null, sinon.stub());
            sinon.stub(auth, "hasPermission").returns(false);
            sinon.stub(auth, "getApplicationsPermissions").returns([]);
            sut.filterResults();
            sinon.assert.calledWithExactly(fakeReq.baucis.query.where, 'isVdi', false);
        });

        test('should call to next', function () {
            var next = sinon.stub();
            var fakeReq = createFakeRequest();
            controller.query.callsArgWith(1, fakeReq, null, next);
            sinon.stub(auth, "getApplicationsPermissions").returns([]);
            sut.filterResults();
            sinon.assert.calledWithExactly(next);
        });

        test("should call remove unwanted fields", function () {
            var fakeReq = createFakeRequest();
            controller.query.callsArgWith(1, fakeReq, null, sinon.stub());
            sinon.stub(auth, "getApplicationsPermissions").returns([]);
            sut.filterResults();
            sinon.assert.calledWithExactly(fakeReq.baucis.query.select, '-_id -__v');
        });
    });

    suite('#filterMethods', function () {
        test("should disable the unwanted HTTP methods", function() {
            sut.filterMethods();
            sinon.assert.calledWithExactly(controller.methods, 'put', false)
        });
    });

    suite("#authenticateRequest", function () {
        test("should check the request", function () {
            sut.authenticateRequest();
            sinon.assert.calledWithExactly(controller.request, sinon.match.func);
        });

        function generateResponse () {
            return {
                sendStatus: sinon.stub()
            };
        }

        test("should response 401 error when verifyRequest fails", function () {
            var fakeResponse = generateResponse();
            controller.request.callsArgWith(0, sinon.stub(), fakeResponse, sinon.stub());
            sut.authenticateRequest();
            sinon.assert.calledWithExactly(fakeResponse.sendStatus, 401);
        });

        test("should continue when verifyRequest is ok", function () {
            var fakeResponse = generateResponse();
            var next = sinon.stub();
            sinon.stub(auth, "verifyRequest").returns(true);
            controller.request.callsArgWith(0, sinon.stub(), fakeResponse, next);
            sut.authenticateRequest();
            sinon.assert.calledWithExactly(next);
        });

        test("should not response 401 error when verifyRequest is ok", function () {
            var fakeResponse = generateResponse();
            var next = sinon.stub();
            sinon.stub(auth, "verifyRequest").returns(true);
            controller.request.callsArgWith(0, sinon.stub(), fakeResponse, next);
            sut.authenticateRequest();
            sinon.assert.notCalled(fakeResponse.sendStatus);
        });
    });

    suite("#prepareResponseLogs", function () {

        function getRequest () {
            return {
                baucis: {
                    outgoing: sinon.stub()
                }
            };
        }

        test("should prepare response logs", function () {
            sut.prepareResponseLogs();
            sinon.assert.calledWithExactly(controller.request, sinon.match.func);
        });

        test("should call to request.baucis.outgoing", function () {
            var request = getRequest();
            controller.request.callsArgWith(0, request, sinon.stub(), sinon.stub());
            sut.prepareResponseLogs();
            sinon.assert.calledWithExactly(request.baucis.outgoing, sinon.match.func);
        });

        test("should call to next()", function () {
            var next = sinon.stub();
            controller.request.callsArgWith(0, getRequest(), sinon.stub(), next);
            sut.prepareResponseLogs();
            sinon.assert.calledWithExactly(next);
        });

        test("should call to callback", function () {
            var request = getRequest(),
                context = "fake context",
                callback = sinon.stub();
            controller.request.callsArgWith(0, request, sinon.stub(), sinon.stub());
            request.baucis.outgoing.callsArgWith(0, context, callback);
            sut.prepareResponseLogs();
            sinon.assert.calledWithExactly(callback, null, context);
        });

        test("should log the context", function () {
            var request = getRequest(),
                context = "fake context";
            controller.request.callsArgWith(0, request, sinon.stub(), sinon.stub());
            request.baucis.outgoing.callsArgWith(0, context, sinon.stub());
            sut.prepareResponseLogs();
            sinon.assert.calledWithExactly(logger.info, context);
        });
    });

});
