"use strict";

var tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    calcUtils = require("./calculator-utils"),
    async = require("async"),
    cache = require("../../../libs/cache");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @returns {number}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility) {

    var totalkwh =0;
    var i=0;
    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);

    for(i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = moment.utc(tempoIQData.dataPoints[i].ts);
        calcUtils.convertTimeStampToUTC(ts, deviceOffset);
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var tableItem = {
            date: ts.format("MMMM DD, YYYY"),
            percent: 0,
            sources: {},
            totalPerPeriod: 0
        };

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityName;//find facility by imberter
            var scope = nodeList[thisInv].scopeName;

            //if one facility selected, use scopes as labels
            var segmentName = isOneFacility? scope : facility;

            var metric = Object.keys(values[thisInv])[0];

            var kwh = values[thisInv][metric] / 1000;
            var thisSavings = (kwh * nodeList[thisInv].rate);
            totalkwh += kwh;

            if(!tableItem.sources[segmentName]) {
                tableItem.sources[segmentName] = {
                    savings: 0,
                    kwh: 0
                };
            }

            tableItem.sources[segmentName].kwh +=  kwh;
            tableItem.sources[segmentName].savings +=  thisSavings;
            tableItem.totalPerPeriod += kwh;
        }

        storage.table.push(tableItem);
    }

    if(totalkwh !== 0) {
        for (i = 0; i < storage.table.length; i++) {
            storage.table[i].percent = (storage.table[i].totalPerPeriod / totalkwh) * 100;
        }
    }
}

function loadData(clientObject, finalCallback) {
    var socket = clientObject.socket;

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;
    var isOneFacility = clientObject.selectedFacilities.length === 1;

    var startDate = calcUtils.setDateToMidnight(moment.utc().add(-11, "month")),
        endDate = moment.utc();

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Savings,
            new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
        return ;
    }

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1month"] //set user dimension
        }]
    };

    var cacheKeyObj = {
        selection: selection,
        selectedFacilitiesId: clientObject.selectedFacilities,
        selectedScopesId: clientObject.selectedScopes
    };

    //get hash bases od element parameters
    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.Table + ":" + calcUtils.getHashByElementParameters(cacheKeyObj);

    async.waterfall([
        function(cb) {

            var defaultCachedData = {
                dataPoints: []
            };

            calcUtils.getCachedElementData(socket, elementHash, defaultCachedData, cb);
        },
        function(cacheResults, cb) {
            //delete last datapoint from cached data
            var cachedEndDateCurrent = calcUtils.getCachedEndDate(cacheResults);
            cb(null, cacheResults, cachedEndDateCurrent);
        },
        function(cacheResult, cachedEndDateCurrent, cb) {
            //use last datapoint as startdate to tempoiq requests
            if(cachedEndDateCurrent) {
                startDate = cachedEndDateCurrent;
            }

            tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function(err, data) {
                if(err) {
                    cb(err);
                } else {
                    //combine cached data and tempoiq data
                    cacheResult.dataPoints.push.apply(cacheResult.dataPoints, data.dataPoints);
                    data = null;
                    selection = null;
                    pipeline = null;
                    cb(null, cacheResult);
                }
            });
        },
        function(tempoiqData, cb) {
            //store cached data in redis
            cache.setex(elementHash, consts.ASSURF_TEMPOIQ_CACHE_TTL, JSON.stringify(tempoiqData),
                function (err, result) {
                    cb(err, tempoiqData);
                });
        },
        function(tempoiqData, cb) {
            //calculate data based on tempoiq response
            var storage = {
                table: []
            };

            processTempoIQResponse(tempoiqData, nodeList, storage, isOneFacility);
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
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Table, finalResult);
        storage = null;
        finalResult = null;

        if(finalCallback) {
            finalCallback(finalErr);
        }
    });

}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;