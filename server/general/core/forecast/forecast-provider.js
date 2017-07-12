/**
 * Created 15 Mar 2015
 */
"use strict";
var _ = require("lodash") || "",
    log = require("../../../libs/log")(module) || "",
    config = require("../../../config/index"),
    forecastApiKey = config.get("forecast:apiKey"),
    moment = require("moment"),
    nodeUtil = require("util"),
    request = require("request"),
    async = require("async");

var BASE_TIME_URL = "https://api.forecast.io/forecast/%s/%s,%s,%s?exclude=%s";
var BASE_CURRENT_URL = "https://api.forecast.io/forecast/%s/%s,%s?exclude=%s";


var DEFAULT_FIELDS = [
    "time",
    "icon",
    "temperatureMax",
    "temperatureMin",
    "sunriseTime",
    "sunsetTime",
    "humidity",
    "pressure",
    "windSpeed",
    "windBearing"
];


/**
 * return filter and change structure of forecast data
 * @param forecastResult
 * @param filterFields filter for fields
 */
function parseForecastAnswer(forecastResult, filterFields) {

    var result = {
        daily: [],
        hourly: [],
        hourlySummary: {}
    };

    var filter = function(value) {
        if (!filterFields) {
            return value;
        }
        return _.pick(value, filterFields);
    };

    if (forecastResult.hourly && forecastResult.hourly.data) {
        _.forEach(forecastResult.hourly.data, function (data) {

            var value = _.clone(data);
            if (filterFields) {
                value = filter(value);
            }
            result.hourly.push(value);
        });
    }

    if (forecastResult.hourly) {
        result.hourlySummary = {
            icon: forecastResult.hourly.icon,
            summary: forecastResult.hourly.summary
        };
    }

    if (forecastResult.daily && forecastResult.daily.data) {
        _.forEach(forecastResult.daily.data, function (data) {

            var value = _.clone(data);
            if (filterFields) {
                value = filter(value);
            }
            result.daily.push(value);
        });
    }

    return result;
}


/**
 * Return the forecast.io request in callback
 * @param geo location { latitude: x, longitude: y }
 * @param callback function(err, data)
 */
function getForecastData(geo, callback) {

    log.silly("getForecastData");

    if (!geo || !geo.latitude || !geo.longitude) {
        var error = new Error("Wrong geo prameter");
        return callback(error);
    }

    var currentUrl = nodeUtil.format(
        BASE_CURRENT_URL, forecastApiKey,
        geo.latitude, geo.longitude,
        "hourly,minutely,flags");

    request.get({ uri: currentUrl }, function (err, res, body) {
        if (err) {
            return callback(err);
        }

        var forecastAnswer = JSON.parse(body);
        var result = {
            current: forecastAnswer.currently,
            forecast: parseForecastAnswer(forecastAnswer, DEFAULT_FIELDS).daily
        };

        // move sunriseTime and sunset to current
        if (forecastAnswer.daily && forecastAnswer.daily.data) {
            var dataObj =  forecastAnswer.daily.data[0];
            if (dataObj.sunriseTime) {
                result.current.sunriseTime = dataObj.sunriseTime;
            }
            if (dataObj.sunsetTime) {
                result.current.sunsetTime = dataObj.sunsetTime;
            }
        }

        callback(null, result);
    });
}


/**
 * @param geo {location} { latitude: *, longitude: * }
 * @param date {object} moment.utc(obj)
 * @param params {object} extraParams for request { fields: *, hourly: {true|false} }
 * @param callback
 * @private
 */
function _getHistoryDataImpl(geo, date, params, callback) {

    log.silly("getHistoryData: location: " + JSON.stringify(geo) + " date: " +
        date.toISOString() + ", unix: " + date.unix());
    if (!params) {

        // defaults
        params = {
            fields: undefined,
            hourly: false,
            daily: true
        };
    }

    var exclude = "flags,currently,minutely";
    if (!params.hourly) {
        exclude += ",hourly";
    }
    if (!params.daily) {
        exclude += ",daily";
    }

    var currentUrl = nodeUtil.format(
        BASE_TIME_URL,
        forecastApiKey,
        geo.latitude,
        geo.longitude,
        date.unix(),
        exclude);

    log.silly("currentUrl: " + currentUrl);
    request.get({ uri: currentUrl }, function (err, res, body) {
        if (err) {
            return callback(err);
        }

        var forecastAnswer = JSON.parse(body);
        var processedAnswer = parseForecastAnswer(forecastAnswer, params.fields);

        callback(null, processedAnswer);
    });
}


/**
 * return history daily data with desired fields
 * @param geo location { latitude: *, longitude: * }
 * @param date moment.utc()
 * @param params {Object} extraParams for request { fields: *, hourly: {true|false} }
 * @param callback
 */
function getHistoryDataCustom(geo, date, params, callback) {

    if (!params) {
        params = {
            fields: DEFAULT_FIELDS,
            daily: true,
            hourly: true
        };
    }

    _getHistoryDataImpl(geo, date, params, function(err, result) {
        if (err) {
            return callback(err);
        }

        // this is a hack to fix icon on forecast.io
        // icon with daily precision sometimes shows night value
        //log.silly("date: " + date.format("YYYY-MM-DD") + ", daily icon: " +
        //    result.daily[0].icon + ", hourly icon " + result.hourlySummary.icon);
        //result.daily[0].icon = result.hourlySummary.icon;

        callback(null, result.daily);
    });
}


/**
 * return forecast for one day (daily) with default fields
 * @param geo location: { latitude: *, longitude: *}
 * @param date the date of history day
 * @param callback
 */
function getHistoryData(geo, date, callback) {
    return getHistoryDataCustom(geo, date, undefined, callback);
}


/**
 * return forecast hourly data for one day
 * @geo {location}
 * fields fields to filter, if undefined - all fields
 */
function getHistoryDataHourly(geo, date, fields, callback) {

    var params = {
        hourly: true,
        daily: false,
        fields: fields
    };

    _getHistoryDataImpl(geo, date, params, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result.hourly);
    });
}


/**
 * Return forecast history data for previous week
 * @param geo location: { latitude: *, longitude: *}
 * @param callback function(err, result)
 * answer format is array with structure:
 [{
     "currentTime": 1426395600,
     "icon": "partly-cloudy-day",
     "temperatureMax": 73.24,
     "temperatureMin": 38.64
 },
 {
     "currentTime": 1426482000,
     "icon": "partly-cloudy-night",
     "temperatureMax": 77.7,
     "temperatureMin": 51.31
 }]
 */
function getHistoryDataForPrevWeek(geo, callback) {

    log.silly("getHistoryDataForPrevWeek");
    if (!geo || !geo.latitude || !geo.longitude) {
        var error = new Error("Wrong geo prameter");
        return callback(error);
    }

    var offset = geo.zoneOffset || 0;
    log.silly("offset: " + offset);

    var dateWeekAgo = moment.utc().subtract(1, "week");

    var historyDates = [0, 1, 2, 3, 4, 5, 6].map(function(index) {
        return dateWeekAgo.clone().utcOffset(offset).day(index).startOf("day").
            hour(0).minute(0).second(0);
    });

    async.map(historyDates,
        function(date, next) {
            getHistoryDataCustom(geo, date, undefined, next);
        },
        function(err, results) {
            if (err) {
                log.error(err);
                return callback(err);
            }
            callback(null, results);
        }
    );
}


exports.getForecastData = getForecastData;
exports.getHistoryData = getHistoryData;
exports.getHistoryDataCustom = getHistoryDataCustom;
exports.getHistoryDataForPrevWeek = getHistoryDataForPrevWeek;
exports.getHistoryDataHourly = getHistoryDataHourly;
