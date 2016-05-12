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
var EyeosHippie = require('eyeos-hippie');

var eyeosHippie = new EyeosHippie();
var applicationUrl = '/application/v1/applications';

setup(function (done) {
	eyeosHippie.login(done, 'fake.user');
});

suite('#applications', function () {
	function applicationRequest (customHippie) {

		var hippie =  customHippie || eyeosHippie;
		return hippie.basicRequestWithCardAndSignature();

	}

	function applicationRequestInvalid (customHippie) {
		return applicationRequest(customHippie)
			.parser(function(body, fn) {
				fn(null, body);
			})
			.send({})
	}

	test("should return status 403 when POST applications without admin privileges", function (done) {
		applicationRequestInvalid()
			.post(applicationUrl)
			.expectStatus(403)
			.end(done);
	});

	test("should return status 200 or 201 when POST applications with admin privileges", function (done) {

		var app = [{
			'appID': 'eyeosapplication',
			'type': 'eyeos_application',
			'showInTab': false,
			'bigIcon': 'false',
			'smallIcon': 'false',
			'tooltip': 'Files',
			'url': '/appfiles/',
			'showInDesktop': true,
			'isVdi': false,
			'name': 'Fake Application',
			'description': 'Fake Files',
			'settings': {
				'minSize': {
					'height': 510,
					'width': 600
				}
			}
		}];

		var hippie = new EyeosHippie();
		hippie.login(function() {
				applicationRequestInvalid(hippie)
					.post(applicationUrl)
					.header("Content-Type", "application/json")
					.send(app)
					.expect(function(res, body, next) {
						if (res.statusCode < 400) {
							next();
							return;
						}
						next(new Error('Status code: ', res.statusCode, 'Expected: less than 400'));
					})
					.end(done);
			}, 'eyeos', 'eyeos');

	});


	test("should return status 405 when PUT applications", function (done) {
		applicationRequestInvalid()
			.put(applicationUrl)
			.expectStatus(405)
			.end(done);
	});

	test("should return status 200 when DELETE applications with admin privileges", function (done) {

		var hippie = new EyeosHippie();

		hippie.login(function() {
			applicationRequest(hippie)
			.del(applicationUrl)
			.expectStatus(200)
			.end(done);
		}, 'eyeos', 'eyeos');
	});

	test("should return status 403 when DELETE applications without admin privileges", function (done) {

		applicationRequestInvalid()
			.del(applicationUrl)
			.expectStatus(403)
			.end(done);
	});


	test("should return status 200 when GET applications with valid card and signature", function (done) {
		applicationRequest()
			.get(applicationUrl)
			.expectStatus(200)
			.end(done);
	});
});
