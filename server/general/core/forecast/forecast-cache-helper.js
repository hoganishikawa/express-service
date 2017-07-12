/**
 * Created 26 Mar 2015
 * This file should contain caching layer for forecast provider
 */

"use strict";
var crypto = require("crypto"),
    moment = require("moment"),
    cache = require("../../../libs/cache"),
    log = require("../../../libs/log")(module),
    cacheHelper = require("../../../libs/cache-helper"),
    forecast = require("./forecast-provider");


/**
 * get cached results if exists, otherwise getHistoryDate, put to redis and return
 * @param geo location { latitude: *, longitude: *}
 * @param date moment object
 * @param cachingParams additional params for caching if needed
 * @param callback
 */
function getCachedDailyHistoryData(geo, date, cachingParams, callback) {

    if (!cachingParams) {
        cachingParams = {
            prefix: "WeatherHistory"
        };
    }

    var prefix = cachingParams.prefix;

    // this function return daily data, so we transform date a little
    // for our convenience
    //var day = date.utc().startOf("day").hour(12);
    var day = date.clone();

    // calculate redis key for each date
    var hash = crypto.createHash("md5")
        .update("" + geo.latitude)
        .update("" + geo.longitude)
        .update("" + date)
        .digest("hex");

    var key = prefix + "." + hash;

    log.debug("date = " + date);
    var func = forecast.getHistoryData.bind(null, geo, date);

    // calculate expire
    // 1 month expire for ancient data
    // 1 day for close data
    // 0.5 hours for current day

    var expire = 86400 * 30;

    // if earlier then 3 days
    if (moment.utc().subtract(3, "day").unix() < day.unix()) {
        expire = 86400;
    }

    // if today
    if (moment.utc().startOf("day").unix() <= day.startOf("day").unix()) {
        expire = 1800;
    }

    // if from future (forecast) then two hours
    if (moment.utc().add(1, "day").startOf("day").unix() < day.unix()) {
        expire = 3600 * 2;
    }

    log.silly("current date:" + moment.utc().format() + ", day:" + day.format() + ", expire: " + expire);
    cacheHelper.cacheFunctionWrapper(func, cache, key, expire, callback);
}


module.exports.getCachedDailyHistoryData = getCachedDailyHistoryData;
