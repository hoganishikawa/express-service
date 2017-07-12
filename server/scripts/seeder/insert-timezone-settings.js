"use strict";
var mongoose = require("mongoose"),
    Timezone = mongoose.model("timezone"),
    async = require("async"),
    moment = require("moment"),
    consts = require("../../libs/consts");

function addTimeZoneItem(name, switchName, switchTimes) {
    var tz = new Timezone({
        name: name,
        switchName: switchName,
        switchTimes: switchTimes
    });

    return tz;
}

function addTimezones (callback) {

    Timezone.remove({}, function(err, res) {

        if(err) {
            callback(err);
        } else {

            //months are zero based
            var daylightSavingTimeStart = [
                moment.utc([2015, 2, 8, 2]),
                moment.utc([2016, 2, 13, 2]),
                moment.utc([2017, 2, 12, 2])
            ];

            var daylightSavingTimeEnd = [
                moment.utc([2015, 10, 1, 2]),
                moment.utc([2016, 10, 6, 2]),
                moment.utc([2017, 10, 5, 2])
            ];

            var tzToInsert = [];

            tzToInsert.push(addTimeZoneItem("Atlantic Standard Time",
                "Atlantic Daylight Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("Alaska Standard Time",
                "Alaska Daylight Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("Central Standard Time",
                "Central Daylight Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("Eastern Standard Time",
                "Eastern Daylight Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("Hawaii-Aleutian Standard Time",
                "Hawaii-Aleutian Daylight Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("Mountain Standard Time",
                "Mountain Daylight Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("Pacific Standard Time",
                "Pacific Daylight Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("Pierre & Miquelon Standard Time",
                "Pierre & Miquelon Daylight Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("East Greenland Time",
                "Eastern Greenland Summer Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("Newfoundland Standard Time",
                "Newfoundland Daylight Time", daylightSavingTimeStart));

            tzToInsert.push(addTimeZoneItem("West Greenland Time",
                "Western Greenland Summer Time", daylightSavingTimeStart));


            tzToInsert.push(addTimeZoneItem("Atlantic Daylight Time",
                "Atlantic Standard Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Alaska Daylight Time",
                "Alaska Standard Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Central Daylight Time",
                "Central Standard Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Eastern Daylight Time",
                "Eastern Standard Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Hawaii-Aleutian Daylight Time",
                "Hawaii-Aleutian Standard Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Mountain Daylight Time",
                "Mountain Standard Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Pacific Daylight Time",
                "Pacific Standard Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Pierre & Miquelon Daylight Time",
                "Pierre & Miquelon Standard Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Eastern Greenland Summer Time",
                "East Greenland Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Newfoundland Daylight Time",
                "Newfoundland Standard Time", daylightSavingTimeEnd));

            tzToInsert.push(addTimeZoneItem("Western Greenland Summer Time",
                "West Greenland Time", daylightSavingTimeEnd));

            async.each(tzToInsert, function (tz, cb) {
                tz.save(cb);

            }, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, consts.OK);
                }
            });
        }
    });
}

exports.addTimezones = addTimezones;