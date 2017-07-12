/**
 * Created 14 Mar 2015
 */
"use strict";

var _ = require("lodash"),
    async = require("async"),
    moment = require("moment") || "";
var consts = require("../../../libs/consts");
var log = require("../../../libs/log")(module) || "";
var forecast = require("../../../general/core/forecast/forecast-provider"),
    forecastCaheHelper = require("../../../general/core/forecast/forecast-cache-helper"),
    forecastConverter = require("../../../general/core/forecast/forecast-converter");
var utils = require("../../../libs/utils");
var cache = require("../../../libs/cache"),
    cacheHelper = require("../../../libs/cache-helper");
var crypto = require("crypto");



/**
 * Send error to socket
 */
var sendErrorToTheClient = function(message, socket, errorEvent) {

    if (!errorEvent) {
        errorEvent = consts.WEBSOCKET_EVENTS.ASSURF.Weather;
    }

    var err = new Error(message);
    var result = new utils.serverAnswer(false, err);
    log.warn(err.message + " result: " + result);
    socket.emit(errorEvent, result);
};


var sendErrorToTheClientHistory = function(message, socket) {
    sendErrorToTheClient(message, socket, consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory);
};


/**
 * validate location
 * @param location object wiht latitude and longitude
 * @return boolean (false on validation failed)
 */
var isValidLocation = function(location) {
    if (!location || !location.latitude || !location.longitude) {
        return false;
    }
    return true;
};


/**
 * validate dateRange (for history data)
 * @param dateRange
 * @returns {boolean}
 */
var isValidDateRange = function(dateRange) {
    if (!dateRange || !dateRange.from || !dateRange.to) {
        return false;
    }
    if (!moment(dateRange.from).isValid() || !moment(dateRange.to).isValid()) {
        return false;
    }
    return true;
};


/** send client the weather info
 * using webSocket consts.WEBSOCKET_EVENTS.ASSURF.Weather event
 * @param location for which weather data is required { latitude: x, longitude: y }
 * @param weatherProvider the object implementing necessary functions for weather
 * @param finalCallback function that should be called in the end, if exists
 * @param socket websocket
 */
var getWeather = function(location, weatherProvider, socket, finalCallback) {

    log.debug("GetWeatherBySocket");

    if (!isValidLocation(location, socket)) {
        return sendErrorToTheClient("Incorrect location parameters", socket);
    }

    // calculate redis key for each date
    var hash = crypto.createHash("md5")
        .update("" + location.latitude)
        .update("" + location.longitude)
        .digest("hex");

    // load the data from the weather provider
    async.waterfall([
        function(next) {
            // cache current weather for an half hour
            var key = consts.WEBSOCKET_EVENTS.ASSURF.Weather + ".current." + hash;
            var func = weatherProvider.getForecastData.bind(null, location);
            cacheHelper.cacheFunctionWrapper(func, cache, key, 1800, next);
        },
        function(forecastData, next) {

            var key = consts.WEBSOCKET_EVENTS.ASSURF.Weather + ".week." + hash;
            var func = weatherProvider.getHistoryDataForPrevWeek.bind(null, location);

            // cache week for 1 day
            cacheHelper.cacheFunctionWrapper(func, cache, key, 86400, function(err, historyLst) {
                if (err) {
                    return next(err);
                }

                forecastData.history = _.flatten(historyLst);
                forecastData.current.longitude = location.longitude;
                forecastData.current.latitude = location.latitude;
                if (location.city) {
                    forecastData.current.city = location.city;
                }

                // send to the client resulting data
                var result = new utils.serverAnswer(true, forecastData);
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Weather, result);
                next();
            });
        }],
        function(err) {
            if (err) {
                log.error(err);
                return socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Weather, new utils.serverAnswer(false, err));
            }

            if(finalCallback) {
                finalCallback(null);
            }
        }
    );
};


var getWeatherHistory = function(location, dateRange, weatherProvider, socket) {

    if (!isValidLocation(location, socket)) {
        return sendErrorToTheClientHistory("Incorrect location parameters", socket);
    }

    if (!isValidDateRange(dateRange, socket)) {
        return sendErrorToTheClientHistory("Incorrect location parameters", socket);
    }

    var offset = location.zoneOffset || 0;
    log.silly("zoneOffset: " + offset);

    var start = moment.utc(dateRange.from).startOf("day");
    var end = moment.utc(dateRange.to).startOf("day");
    var days = [];

    while (start <= end) {
        days.push(start.clone().utcOffset(offset).hour(0).minute(0).second(0));
        start.add(1, "day");
    }

    // FIXME, need to move magic number into config
    async.mapLimit(days, 10, function(day, next) {

        log.debug("day = " + day.unix() + " " + day.toISOString());
        forecastCaheHelper.getCachedDailyHistoryData(location, day, null, next);

    }, function (err, results) {
        if (err) {
            return sendErrorToTheClientHistory(err.message, socket);
        }
        results = _.flatten(results);

        results.forEach(function(res) {
            res.city = location.city;
            res.icon = forecastConverter.replaceNightWithDay(res.icon);
        });

        var clientAns = new utils.serverAnswer(true, { history: results} );
        return socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory, clientAns);
    });
};


function getForecastIOWeather(location, socket, finalCallback) {
    return getWeather(location, forecast, socket, finalCallback);
}


function getForecastIOWeatherHistory(location, dateRange, socket) {
    return getWeatherHistory(location, dateRange, forecast, socket);
}


exports.getWeather = getWeather;
exports.getWeatherHistory = getWeatherHistory;

exports.getForecastIOWeather = getForecastIOWeather;
exports.getForecastIOWeatherHistory = getForecastIOWeatherHistory;
