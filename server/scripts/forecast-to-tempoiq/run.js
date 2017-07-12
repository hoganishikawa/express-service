/**
 * Created 02 Apr 2015
 */
"use strict";

var _ = require("lodash"),
    async = require("async"),
    mongoose = require("mongoose");
var argv = require("minimist")(process.argv.slice(2));
var moment = require("moment");

    require("../../general/models");

var log = require("../../libs/log")(module) || "",
    config = require("../../config"),
    cache = require("../../libs/cache"),
    forecast = require("../../general/core/forecast/forecast-wrapper");


var tagDAO = require("../../general/core/dao/tag-dao");


function printHelpAndExit() {
    log.info("usage: node run.js --from=2014-01-01 --to=2015-03-01");
    process.exit(1);
}


if (argv.help) {
    printHelpAndExit();
}


var params = {};
function parseParam(paramName, defaultValue) {

    params[paramName] = argv[paramName];
    var value = params[paramName];
    if (!_.isNull(value) && !_.isUndefined(value)) {
        return;
    }
    if (defaultValue) {
        params[paramName] = defaultValue;
        return;
    }

    log.error("" + paramName + " is absent");
    printHelpAndExit();
}


parseParam("from");
parseParam("to", moment.utc().format());

/**
 *
 * @param from
 * @param to
 * @returns {Array}
 */
function calculateDays(from, to) {
    var start = moment.utc(from);
    var end = moment.utc(to);
    log.debug("start = " + start + ", end = " + end);

    var days = [];
    while (start <= end) {
        var value = start.clone().startOf("day").hour(12);
        log.debug("day value = " + value.toISOString());
        days.push(value);
        start.add(1, "day");
    }
    return days;
}


function findUniqueGeo(tags, callback) {

    var geo = {};

    _.forEach(tags, function(tag) {
        var key = tag.latitude + tag.longitude;
        geo[key] = { latitude: tag.latitude, longitude: tag.longitude };
    });

    callback(null, _.values(geo));
}


function main() {
    log.info("params: " + JSON.stringify(params));

    var tagFilter = {
        $and: [{latitude: {$ne:null}},
            {longitude: {$ne:null}}
        ]
    };

    var days = calculateDays(params.from, params.to);

    async.waterfall([
            function(next) {
                mongoose.connect(config.get("db:connection"), config.get("db:options"), next);
            },
            function(next) {
                log.debug("Connected successfully");
                tagDAO.getTagsByParams(tagFilter, next);
            },
            function(tags, next) {
                log.debug("Get tags ok");
                findUniqueGeo(tags, next);
            },
            function(locations, next) {
                log.debug("findUniqueGeo ok");
                log.debug(JSON.stringify(locations));

                locations.forEach(function(geo) {

                    async.each(days, function(day, eachNext) {
                            log.debug("loadForecastData " + day + " " + JSON.stringify(geo));
                            forecast.loadForecastDataByDay(geo, day, eachNext);
                        },
                        function(err) {
                            if (err) {
                                return next(err);
                            }
                        }
                    );
                });

                next();
            },
            function(next) {
                console.log(mongoose.connection.readyState);
                log.debug("mongoose.disconnected");
                mongoose.disconnect(next);
            }
    ],
    function(err) {
        if (err) {
            log.error(err);
            process.exit(1);
        }
        console.log(mongoose.connection.readyState);

        // wtf.... without that my script can't exit
        cache.quit();

        log.debug("end");
    });
}

main();

