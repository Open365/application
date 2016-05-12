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

var client = require("mongodb").MongoClient;
var format = require('util').format;
var fs = require('fs');
var args = process.argv;

// node apps always have 2 initial parameters: 'node' 'name-of-script.js'
// so if we need 6 parameters, we must check for 8
if (args.length != 8 ) {
	console.log("Invalid number of parameters:");
	console.log("usage is NAME TOOLTIP DESCRIPTION URL SMALLICONURL BIGICONURL");
	process.exit(code=0);
}

function insertApp(name, tooltip, description, url, smallIconUrl, bigIconUrl) {
	client.connect("mongodb://127.0.0.1:27017/eyeos", function(err, db) {
		var document = {
			bigIcon: bigIconUrl,
			smallIcon: smallIconUrl,
			name: name,
			tooltip: tooltip,
			description: description,
			url: url
		};
		db.collection("applications").insert(document, function(err, records) {
			console.log("Record added");
			db.close();
		});
	});
}

insertApp(args[2], args[3], args[4], args[5], args[6], args[7]);
