/**
 * Created 16 Mar 2015
 */
"use strict";

var _ = require("lodash") || "",
    async = require("async"),
    tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    cache = require("../../../libs/cache"),
    log = require("../../../libs/log")(module),
    crypto = require("crypto");

var profiling = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.YeildComparator);

// constants
var MONTH_FORMAT = "DD MMM";
var YEAR_FORMAT = "MMM YY";


/**
* data - transformed data
* startFrom date for cuclulate of previous year (for UT)
*/
function hasFullPreviousYear(data, startFrom) {

    if (!startFrom) {
        startFrom = moment();
    }

    var prevYear = startFrom.subtract(1, "year").year();
    var result = true;

    _.range(0, 12).forEach(function (item) {
        var key = moment.utc().year(prevYear).month(item).format(YEAR_FORMAT);
        if (!data[key]) {
            log.warn("no key: " + key);
            result = false;
        }
    });

    return result;
}


/**
 * Aggregate data from tempoIQ
 * @param data
 * @param tsTransformator function to transform datapoint.ts (used for aggregation)
 * @returns {{}}
 */
function transformTempoiqResponse(data, tsTransformator, nodeList) {

    if (!tsTransformator) {
        tsTransformator = function(ts) {
            return moment(ts).format(YEAR_FORMAT);
        };
    }

    var result = {};

    if (!data.dataPoints) {
        log.warn("transformTempoiqResponse: wrong object structure");
        return {};
    }

    _.forEach(data.dataPoints, function(datapoint) {

        var key = tsTransformator(datapoint.ts);

        result[key] = result[key] || { energy: 0, cost: 0} ;

        _.forOwn(datapoint.values, function(metrics, deviceId) {

            var rate = nodeList[deviceId].rate || 0;

            _.forOwn(metrics, function(value, metricName) {

                // need to divide by 1000 because client need kWh
                var kwh = (value / 1000);

                result[key].energy += kwh;

                result[key].cost += kwh * rate;
                //log.debug("ts: " + datapoint.ts + ", deviceId: " + deviceId +
                //    ", kwh: " + kwh + ", rate: " + rate);
            });
        });
    });

    return result;
}

/**
 * Calculate startDate and endDate for annual case
 *
 * @param inputDate
 * @returns {{startDate: *, endDate: *}}
 */
function calculateDataInterval(inputDate) {
    if (!inputDate) {
        inputDate = moment.utc();
    }
    var endDate = inputDate.endOf("month");
    var startDate = inputDate.clone().subtract(1, "year").startOf("year");
    return {startDate: startDate, endDate: endDate};
}


/**
 * Calculate startDate and endDate for month case (not enough data
 * for previous year)
 *
 * @param inputDate
 * @returns {{startDate: *, endDate: *}}
 */
function calculateMonthDataInterval(inputDate) {
    if (!inputDate) {
        inputDate = moment.utc();
    }
    var endDate = inputDate.endOf("month");
    var startDate = inputDate.clone().subtract(1, "month").startOf("month");
    return {startDate: startDate, endDate: endDate};
}


/**
 * transform data according to protocol and send to the client
 * @param transformedData result of transformTempoiqResponse
 * @param format can be month or year
 * @param socket io socket
 */
function sendAnswerToClient(transformedData, format, socket, cacheKey) {

    log.debug("sendAnswerToClient");

    var categories = [];

    // create if not exists
    var getCategory = function(date) {
        var index = _.findIndex(categories, function(cat) {
            return cat.date === date;
        });
        if (index === -1) {
            categories.push({date: date});
            return _.last(categories);
        }
        return categories[index];
    };

    var currentYear = moment.utc().startOf("year");
    var currentYearNum = currentYear.year();
    var currentMonth = moment.utc().startOf("month");
    var currentMonthNum = currentMonth.month();

    // create all categories in advanve
    _.range(0, 12).forEach(function(month) {
        var monthData = moment.utc().year(currentYearNum).month(month).
            format(YEAR_FORMAT);
        getCategory(monthData);
    });

    _.forOwn(transformedData, function(record, date) {

        var value = record.energy;
        var cost = record.cost;

        var formattedDate;
        var cat;

        if (format === "year") {

            formattedDate = moment.utc(date, YEAR_FORMAT).year(currentYearNum).
                format(YEAR_FORMAT);

            cat = getCategory(formattedDate);

            if (moment.utc(date, YEAR_FORMAT) < currentYear) {
                cat.previous = value;
                cat.previousCost = cost;
            } else {
                cat.current = value;
                cat.currentCost = cost;
            }

        } else if (format === "month") {

            formattedDate = moment.utc(date, MONTH_FORMAT).month(currentMonthNum).
                format(MONTH_FORMAT);

            cat = getCategory(formattedDate);

            if (moment.utc(date, MONTH_FORMAT) < currentMonth) {
                cat.previous = value;
                cat.previousCost = cost;
            } else {
                cat.current = value;
                cat.currentCost = cost;
            }
        }
    });

    var currentSeries = [];
    var previousSeries = [];
    var meanSerieas = [];
    var currentCostSeries = [];
    var previousCostSeries = [];

    var categoriesList = [];

    categories.forEach(function(cat) {
        categoriesList.push(cat.date);
        currentSeries.push(_.isNumber(cat.current) ? cat.current : null);
        previousSeries.push(_.isNumber(cat.previous) ? cat.previous : null);
        currentCostSeries.push(_.isNumber(cat.currentCost) ? cat.currentCost :  null);
        previousCostSeries.push(_.isNumber(cat.previousCost) ? cat.previousCost : null);

        var mean = ((cat.current || 0) + (cat.previous || 0)) / 2;
        if (!cat.current || !cat.previous) {
            mean = mean * 2;
        }
        meanSerieas.push(mean);
    });

    var result = {
        category: categoriesList,
        series: [
            {
                name: "current",
                data: currentSeries
            },
            {
                name: "currentCost",
                data: currentCostSeries
            },
            {
                name: "previous",
                data: previousSeries
            },
            {
                name: "previousCost",
                data: previousCostSeries
            },
            {
                name: "mean",
                data: meanSerieas
            }
        ]
    };

    var answer = new utils.serverAnswer(true, result);

    // put answer to the cache with ttl = 3600 (one hour)
    cache.setex(cacheKey, 3600, JSON.stringify(answer), function(err) {
        if (err) {
            log.warn(err);
        }
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.YeildComparator, answer);
    });
}


/**
 * Load data from tempoiq for the client (for two previous years)
 * @param clientObject the client object from websocket
 */
function loadData(clientObject, finalCallback) {

    if (!clientObject || !clientObject.socket) {
        return;
    }

    var cacheEnabled = true;

    var socket = clientObject.socket;
    //var dataObject = clientObject.yeildComparator;

    var nodeList = clientObject.nodeList;
    var selection = clientObject.selection;

    var selectionHash = crypto.createHash("md5")
        .update(JSON.stringify(selection))
        .digest("hex");

    // check answer in the cache
    var redisKey = consts.WEBSOCKET_EVENTS.ASSURF.YeildComparator + "." + selectionHash;
    log.debug("redis key: " + redisKey);

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.YeildComparator,
            new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
        return ;
    }

    async.waterfall([

        // check value in redis at first
        function (next) {
            if (!cacheEnabled) {
                return next();
            }
            cache.get(redisKey, function(err, reply) {
                if (err) {
                    log.error(err);
                    return next();
                }
                if (reply) {
                    try {
                        // we have found a cache in the redis
                        var result = JSON.parse(reply);
                        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.YeildComparator, result);
                        return next();
                    } catch (e) {
                        // nothing here, just corrupted cache
                    }
                }
                next();
            });
        },

        // load data for previous year
        function (next) {

            var pipeline = {
                "functions":[{
                    "name": "rollup",
                    "arguments": ["mean", "1hour"] //kwh data
                }, {
                    "name": "rollup",
                    "arguments": ["sum", "1month"] //set user dimension
                }]
            };

            var interval = calculateDataInterval(moment.utc());


            profiling.start("Tempoid");
            tempoiqWrapper.loadData(
                interval.startDate,
                interval.endDate,
                selection,
                pipeline, null,
                function (err, data) {
                    profiling.endTime("Tempoid");
                    if (err) {
                        log.error(err);
                        return socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.YeildComparator,
                            new utils.serverAnswer(false, err));
                    }

                    var transformedResult = transformTempoiqResponse(data, null, nodeList);
                    sendAnswerToClient(transformedResult, "year", socket,
                        redisKey);

                    data = null;

                    // according to the new logic we do not use months, only
                    // annual data with gaps

                    //if (hasFullPreviousYear(transformedResult)) {
                    //    // send data to the client and return from the waterfall
                    //    sendAnswerToClient(transformedResult, "year", socket,
                    //        redisKey);
                    //    return next(1);
                    //}

                    // continue
                    next();
                }
            );
        }

        // according to the new logic we do not use months, only
        // annual data with gaps

            //function (next) {
        //
        //    // we do not have full previous year,
        //    // so we just return previous and current months (with daily aggregation)
        //    var interval = calculateMonthDataInterval(moment.utc());
        //
        //    var pipeline = {
        //        "functions":[{
        //            "name": "rollup",
        //            "arguments": ["sum", "1day"]
        //        }]
        //    };
        //
        //    tempoiqWrapper.loadData(
        //        interval.startDate,
        //        interval.endDate,
        //        selection,
        //        pipeline, null,
        //        function (err, data) {
        //            if (err) {
        //                log.error(err);
        //                return socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.YeildComparator,
        //                    new utils.serverAnswer(false, err));
        //            }
        //
        //            var transformedResult = transformTempoiqResponse(data, function(ts) {
        //                return moment(ts).format(MONTH_FORMAT);
        //            });
        //            sendAnswerToClient(transformedResult, "month", socket,
        //                redisKey);
        //            return next();
        //        }
        //    );
        //}

    ],
    function(err) {
        // nothing here
        if(finalCallback) {
            finalCallback(err);
        }
    });
}


exports.loadData = loadData;

// for UT
exports.calculateDataInterval = calculateDataInterval;
exports.calculateMonthDataInterval = calculateMonthDataInterval;

// for UT
exports.transformTempoiqResponse = transformTempoiqResponse;

// for UT
exports.hasFullPreviousYear = hasFullPreviousYear;
