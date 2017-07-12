"use strict";

var _ = require("lodash"),
    async = require("async"),
    tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    moment = require("moment"),
    calcUtils = require("./calculator-utils"),
    forecastConverter = require("../../../general/core/forecast/forecast-converter"),
    log = require("../../../libs/log")(module) || "",
    crypto = require("crypto"),
    cache = require("../../../libs/cache"),
    suncalc = require("suncalc");


var profiling = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy);

// constants
var MONTH_FORMAT = "DD MMM";
var YEAR_FORMAT = "MMM YY";

function mround(number, precision) {
    precision = Math.abs(parseInt(precision)) || 0;
    var coefficient = Math.pow(10, precision);
    return Math.round(number * coefficient) / coefficient;
}

function getPredictedDistributions(range, year, month) {
    range = (range === "total") ? "year" : range;

    var distributionsTable = [
        {
            "range": "tenyear",
            "year" : 2014,
            "month": null,
            "midx": null,
            "distributions": {
                "2014": 13.671,
                "2015": 86.369
            },
            "total": 30073.62302848334   //2months total for Feb and Mar
        },
        {
            "range": "year",
            "year" : 2014,
            "month": null,
            "midx": null,
            "distributions": {
                "Jan": 0,
                "Feb": 1.063,
                "Mar": 3.439,
                "Apr": 3.85,
                "May": 4.466,
                "Jun": 4.176,
                "Jul": 17.172,
                "Aug": 22.997,
                "Sep": 13.815,
                "Oct": 13.969,
                "Nov": 9.756,
                "Dec": 5.295
            },
            "total": 91037.7423992994
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Jan",
            "midx": 0,
            "distributions": {
            },
            "total": 0
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Feb",
            "midx": 1,
            "distributions": {
                "01 Feb": 0.584,
                "02 Feb": 3.401,
                "03 Feb": 11.03,
                "04 Feb": 0.443,
                "05 Feb": 0.091,
                "06 Feb": 0.242,
                "07 Feb": 0.277,
                "08 Feb": 0.031,
                "09 Feb": 0,
                "10 Feb": 0,
                "11 Feb": 0,
                "12 Feb": 0,
                "13 Feb": 0,
                "14 Feb": 0,
                "15 Feb": 0,
                "16 Feb": 0,
                "17 Feb": 0,
                "18 Feb": 0,
                "19 Feb": 0,
                "20 Feb": 0,
                "21 Feb": 6.082,
                "22 Feb": 9.694,
                "23 Feb": 8.569,
                "24 Feb": 9.916,
                "25 Feb": 8.07,
                "26 Feb": 14.227,
                "27 Feb": 14.626,
                "28 Feb": 12.716
            },
            "total": 968.0436173815833
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Mar",
            "midx": 2,
            "distributions": {
                "01 Mar": 1.68,
                "02 Mar": 0.232,
                "03 Mar": 1.603,
                "04 Mar": 3.446,
                "05 Mar": 3.335,
                "06 Mar": 4.134,
                "07 Mar": 3.797,
                "08 Mar": 0.854,
                "09 Mar": 4.337,
                "10 Mar": 4.356,
                "11 Mar": 3.35,
                "12 Mar": 3.538,
                "13 Mar": 4.643,
                "14 Mar": 3.103,
                "15 Mar": 4.587,
                "16 Mar": 1.197,
                "17 Mar": 4.838,
                "18 Mar": 4.687,
                "19 Mar": 1.43,
                "20 Mar": 4.714,
                "21 Mar": 4.116,
                "22 Mar": 4.117,
                "23 Mar": 5.124,
                "24 Mar": 2.25,
                "25 Mar": 3.864,
                "26 Mar": 4.909,
                "27 Mar": 0.84,
                "28 Mar": 2.393,
                "29 Mar": 1.803,
                "30 Mar": 4.845,
                "31 Mar": 1.879
            },
            "total": 3131.2021716032505
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Apr",
            "midx": 3,
            "distributions": {
                "01 Apr": 3.617,
                "02 Apr": 0.372,
                "03 Apr": 0.42,
                "04 Apr": 1.984,
                "05 Apr": 4.694,
                "06 Apr": 3.912,
                "07 Apr": 0.802,
                "08 Apr": 3.991,
                "09 Apr": 4.798,
                "10 Apr": 3.871,
                "11 Apr": 4.023,
                "12 Apr": 3.787,
                "13 Apr": 1.933,
                "14 Apr": 1.195,
                "15 Apr": 4.951,
                "16 Apr": 4.873,
                "17 Apr": 3.908,
                "18 Apr": 4.709,
                "19 Apr": 4.724,
                "20 Apr": 4.494,
                "21 Apr": 1.533,
                "22 Apr": 5.052,
                "23 Apr": 3.838,
                "24 Apr": 3.521,
                "25 Apr": 4.919,
                "26 Apr": 2.856,
                "27 Apr": 2.584,
                "28 Apr": 3.325,
                "29 Apr": 3.24,
                "30 Apr": 2.075
            },
            "total": 3505.24930324225
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "May",
            "midx": 4,
            "distributions": {
                "01 May": 1.546,
                "02 May": 2.049,
                "03 May": 4.087,
                "04 May": 4.2,
                "05 May": 3.833,
                "06 May": 3.819,
                "07 May": 2.638,
                "08 May": 2.823,
                "09 May": 3.138,
                "10 May": 4.073,
                "11 May": 3.066,
                "12 May": 2.925,
                "13 May": 0.856,
                "14 May": 1.555,
                "15 May": 3.245,
                "16 May": 3.622,
                "17 May": 3.92,
                "18 May": 4.453,
                "19 May": 3.499,
                "20 May": 4.551,
                "21 May": 3.411,
                "22 May": 3.515,
                "23 May": 4.157,
                "24 May": 2.609,
                "25 May": 2.762,
                "26 May": 3.122,
                "27 May": 2.994,
                "28 May": 3.691,
                "29 May": 3.13,
                "30 May": 2.9,
                "31 May": 3.81
            },
            "total": 4065.9650501061606
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Jun",
            "midx": 5,
            "distributions": {
                "01 Jun": 4.055,
                "02 Jun": 2.325,
                "03 Jun": 3.984,
                "04 Jun": 2.391,
                "05 Jun": 1.994,
                "06 Jun": 3.331,
                "07 Jun": 2.093,
                "08 Jun": 2.973,
                "09 Jun": 2.144,
                "10 Jun": 2.145,
                "11 Jun": 1.85,
                "12 Jun": 3.152,
                "13 Jun": 4.976,
                "14 Jun": 4.928,
                "15 Jun": 3.452,
                "16 Jun": 3.463,
                "17 Jun": 3.991,
                "18 Jun": 4.104,
                "19 Jun": 4.224,
                "20 Jun": 3.852,
                "21 Jun": 3.559,
                "22 Jun": 3.351,
                "23 Jun": 3.546,
                "24 Jun": 3.573,
                "25 Jun": 4.296,
                "26 Jun": 4.128,
                "27 Jun": 2.617,
                "28 Jun": 3.693,
                "29 Jun": 2.153,
                "30 Jun": 3.657
            },
            "total": 3801.6214629644287
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Jul",
            "midx": 6,
            "distributions": {
                "01 Jul": 0.805,
                "02 Jul": 1.007,
                "03 Jul": 0.966,
                "04 Jul": 0.961,
                "05 Jul": 0.9,
                "06 Jul": 0.838,
                "07 Jul": 0.881,
                "08 Jul": 0.984,
                "09 Jul": 0.929,
                "10 Jul": 1.977,
                "11 Jul": 3.291,
                "12 Jul": 4.746,
                "13 Jul": 3.775,
                "14 Jul": 3.57,
                "15 Jul": 4.818,
                "16 Jul": 4.36,
                "17 Jul": 4.16,
                "18 Jul": 4.019,
                "19 Jul": 4.16,
                "20 Jul": 4.96,
                "21 Jul": 4.908,
                "22 Jul": 4.632,
                "23 Jul": 4.792,
                "24 Jul": 5.265,
                "25 Jul": 4.149,
                "26 Jul": 2.576,
                "27 Jul": 4.906,
                "28 Jul": 4.458,
                "29 Jul": 4.649,
                "30 Jul": 3.402,
                "31 Jul": 4.155
            },
            "total": 15632.844865208732
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Aug",
            "midx": 7,
            "distributions": {
                "01 Aug": 2.837,
                "02 Aug": 3.577,
                "03 Aug": 2.285,
                "04 Aug": 3.194,
                "05 Aug": 3.05,
                "06 Aug": 2.594,
                "07 Aug": 1.886,
                "08 Aug": 1.904,
                "09 Aug": 2.408,
                "10 Aug": 1.648,
                "11 Aug": 3.492,
                "12 Aug": 4.496,
                "13 Aug": 4.482,
                "14 Aug": 4.363,
                "15 Aug": 2.205,
                "16 Aug": 2.543,
                "17 Aug": 2.535,
                "18 Aug": 3.815,
                "19 Aug": 3.859,
                "20 Aug": 3.582,
                "21 Aug": 3.898,
                "22 Aug": 2.964,
                "23 Aug": 3.935,
                "24 Aug": 3.925,
                "25 Aug": 3.864,
                "26 Aug": 3.713,
                "27 Aug": 3.251,
                "28 Aug": 3.306,
                "29 Aug": 2.993,
                "30 Aug": 3.682,
                "31 Aug": 3.712
            },
            "total": 20936.358628876325
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Sep",
            "midx": 8,
            "distributions": {
                "01 Sep": 4.518,
                "02 Sep": 4.767,
                "03 Sep": 3.762,
                "04 Sep": 2.956,
                "05 Sep": 2.934,
                "06 Sep": 2.404,
                "07 Sep": 3.091,
                "08 Sep": 3.046,
                "09 Sep": 2.633,
                "10 Sep": 2.343,
                "11 Sep": 2.235,
                "12 Sep": 2.022,
                "13 Sep": 3.124,
                "14 Sep": 3.046,
                "15 Sep": 2.252,
                "16 Sep": 4.085,
                "17 Sep": 2.472,
                "18 Sep": 2.663,
                "19 Sep": 3.458,
                "20 Sep": 3.505,
                "21 Sep": 4.467,
                "22 Sep": 4.41,
                "23 Sep": 3.683,
                "24 Sep": 3.355,
                "25 Sep": 3.856,
                "26 Sep": 3.816,
                "27 Sep": 3.825,
                "28 Sep": 3.776,
                "29 Sep": 3.727,
                "30 Sep": 3.767
            },
            "total": 12576.908801434205
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Oct",
            "midx": 9,
            "distributions": {
                "01 Oct": 3.155,
                "02 Oct": 2.562,
                "03 Oct": 3.131,
                "04 Oct": 4.047,
                "05 Oct": 3.852,
                "06 Oct": 3.589,
                "07 Oct": 3.596,
                "08 Oct": 3.93,
                "09 Oct": 0.708,
                "10 Oct": 0.951,
                "11 Oct": 3.967,
                "12 Oct": 0.794,
                "13 Oct": 0.57,
                "14 Oct": 3.806,
                "15 Oct": 3.905,
                "16 Oct": 4.346,
                "17 Oct": 4.279,
                "18 Oct": 4.287,
                "19 Oct": 4.039,
                "20 Oct": 4.133,
                "21 Oct": 4.11,
                "22 Oct": 3.452,
                "23 Oct": 1.213,
                "24 Oct": 3.153,
                "25 Oct": 3.805,
                "26 Oct": 3.749,
                "27 Oct": 2.015,
                "28 Oct": 3.648,
                "29 Oct": 3.97,
                "30 Oct": 3.135,
                "31 Oct": 4.101
            },
            "total": 12717.19006970823
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Nov",
            "midx": 10,
            "distributions": {
                "01 Nov": 5.74,
                "02 Nov": 4.204,
                "03 Nov": 3.473,
                "04 Nov": 1.253,
                "05 Nov": 4.975,
                "06 Nov": 4.665,
                "07 Nov": 5.072,
                "08 Nov": 4.884,
                "09 Nov": 4.338,
                "10 Nov": 4.744,
                "11 Nov": 3.277,
                "12 Nov": 4.57,
                "13 Nov": 3.783,
                "14 Nov": 3.715,
                "15 Nov": 1.362,
                "16 Nov": 1.532,
                "17 Nov": 3.43,
                "18 Nov": 3.917,
                "19 Nov": 3.39,
                "20 Nov": 4.38,
                "21 Nov": 2.061,
                "22 Nov": 0.814,
                "23 Nov": 0.451,
                "24 Nov": 1.531,
                "25 Nov": 4.563,
                "26 Nov": 1.028,
                "27 Nov": 2.686,
                "28 Nov": 4.04,
                "29 Nov": 3.928,
                "30 Nov": 2.194
            },
            "total": 8881.499941269461
        },
        {
            "range": "month",
            "year" : 2014,
            "month": "Dec",
            "midx": 11,
            "distributions": {
                "01 Dec": 6.294,
                "02 Dec": 6.411,
                "03 Dec": 5.603,
                "04 Dec": 1.36,
                "05 Dec": 1.278,
                "06 Dec": 0.937,
                "07 Dec": 1.594,
                "08 Dec": 6.19,
                "09 Dec": 2.593,
                "10 Dec": 0.971,
                "11 Dec": 2.047,
                "12 Dec": 4.432,
                "13 Dec": 1.769,
                "14 Dec": 3.252,
                "15 Dec": 1.04,
                "16 Dec": 2.434,
                "17 Dec": 3.517,
                "18 Dec": 0.074,
                "19 Dec": 0.471,
                "20 Dec": 2.013,
                "21 Dec": 1.439,
                "22 Dec": 0.478,
                "23 Dec": 2.509,
                "24 Dec": 1.397,
                "25 Dec": 6.719,
                "26 Dec": 3.28,
                "27 Dec": 2.271,
                "28 Dec": 6.603,
                "29 Dec": 7.467,
                "30 Dec": 6.819,
                "31 Dec": 6.736
            },
            "total": 4820.8584875047745
        }
    ];

    for(var i=0; i < distributionsTable.length; i++) {
        var distributions = distributionsTable[i];
        if (distributions.range === range) {
            if (range === "year" || range === "tenyear") {
                return distributions;
            }
            else if (range === "month" && distributions.midx === month) {
                return distributions;
            }
        }
    }

    return distributionsTable[0];
}

/**
 * Calculate start and end for annual case
 *
 * @param inputDate
 * @returns {{start: *, end: *}}
 */
function createCategories(drange, inputDate) {
    if (!inputDate) {
        inputDate = moment.utc();
    }

    var dimension;
    var end = inputDate; // = inputDate.endOf("month");
    var start; // = inputDate.clone().subtract(1, "year").startOf("year");

    switch (drange) {
        case "total":
            start = inputDate.clone().subtract(1, "year").startOf("year");
            end = inputDate.clone().endOf("year");
            dimension = "1month";
            break;
        case "year":
            start = inputDate.clone().startOf("year");
            end = inputDate.clone().endOf("year");
            dimension = "1month";
            break;
        case "month":
            start = inputDate.clone().startOf("month");
            end = inputDate.clone().endOf("month");
            dimension = "1day";
            break;
        default :
            start = inputDate.clone().startOf("month");
            end = inputDate.clone().endOf("month");
            dimension = "1day";
            break;
    }

    var categories = [];
    var KEY_FORMAT = (drange === "month") ? MONTH_FORMAT : YEAR_FORMAT;

    while (start <= end) {
        categories.push(start.clone().format(KEY_FORMAT));
        start.add(1, dimension.substr(1)+"s");
    }

    return categories;
}

/**
 * transform data according to protocol and send to the client
 * @param transformedData result of transformTempoiqResponse
 * @param format can be month or year
 * @param socket io socket
 */
function sendAnswerToClient(result, socket, cacheKey) {

    // create all categories in advanve
    /*
    _.range(0, 12).forEach(function(month) {
        var monthData = moment.utc().year(currentYearNum).month(month).
            format(YEAR_FORMAT);
        getCategory(monthData);
    });
    */

    var answer = new utils.serverAnswer(true, result);

    // put answer to the cache with ttl = 3600 (one hour)
    cache.setex(cacheKey, 3600, JSON.stringify(answer), function(err) {
        if (err) {
            log.warn(err);
        }
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy, answer);
        result = null;
        answer = null;
    });
}

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {string} dateRange
 * @returns {void}
 */
function transformTempoiqResponse(data, dimension, categories, tsTransformator) {
    var result = {};
    var actual = {};
    //var predicted = {};

    var actualArr = [];
    var predictedArr = [];

    var total = 0;
    var predictedTotal = 0;
    var distributions = {};
    var calcDistributions = false;

    var prevDistributions = {};
    var tblDistributions = {};
    var tblPrevDistributions = {};

    var rateY = 1;
    var rateM = 1;

    if (!tsTransformator) {
        var KEY_FORMAT = (dimension === "month") ? MONTH_FORMAT : YEAR_FORMAT;
        tsTransformator = function(ts) {
            return moment(ts).format(KEY_FORMAT);
        };
    }

    if (!data.dataPoints) {
        log.warn("transformTempoiqResponse: wrong object structure");
        return {};
    }

    _.forEach(data.dataPoints, function(datapoint) {

        var key = tsTransformator(datapoint.ts);

        actual[key] = actual[key] || 0 ;

        _.forOwn(datapoint.values, function(metrics, deviceId) {
            _.forOwn(metrics, function(value, metricName) {

                // need to divide by 1000 because client need kWh
                actual[key] += (value / 1000);
            });
        });

        total += actual[key];
    });

    if (calcDistributions) {
        _.forOwn(actual, function(value, key) {
            distributions[key] = mround(value / total * 100, 3);
        });
    } else {
        tblDistributions = getPredictedDistributions(dimension, null, moment.utc().month());
        distributions = tblDistributions.distributions;
    }

    if (dimension === "year" || dimension === "total") {
        tblPrevDistributions = getPredictedDistributions("tenyear", null, null);
        prevDistributions = tblPrevDistributions.distributions;
        rateY = prevDistributions[moment.utc().year()] / prevDistributions[moment.utc().subtract(1, "year").year()];
    } else if (dimension === "month") {
        tblPrevDistributions = getPredictedDistributions("year", null, null);
        prevDistributions = tblPrevDistributions.distributions;
        rateM = prevDistributions[moment.utc().format("MMM")] /
                prevDistributions[moment.utc().subtract(1, "month").format("MMM")];
    }


    for(var i=0; i<categories.length; i++) {
        var key = categories[i];
        var distributionKey = (dimension === "year" || dimension === "total") ? key.substr(0,3) : key;
        var predicted = 0;

        if (key in actual) {
            actualArr.push(actual[key]);

            if (dimension === "year" || dimension === "total") {
                predicted = tblDistributions["total"] *  distributions[distributionKey] / 100 * rateY;
            } else if (dimension === "month") {
                predicted = tblDistributions["total"] *  distributions[distributionKey] / 100 * rateM;
            }

            predictedArr.push(predicted);

            if (!predictedTotal && distributions[distributionKey]) {
                predictedTotal = actual[key] * 100 / distributions[distributionKey];
            }
        } else {
            actualArr.push(0);
            predictedArr.push(predictedTotal * distributions[distributionKey] / 100);
        }
    }

    /*
    console.log('distributions');
    console.log(distributions);
    console.log('Total', total);
    */

    result = {
        "categories": categories,
        "series": [
            {
                "name": "Actual Energy",
                "data": actualArr
            },
            {
                "name": "Predicted Energy",
                "data": predictedArr
            }
        ]
    };

    data = null;
    return result;
}

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {string} dateRange
 * @returns {void}
 */
function transformWeatherResponse(data, dimension, categories, tsTransformator) {

    log.debug("transformWeatherResponse");

    //var result = {};
    var transformed = {};

    if (!tsTransformator) {
        var KEY_FORMAT = (dimension === "month") ? MONTH_FORMAT : YEAR_FORMAT;
        tsTransformator = function(ts) {
            return moment(ts, "X").format(KEY_FORMAT);
        };
    }

    if (dimension !== "total" && dimension !== "year" && dimension !== "month") {
        log.warn("transformWeatherResponse: wrong date range input");
        return {};
    }

    _.forEach(data, function(item) {
        if (item) {
            var key = tsTransformator(item.time);

            if (key in transformed) {
                transformed[key].cloudydays += (item.icon === "cloudy" || item.icon === "partly-cloudy-day") ? 1 : 0;
                transformed[key].sunnydays +=  (item.icon === "clear-day") ? 1 : 0;
            } else {
                transformed[key] = {
                    "cloudydays" : (item.icon === "cloudy" || item.icon === "partly-cloudy-day") ? 1 : 0,
                    "sunnydays" :  (item.icon === "clear-day") ? 1 : 0
                };
            }
        }
    });
    data = null;

    log.debug("transformed weather: " + JSON.stringify(transformed));
    return transformed;
}

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {string} dateRange
 * @returns {void}
 */
function calculateData(socket, tempoIQdata, forecastData, drange, redisKey) {

    log.debug("calculateData");

    var categories = createCategories(drange, null);

    var transformedTempoData = transformTempoiqResponse(tempoIQdata, drange, categories, null);
    var transformedWeatherData = transformWeatherResponse(forecastData, drange, categories, null);

    var result = transformedTempoData;
    result["tooltips"] = transformedWeatherData;

    //console.log(JSON.stringify(result));
    sendAnswerToClient(result, socket, redisKey);
    tempoIQdata = null;
}

/**
 * Calculate start and end for annual case
 *
 * @param inputDate
 * @returns {{start: *, end: *}}
 */
 /*
function calculateDistributionsInterval(drange, month, inputDate) {
    //var currentYearNum = moment.utc().subtract(1, "year").year();

    if (!inputDate) {
        inputDate = moment.utc().subtract(1, "year");
        //inputDate = moment("2014-01-01 00:00:00");
    }

    var dimension;
    var end = inputDate; // = inputDate.endOf("month");
    var start; // = inputDate.clone().subtract(1, "year").startOf("year");

    switch (drange) {
        case "year":
            start = inputDate.clone().startOf("year");
            end = inputDate.clone().endOf("year");
            dimension = "1month";
            break;
        case "month":
            start = inputDate.clone().month(month).startOf("month");
            end = inputDate.clone().month(month).endOf("month"); //.date(-1);
            dimension = "1day";
            break;
        default :
            start = inputDate.clone().startOf("year"); //moment.utc().add(-1, "year");
            end = inputDate.clone().endOf("year");
            dimension = "1month";
            break;
    }

    return {dimension: dimension, start: start, end: end};
}
*/

/**
 * Calculate start and end for annual case
 *
 * @param inputDate
 * @returns {{start: *, end: *}}
 */
function calculateDataInterval(drange, inputDate) {
    if (!inputDate) {
        inputDate = moment.utc();
    }

    var dimension;
    var end = inputDate; // = inputDate.endOf("month");
    var start; // = inputDate.clone().subtract(1, "year").startOf("year");

    switch (drange) {
        case "total":
            start = inputDate.clone().subtract(1, "year").startOf("year");
            dimension = "1month";
            break;
        case "year":
            start = inputDate.clone().startOf("year");
            dimension = "1month";
            break;
        case "month":
            start = inputDate.clone().startOf("month");
            dimension = "1day";
            break;
        default :
            start = inputDate.clone().startOf("month");
            dimension = "1day";
            break;
    }

    return {dimension: dimension, start: start, end: end};
}

/**
 * Calculate start and end for annual case
 *
 * @param inputDate
 * @returns {{start: *, end: *}}
 */
function calculateWeatherDays(drange, inputDate) {

    if (!inputDate) {
        inputDate = moment.utc();
    }

    var dimension;

    var actualDate = inputDate;

    var end = actualDate; // = actualDate.endOf("month");
    var start; // = actualDate.clone().subtract(1, "year").startOf("year");

    switch (drange) {
        case "total":
            start = actualDate.clone().subtract(1, "year").startOf("year");
            end = actualDate.clone().endOf("year");
            dimension = "1month";
            break;
        case "year":
            start = actualDate.clone().subtract(1, "year").startOf("year");
            end = actualDate.clone();
            dimension = "1month";
            break;
        case "month":
            start = actualDate.clone().subtract(1, "month").startOf("month");
            end = actualDate.clone();
            dimension = "1day";
            break;
        default :
            start = actualDate.clone().subtract(1, "month").startOf("month");
            end = actualDate.clone();
            dimension = "1day";
            break;
    }

    log.debug("start: " + start.toISOString() + ", end: " + end.toISOString());
    return {start: start, end: end};
}


/**
 * Get weather data from tempoiq
 */
function getTempoiqWeatherData(location, start, end, zoneOffset, callback) {

    var weatherKey = "Forecast.Latitude:" + location.latitude;
    weatherKey += ".Longitude:" + location.longitude;
    log.debug("getTempoiqWeatherData: start: " + start + ", end: " + end +
        ", weatherKey: " + weatherKey + ", offset: " + zoneOffset);

    var selection = {
        "devices": {
            "key": weatherKey
        },
        "sensors": {
            "or": [
                { "key": "Icon" },
                { "key": "CloudCover" }
            ]
        }
    };

    // we need raw data
    var pipeline = null;

    tempoiqWrapper.loadData(
        start,
        end,
        selection,
        pipeline, null,
        function (err, data) {
            //log.debug("read tempoiq data end");

            if (err) {
                return callback(err);
            }

            // just transformation ( { time: *, icon: * }
            // we expect data with hour time
            var lst = data.dataPoints || [];
            var result = lst.map(function(item) {
                var ts = moment(item.ts);
                var icon = item.values[weatherKey].Icon;
                calcUtils.convertTimeStampToUTC(ts, zoneOffset);
                return {
                    time: ts,
                    unix: ts.unix(),
                    icon: icon
                };
            });

            // this block is only for debug
            //var prevSunrise = 0;
            //var prevSunset = 0;
            //result.forEach(function(item) {
            //    var times = suncalc.getTimes(moment(item.time),
            //        location.latitude,
            //        location.longitude);
            //    var sunrise = moment(times.sunrise);
            //    var sunset = moment(times.sunset);
            //    if (sunrise.unix() !== prevSunrise && sunset.unix() !== prevSunset) {
            //        log.debug("sunrise: " + sunrise.toISOString() + "(" + sunrise.unix() + ")" +
            //            " sunset: " + sunset.toISOString() + "(" + sunset.unix() + ")");
            //        prevSunrise = sunrise.unix();
            //        prevSunset = sunset.unix();
            //    }
            //
            //    item.name = forecastConverter.getForecastTextByNumber(item.icon);
            //    if (item.unix >= sunrise.unix() && item.unix <= sunset.unix()) {
            //        item.cond = true;
            //    } else {
            //        item.conf = false;
            //    }
            //    item.format = item.time.utcOffset(zoneOffset).format("YYYY-MM-DD");
            //
            //    log.debug(JSON.stringify(item));
            //});

            // now we need to aggregate icons in one day
            // but we need only day time (from sunrise to sunset)
            var dayIcons = {};
            var dayData = {};
            _.forEach(result, function(record) {

                var times = suncalc.getTimes(moment(record.time),
                    location.latitude,
                    location.longitude);
                var sunrise = moment(times.sunrise).unix();
                var sunset = moment(times.sunset).unix();

                // skip night
                if (record.unix < sunrise || record.unix > sunset) {
                    return;
                }

                var key = record.time.utcOffset(zoneOffset).format("YYYY-MM-DD");
                dayData[key] = dayData[key] || { N: 0, sum: 0.0, icons: [] };
                dayData[key].N++;
                dayData[key].sum += parseFloat(record.CloudCover);
                dayData[key].icons.push(record.icon);

                dayIcons[key] = dayIcons[key] || [];
                dayIcons[key].push(record.icon);
            });

            //log.debug("dayIcons = " + JSON.stringify(dayIcons));

            // now we have several values (by hours) of icons for each day
            // now we need to choose the most frequent icon
            var calculateMoreFrequent = function(arr) {
                var freqCount = {};
                arr.forEach(function(item) {
                    freqCount[item] = freqCount[item] || 0;
                    freqCount[item] += 1;
                });
                return _.chain(freqCount).
                    map(function(value, key) {
                        return { key: key, count: value };
                    }).
                    sortBy("count").
                    last().
                    value().
                    key;
            };

            var finalResult = _.map(dayData, function(value, key) {
                return {
                    time: moment(key).format("X"),
                    icon: forecastConverter.getForecastTextByNumber(
                        calculateMoreFrequent(value.icons)),
                    cloudCover: value.sum / value.N
                };
            });

            //log.debug("finalResult = " + JSON.stringify(finalResult));
            callback(null, finalResult);
        }
    );
}


/**
 * Load data from tempoiq & forecast.io
 *
 * @param clientObject the client object from websocket
 */
function loadData(clientObject, finalCallback) {

    log.debug("actual-predicted-energy");
    var cacheEnabled = true;

    var socket = clientObject.socket;
    var dataObject = clientObject.actualPredictedEnergy;

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;
    var zoneOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);
    log.debug("zoneOffset = " + zoneOffset);

    var selectionHash = crypto.createHash("md5")
        .update(JSON.stringify(selection))
        .digest("hex");

    // check answer in the cache
    var redisKey = consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy + "." +
        dataObject.dateRange + "." + selectionHash;
    log.debug("redis key: " + redisKey);

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy,
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
                        setTimeout(function() {
                              //log.debug("***Actual REDIS EMIT SUCCESS------------: ", result);
                              socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy, result);
                          }, 1200);
                        //socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy, result);
                        return next();
                    } catch (e) {
                        // nothing here, just corrupted cache
                    }
                }
                next();
            });
        },
        function (next) {// load data for  year
            async.parallel([
                function(callback){
                    var interval = calculateDataInterval(dataObject.dateRange, null);
                    //var interval = calculateDistributionsInterval("year", 0, null);
                    var pipeline = {
                        "functions":[{
                            "name": "rollup",
                            "arguments": ["mean", "1hour"] //kwh data
                        }, {
                            "name": "rollup",
                            "arguments": ["sum", interval.dimension] //set user dimension
                        }]
                    };

                    profiling.start("Tempoiq");
                    tempoiqWrapper.loadData(
                        interval.start,
                        interval.end,
                        selection,
                        pipeline, null,
                        function (err, data) {
                            profiling.endTime("Tempoiq");
                            if (err) {
                                log.error(err);
                                return socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy,
                                    new utils.serverAnswer(false, err));
                            }

                            // continue
                            callback(null, data);
                        }
                    );
                },
                function(callback) {

                    var interval = calculateWeatherDays(dataObject.dateRange, null);
                    getTempoiqWeatherData(clientObject.geo, interval.start, interval.end, zoneOffset,
                        function(err, results) {
                            if (err) {
                                log.error(err);
                                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy,
                                    new utils.serverAnswer(false, err));
                                return callback(err);
                            }
                            return callback(null, results);
                    });

                    // commented by Georgiy Pankov
                    // 05.04.2015 (Now we use tempoiq weather data instead of forecast)
                    //var days = calculateWeatherDays(dataObject.dateRange,null);
                    ////var forecastData = [];
                    //async.map(days, function(day, mapnext) {
                    //    log.debug("Weather Days: " + day.toDate());
                    //    forecastHelper.getCachedDailyHistoryData(clientObject.geo, day, null, mapnext);
                    //}, function (err, results) {
                    //    if (err) {
                    //        log.error(err);
                    //        return socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.ActualPredictedEnergy,
                    //            new utils.serverAnswer(false, err));
                    //    }
                    //
                    //    // continue
                    //    callback(null, results);
                    //});
                }
            ],
            // optional callback
            function(err, results){
                // the results array will equal ['one','two'] even though
                // the second function had a shorter timeout.
                next(err, results);
            });
        }
    ],
    function(err, data) {
        if (err) {
            return false;
        }
        else {
            var tempoIQData = data[0];
            var forecastData = data[1];
            calculateData(socket, tempoIQData, forecastData, dataObject.dateRange, redisKey);
        }

        if(finalCallback) {
            finalCallback(err);
        }
    });
}

/**
 * Exported Functions
 */
exports.loadData = loadData;
exports.calculateData = calculateData;
exports.transformTempoiqResponse = transformTempoiqResponse;
exports.transformWeatherResponse = transformWeatherResponse;
