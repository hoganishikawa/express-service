"use strict";

var mongoose = require("mongoose"),
    utils = require("../../libs/utils"),
    Schema = mongoose.Schema;

module.exports = function() {
    var timezoneSchema = new Schema({
        name: { type: String, enum: utils.getAllowedTimeZonesName(), unique: true},
        switchName: { type: String, enum: utils.getAllowedTimeZonesName(), unique: true},
        switchTimes: [Date]
    });

    mongoose.model("timezone", timezoneSchema);
};