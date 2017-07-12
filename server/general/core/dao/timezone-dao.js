"use strict";

var mongoose = require("mongoose"),
    Timezone = mongoose.model("timezone");

function getTimezoneSettings(callback) {

    Timezone.find({})
    	.lean()
        .exec(function (err, foundTimezones) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, foundTimezones);
            }
        });
}

exports.getTimezoneSettings = getTimezoneSettings;