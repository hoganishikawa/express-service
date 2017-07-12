"use strict";

var tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    calcUtils = require("./calculator-utils"),
    async = require("async"),
    cache = require("../../../libs/cache"),
    LAST_REPORTED_VALUE = "lastReportedValue",
    TOTAL_ENERGY_GENERATED = "totalEnergyGenerated",
    _ = require("lodash");

    var profiling = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.Sources);

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {string} timeKey
 * @param {string} valueKey
 * @returns {number}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, timeKey, valueKey) {

    var totalkwh =0;
    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);
    var todayMidnight = calcUtils.setDateToMidnight(moment.utc());
    var len = tempoIQData.dataPoints.length;

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = moment.utc(tempoIQData.dataPoints[i].ts);
        calcUtils.convertTimeStampToUTC(ts, deviceOffset);
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityName;//find facility by inberter
            var scope = nodeList[thisInv].scopeName;
            var metric = Object.keys(values[thisInv])[0];

            var kwh = (values[thisInv][metric] / 1000);

            //add values to result object
            if(timeKey) {
                storage[facility][timeKey] = ts;
                storage[facility].scopes[scope][timeKey] = ts;
            }
            storage[facility][valueKey] += kwh;
            storage[facility].scopes[scope][valueKey] += kwh;

            if(valueKey === LAST_REPORTED_VALUE) {
                if(ts.isAfter(todayMidnight)) {
                    //we should calculate percentage and currentValue if last value in current day
                    storage[facility].currentValue += kwh;
                    storage[facility].scopes[scope].currentValue += kwh;
                    totalkwh += kwh;
                } else {
                    storage[facility].currentValue = 0;
                    storage[facility].scopes[scope].currentValue = 0;
                }
            }

            if(valueKey === TOTAL_ENERGY_GENERATED && i > 1 && i === (len -1) && !storage[facility].trend) {
                //this is last datapoint and we have previous value
                if(tempoIQData.dataPoints[i-1].values[thisInv]) {
                    var prevValue = tempoIQData.dataPoints[i - 1].values[thisInv][metric] / 1000;

                    if (kwh > prevValue) {
                        storage[facility].trend = "up";
                        storage[facility].scopes[scope].trend = "up";
                    } else {
                        storage[facility].trend = "down";
                        storage[facility].scopes[scope].trend = "up";
                    }
                }
            }
        }
    }

    return totalkwh;
}

function loadData(clientObject, totalMonthlyData) {
    var socket = clientObject.socket;

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;
    var facilities = clientObject.facilitiesList;

    var rewriteTotalCache = totalMonthlyData !== null && !_.isUndefined(totalMonthlyData);

    var pipelineMax = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["max", "1month"] //by month
        }]
    };

    var pipelineMin = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["min", "1month"] //by month
        }]
    };

    var pipelinekWh = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1month"] //by month
        }]
    };

    var maxStartDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "month"));
    var minStartDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "month"));
    var totalStartDate = calcUtils.setDateToMidnight(moment.utc().add(-10, "year"));


    //var cacheBaseKey = calcUtils.getSocketCacheKey(socket);

    //get hash bases od element parameters
    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.Sources + ":" +
        calcUtils.getHashByElementParameters(selection);

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Sources, 
            new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
        return ;
    }

    async.waterfall([
        function(cb) {

            var defaultCachedData = [{
                dataPoints: []
            }, {
                dataPoints: []
            }, {
                dataPoints: []
            }];

            calcUtils.getCachedElementData(socket, elementHash, defaultCachedData, cb);
        },
        function(cacheResults, cb) {
            //delete last datapoint from cached data
            var cachedEndDateMax = calcUtils.getCachedEndDate(cacheResults[0]);
            var cachedEndDateMin = calcUtils.getCachedEndDate(cacheResults[1]);
            var cachedEndDateTotal = calcUtils.getCachedEndDate(cacheResults[2]);

            cb(null, cacheResults, cachedEndDateMax, cachedEndDateMin, cachedEndDateTotal);
        },
        function(cacheResults, cachedEndDateMax, cachedEndDateMin, cachedEndDateTotal, callback) {
            //use last datapoint as startdate to tempoiq requests
            if(cachedEndDateMax) {
                maxStartDate = cachedEndDateMax;
            }

            if(cachedEndDateMin) {
                minStartDate = cachedEndDateMin;
            }

            if(cachedEndDateTotal) {
                totalStartDate = cachedEndDateTotal;
            }

            profiling.start("Tempoiq");

            //make requests to tempoiq
            async.parallel([
                function(cb) {
                    tempoiqWrapper.loadData(maxStartDate, moment.utc(), selection, pipelineMax, null, cb);
                },
                function(cb) {
                    tempoiqWrapper.loadData(minStartDate, moment.utc(), selection, pipelineMin, null, cb);
                },
                function(cb) {
                    if(totalMonthlyData) {
                        cb(null, totalMonthlyData);
                    } else {
                        tempoiqWrapper.loadData(totalStartDate, moment.utc(), selection, pipelinekWh, null, cb);
                    }
                },
                function(cb) {
                    tempoiqWrapper.getFirstValue(selection, cb);
                },
                function(cb) {
                    tempoiqWrapper.getLastValue(selection, cb);
                }
            ], function(err, tempoIQResults) {
                profiling.endTime("Tempoiq");
                if(err) {
                    callback(err);
                } else {
                    //combine loaded tempoiq results and cached data

                    //max value
                    cacheResults[0].dataPoints.push.apply(cacheResults[0].dataPoints, tempoIQResults[0].dataPoints);

                    //min value
                    cacheResults[1].dataPoints.push.apply(cacheResults[1].dataPoints, tempoIQResults[1].dataPoints);

                    //total values
                    if(rewriteTotalCache) {
                        cacheResults[2].dataPoints = [];
                    }
                    cacheResults[2].dataPoints.push.apply(cacheResults[2].dataPoints, tempoIQResults[2].dataPoints);

                    tempoIQResults[0] = null;
                    tempoIQResults[1] = null;
                    tempoIQResults[2] = null;
                    callback(null, cacheResults, tempoIQResults[3], tempoIQResults[4]);
                }
            });
        },
        function(cachedTempoiqData, tempoiqFirstValues,  tempoiqLastValues, cb) {
            //store cached data in redis
            cache.setex(elementHash, consts.ASSURF_TEMPOIQ_CACHE_TTL, JSON.stringify(cachedTempoiqData),
                function(err, result) {
                cb(err, cachedTempoiqData, tempoiqFirstValues,  tempoiqLastValues);
            });
        },
        function(cachedTempoiqData, tempoiqFirstValues,  tempoiqLastValues, cb) {
            //calculate data based on tempoiq response
            processTempoIQResponse(tempoiqFirstValues, nodeList, facilities, "firstReportedTime", "firstReportedValue");
            var total = processTempoIQResponse(tempoiqLastValues, nodeList,
                facilities, "lastReportedTime", LAST_REPORTED_VALUE);
            processTempoIQResponse(cachedTempoiqData[0], nodeList, facilities, null, "maxValue");
            processTempoIQResponse(cachedTempoiqData[1], nodeList, facilities, null, "minValue");
            processTempoIQResponse(cachedTempoiqData[2], nodeList, facilities, null, TOTAL_ENERGY_GENERATED);

            for(var facilityName in facilities) {
                if (facilities[facilityName]) {
                    facilities[facilityName].percent = (facilities[facilityName].currentValue / total) * 100;

                    for(var scopeName in facilities[facilityName].scopes) {
                        if(facilities[facilityName].scopes[scopeName]) {

                            if(facilities[facilityName].currentValue) {
                                facilities[facilityName].scopes[scopeName].percent =
                                    (facilities[facilityName].scopes[scopeName].currentValue /
                                    facilities[facilityName].currentValue) * 100;
                            }

                            if(facilities[facilityName].firstReportedTime >
                                facilities[facilityName].scopes[scopeName].firstReportedTime) {

                                facilities[facilityName].firstReportedTime =
                                    facilities[facilityName].scopes[scopeName].firstReportedTime;
                            }

                            if(facilities[facilityName].lastReportedTime <
                                facilities[facilityName].scopes[scopeName].lastReportedTime) {

                                facilities[facilityName].lastReportedTime =
                                    facilities[facilityName].scopes[scopeName].lastReportedTime;
                            }
                        }
                    }
                }
            }
            cachedTempoiqData = null;
            tempoiqFirstValues = null;
            tempoiqLastValues = null;
            cb(null, facilities);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if(finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
        } else {
            finalResult = new utils.serverAnswer(true, storage);
        }
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Sources, finalResult);
        storage = null;
        finalResult = null;
    });

}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;