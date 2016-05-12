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

var ApplicationSchema = new mongoose.Schema({
    appID: {type:String, required: true, unique: true},
    name : {type:String, required: true},
    bigIcon: {type:String},
    smallIcon: {type:String, required: true},
    tooltip: {type:String},
    description:{type:String},
    url:{type:String, required: true},
    showInDesktop: {type:Boolean, default: false},
    showInTab: {type:Boolean, default: false},
    type: {type:String, default: 'eyeos_application'},
    settings:{
        minSize:{
            width: {type:Number},
            height: {type:Number}
        },
        // fileExtensions are required for vdi applications in eyeschool, to
        // be able to disable the 'open with vdi' in viewer and files-client
        // option on files from a disabled vdi application in the admin panel.
        //
        // fileExtensions are not needed at all for eyeOS Cloud nor for
        // non-vdi applications.
        //
        // See VDI-4361.
        fileExtensions:{type:[String], required: false}
    },
    isVdi: {type:Boolean, default: false},
    multipleInstances: { type: Boolean, default: true }
});

var ApplicationModel = mongoose.model('application', ApplicationSchema);

module.exports = ApplicationModel;
