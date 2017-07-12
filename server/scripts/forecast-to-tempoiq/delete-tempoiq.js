/**
 * Created 04 Apr 2015
 */
"use strict";

var _ = require("lodash"),
    moment = require("moment");
var tempoiq = require("tempoiq");
var argv = require("minimist")(process.argv.slice(2));
var log = require("../../libs/log")(module);
var config = require("../../config");
var client = new tempoiq.Client(
    config.get("tempoiq:apiKey"),
    config.get("tempoiq:apiSecret"),
    config.get("tempoiq:host")
),
    params = {};


function printHelpAndExit() {
    log.info("usage: node run.js --from=2014-01-01 --to=2015-03-01");
    process.exit(1);
}


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
parseParam("to");
parseParam("latitude", 39.083672);
parseParam("longitude", -94.589407);


var from = moment(params.from);
var to = moment(params.to);


function getWeatherKey() {
    return "Forecast.Latitude:" + params.latitude + ".Longitude:" + params.longitude;
}


function deleteTempoiqData() {
    var device = getWeatherKey();
    var sensorKey = "Icon";
    log.debug("device = " + device + ", sensor = " + sensorKey +
        " from = " + from.toISOString() + ", to = " + to.toISOString());
    client.deleteDatapoints(device, sensorKey, from.toISOString(), to.toISOString(), function(err, data) {
        if (err) {
            log.error(err);
        }
        log.debug("done: " + data);
    });
}


deleteTempoiqData();
