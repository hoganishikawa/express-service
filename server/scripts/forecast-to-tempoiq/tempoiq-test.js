/**
 * Created 02 Apr 2015
 */
"use strict";

var _ = require("lodash"),
    moment = require("moment");
var forecastConverter = require("../../general/core/forecast/forecast-converter");
var tempoiqWrapper = require("../../general/core/tempoiq/tempoiq-wrapper");
var argv = require("minimist")(process.argv.slice(2));
var log = require("../../libs/log")(module);


var params = {};


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
parseParam("to", moment.utc().format());
parseParam("latitude", 39.083672);
parseParam("longitude", -94.589407);

var from = moment(params.from);
var to = moment(params.to);

log.debug("from: " + from.toISOString() + ", to: " + to.toISOString());

var pipeline = null;

var weatherKey = "Forecast.Latitude:" + params.latitude + ".Longitude:" + params.longitude;
log.debug("weather key: " + weatherKey);
var selection = {
    "devices": {
        "key": weatherKey
    },
    "sensors": {
        "key": "Icon"
    }
};

tempoiqWrapper.loadData(
    from,
    to,
    selection,
    pipeline,
    null,
    function (err, data) {
        if (err) {
            log.error(err);
            process.exit(1);
        }
        _.forEach(data.dataPoints, function(item) {
            var icon = item.values[weatherKey].Icon;
            var res = {
                ts: item.ts,
                unix: moment(item.ts).unix(),
                icon: icon,
                value: forecastConverter.getForecastTextByNumber(icon)
            };
            console.log(JSON.stringify(res));
        });
        //console.log(JSON.stringify(data, null, 2));
    }
);

