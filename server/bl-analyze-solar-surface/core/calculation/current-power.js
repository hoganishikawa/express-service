"use strict";
// Code is mainly borrowed from real-time-power.js

// 92346690

var _ = require("lodash");

var utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    calcUtils = require("./calculator-utils"),
    cache = require("../../../libs/cache"),
    async = require("async");

var profiling = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart);

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @returns {object} data for chart
 */
function processTempoIQResponse(tempoIQData, nodeList, isOneFacility) {

    var format = "h:mma, MMMM DD, YYYY";
    var len = tempoIQData.dataPoints.length;
    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);
    var startDate = moment.utc().subtract(24, "hours").startOf("hour");

    var tmp = [];

    var storage = {
        totalGeneration: 0,
        totalProductionBySources: {},
        energyChart: {
            categories: [],
            series: [{
                name: "Total energy",
                data: []
            }]
        },
        powerChart: {
            categories: [],
            series: [{
                name: "Total power",
                data: []
            }]
        }
    };


    for(var i = 0; i < tempoIQData.dataPoints.length; i++) {
        // Skip point if it was too early ...
        var ts = moment.utc(tempoIQData.dataPoints[i].ts);
        calcUtils.convertTimeStampToUTC(ts, deviceOffset);
        if (ts < startDate) {
            continue;
        }
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodKw = 0;

        var iterationSegmentsValues = {}; //stores facilities (scopes) values for current iteration

        for (var j = 0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityName;//find facility by imberter
            var scope = nodeList[thisInv].scopeName;

            //if one facility selected, use scopes as labels
            var segmentName = isOneFacility ? scope : facility;

            var metric = Object.keys(values[thisInv])[0];

            var kwh = values[thisInv][metric] / 1000 / 12; // 12 - because we're working with 5 minutes intervals

            storage.totalGeneration += kwh;

            //total production by source data
            if (!storage.totalProductionBySources[segmentName]) {
                storage.totalProductionBySources[segmentName] = {
                    value: 0,
                    trend: null
                };
            }
            storage.totalProductionBySources[segmentName].value += kwh;

            if(!iterationSegmentsValues[segmentName]) {
                iterationSegmentsValues[segmentName] = 0;
            }
            iterationSegmentsValues[segmentName] += kwh;


            if(i > 1 && i === (len -1) && !storage.totalProductionBySources[segmentName].trend) {
                //this is last datapoint and we have previous value
                if(tempoIQData.dataPoints[i-1].values[thisInv]) {
                    var prevValue = tempoIQData.dataPoints[i - 1].values[thisInv][metric] / 1000 / 12;

                    if (kwh > prevValue) {
                        storage.totalProductionBySources[segmentName].trend = "up";
                    } else {
                        storage.totalProductionBySources[segmentName].trend = "down";
                    }
                }
            }

            periodKw += kwh;
        }

        storage.powerChart.categories.push(moment(ts).format(format));
        storage.powerChart.series[0].data.push(periodKw * 12); // back again to kW

        tmp.push({
            ts: ts,
            v: periodKw
        });
    }


    var byHour = _.groupBy(tmp, function(point){
        return point.ts.format("h:00a, MMMM DD, YYYY");
    });

    _.forOwn(byHour, function(value, key) {
        var N = 0;
        var sum = _.reduce(value, function(sum, el) {
            N++;
            return sum + el.v;
        }, 0.0);
        storage.energyChart.categories.push(key);
        storage.energyChart.series[0].data.push(sum / N);
    });

    return storage;
}


function loadData(clientObject) {
    var socket = clientObject.socket;

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);
    var startDate = moment.utc().subtract(24, "hours").startOf("hour"),
        endDate = moment.utc();

    startDate.add(deviceOffset, "minutes");
    endDate.add(deviceOffset, "minutes");

    var isOneFacility = clientObject.selectedFacilities.length === 1;

    var pipeline =  {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "5min"] // power data
        }]
    };

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart,
            new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
        return ;
    }

    var cacheKeyObj = {
        selection: selection,
        startDate: startDate,
        selectedFacilitiesId: clientObject.selectedFacilities,
        selectedScopesId: clientObject.selectedScopes
    };

    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart + ":" +
        calcUtils.getHashByElementParameters(cacheKeyObj);

    async.waterfall([
        function(cb) {
            var defaultCachedData = {
                dataPoints: []
            };

            calcUtils.getCachedElementData(socket, elementHash, defaultCachedData, cb);
        },
        function(cacheResult, cb) {
            //delete last datapoint from cached data
            var cachedEndDate = calcUtils.getCachedEndDate(cacheResult);
            cb(null, cacheResult, cachedEndDate);
        },
        function(cacheResult, cachedEndDate, cb) {
            //use last datapoint as startdate to tempoiq requests
            if(cachedEndDate) {
                startDate = cachedEndDate;
            }

            profiling.start("Tempoiq");
            tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function(err, data) {
                profiling.endTime("Tempoiq");
                if(err) {
                    cb(err);
                } else {
                    //combine cached data and tempoiq data
                    cacheResult.dataPoints.push.apply(cacheResult.dataPoints, data.dataPoints);
                    data = null;
                    pipeline = null;

                    cb(null, cacheResult);
                }
            });
        },
        function(newCacheData, cb) {
            //store cached data in redis
            cache.setex(elementHash, consts.ASSURF_TEMPOIQ_CACHE_TTL, JSON.stringify(newCacheData),
                function(err, result) {
                cb(err, newCacheData);
            });
        },
        function(newCacheData, cb) {
            var storage = processTempoIQResponse(newCacheData, nodeList, isOneFacility);
            newCacheData = null;
            cb(null, storage);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if(finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
        } else {
            finalResult = new utils.serverAnswer(true, storage);
        }
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CurrentPowerChart, finalResult);
        storage = null;
        finalResult = null;
    });

}

exports.loadData = loadData;
