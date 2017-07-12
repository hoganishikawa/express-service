"use strict";

var tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    async = require("async"),
    calcUtils = require("./calculator-utils"),
    cache = require("../../../libs/cache");


function processTempoIQResponse(tempoIQData, storage, chartType, nodeList, isOneFacility, calculateProduction) {
    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = moment.utc(tempoIQData.dataPoints[i].ts);
        calcUtils.convertTimeStampToUTC(ts, deviceOffset);
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodKw = 0;

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityName;//find facility by imberter
            var scope = nodeList[thisInv].scopeName;
            var segmentName = isOneFacility? scope : facility;
            var metric = Object.keys(values[thisInv])[0];

            var val = values[thisInv][metric] / 1000;

            periodKw += val;

            if(calculateProduction) {
                storage.totalProduction += val;
                //total production by source data
                if (!storage.totalProductionBySources[segmentName]) {
                    storage.totalProductionBySources[segmentName] = 0;
                }
                storage.totalProductionBySources[segmentName] += val;
            }
        }

        storage[chartType].categories.push(ts);
        storage[chartType].series[0].data.push(periodKw);
    }
}

function loadData(clientObject, finalCallback) {
    var socket = clientObject.socket;
    //var dataObject = clientObject.currentPower;

    var startDateEnergy = moment.utc().startOf("day"),
        startDatePower = moment.utc().startOf("day");

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var isOneFacility = clientObject.selectedFacilities.length === 1;

    var pipelineEnergy = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }]
    };

    var pipelinePower = {
        "functions":[{
            "name": "rollup",
            "arguments": ["max", "5min"] //kw data
        }]
    };

    //get hash bases od element parameters
    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.EnergyTodayKPIDrilldown + ":" +
        calcUtils.getHashByElementParameters(selection);

    async.waterfall([
        function(cb) {

            var defaultCachedData = [{
                dataPoints: []
            }, {
                dataPoints: []
            }];

            calcUtils.getCachedElementData(socket, elementHash, defaultCachedData, cb);
        },
        function(cacheResults, cb) {
            //delete last datapoint from cached data
            var cachedEndDateEnergy = calcUtils.getCachedEndDate(cacheResults[0]);
            var cachedEndDatePower = calcUtils.getCachedEndDate(cacheResults[1]);

            cb(null, cacheResults, cachedEndDateEnergy, cachedEndDatePower);
        },
        function(cacheResults, cachedEndDateEnergy, cachedEndDatePower, callback) {
            //use last datapoint as startdate to tempoiq requests
            if(cachedEndDateEnergy) {
                startDateEnergy = cachedEndDateEnergy;
            }

            if(cachedEndDatePower) {
                startDatePower = cachedEndDatePower;
            }

            //make requests to tempoiq
            async.parallel([
                function(cb) {
                    //load energy
                    tempoiqWrapper.loadData(startDateEnergy, moment.utc(), selection, pipelineEnergy, null, cb);
                },
                function(cb) {
                    //load power value
                    tempoiqWrapper.loadData(startDatePower, moment.utc(), selection, pipelinePower, null,cb);
                }
            ], function(err, tempoIQResults) {
                if(err) {
                    callback(err);
                } else {
                    //combine loaded tempoiq results and cached data
                    cacheResults[0].dataPoints.push.apply(cacheResults[0].dataPoints, tempoIQResults[0].dataPoints);
                    cacheResults[1].dataPoints.push.apply(cacheResults[1].dataPoints, tempoIQResults[1].dataPoints);
                    tempoIQResults = null;
                    callback(null, cacheResults);
                }
            });
        },
        function(tempoiqData, cb) {
            //store cached data in redis
            cache.setex(elementHash, consts.ASSURF_TEMPOIQ_CACHE_TTL, JSON.stringify(tempoiqData),
                function(err, result) {
                    cb(err, tempoiqData);
                });
        },
        function(tempoiqData, cb) {
            //calculate data based on tempoiq response
            var storage = {
                totalProduction: 0,
                totalProductionBySources: {},
                energy : {
                    categories: [],
                    series: [{
                        type: "column",
                        name: "Today Energy",
                        data: []
                    }]
                },
                power : {
                    categories: [],
                    series: [{
                        type: "spline",
                        name: "Current Power",
                        data: []
                    }]
                }
            };

            processTempoIQResponse(tempoiqData[0], storage, "energy", nodeList, isOneFacility, true);
            processTempoIQResponse(tempoiqData[1], storage, "power", nodeList, isOneFacility, false);
            tempoiqData = null;
            cb(null, storage);
        }
    ], function(finalErr, storage) {
        var finalResult = null;
        if(finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
        } else {
            finalResult = new utils.serverAnswer(true, storage);
        }
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.EnergyTodayKPIDrilldown, finalResult);
        storage = null;
        finalResult = null;

        if(finalCallback) {
            finalCallback(finalErr);
        }
    });
}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;
