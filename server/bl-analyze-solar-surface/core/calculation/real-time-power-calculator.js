"use strict";

var utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    calcUtils = require("./calculator-utils"),
    cache = require("../../../libs/cache"),
    async = require("async");

var profiling = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower);

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @returns {void}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility, format) {

    var len = tempoIQData.dataPoints.length;
    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);


    var prevPeriodkW = 0;

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = moment.utc(tempoIQData.dataPoints[i].ts);
        calcUtils.convertTimeStampToUTC(ts, deviceOffset);
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodKw = 0;

        var iterationSegmentsValues = {};//stores facilities (scopes) values for current iteration

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityName;//find facility by imberter
            var scope = nodeList[thisInv].scopeName;

            //if one facility selected, use scopes as labels
            var segmentName = isOneFacility? scope : facility;

            var metric = Object.keys(values[thisInv])[0];

            var kw = values[thisInv][metric] / 1000;

            storage.totalGeneration.value += kw;

            //total production by source data
            if (!storage.totalProductionBySources[segmentName]) {
                storage.totalProductionBySources[segmentName] = {
                    value: 0,
                    trend: null
                };
            }
            storage.totalProductionBySources[segmentName].value += kw;

            if(!iterationSegmentsValues[segmentName]) {
                iterationSegmentsValues[segmentName] = 0;
            }
            iterationSegmentsValues[segmentName] += kw;


            if(i > 1 && i === (len -1) && !storage.totalProductionBySources[segmentName].trend) {
                //this is last datapoint and we have previous value
                if(tempoIQData.dataPoints[i-1].values[thisInv]) {
                    var prevValue = tempoIQData.dataPoints[i - 1].values[thisInv][metric] / 1000;

                    if (kw > prevValue) {
                        storage.totalProductionBySources[segmentName].trend = "up";
                    } else {
                        storage.totalProductionBySources[segmentName].trend = "down";
                    }
                }
            }

            periodKw += kw;
        }

        storage.mainChart.categories.push(moment(ts).format(format));
        storage.mainChart.series[0].data.push(periodKw);

        //add data to sources series (facility, scope)
        for(var k=1; k < storage.mainChart.series.length; k++) {
            var seriesName = storage.mainChart.series[k].name;

            if(iterationSegmentsValues[seriesName]) {
                //we have data for that series
                storage.mainChart.series[k].data.push(iterationSegmentsValues[seriesName]);
            } else {
                //value not exists, use zero
                storage.mainChart.series[k].data.push(0);
            }
        }

        if(i > 1 && i === (len -1)) {
            //this is last point
            if(periodKw > prevPeriodkW) {
                storage.totalGeneration.trend = "up";
            } else {
                storage.totalGeneration.trend = "down";
            }
        }

        prevPeriodkW = periodKw;
    }
}


function loadData(clientObject, dateRange, selectedDay, isPreloading, finalCallback) {
    var socket = clientObject.socket;

    var startDate = null,
        endDate = moment.utc(),
        dimension = null,
        format = "h:mma, MMMM DD, YYYY";

    if(!selectedDay) {
        switch (dateRange) {
            case "today":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "day"));
                dimension = "1min";
                break;
            case "month":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "month"));
                dimension = "1day";
                break;
            case "week":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "week"));
                dimension = "1hour";
                break;
            default :
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "month"));
                dimension = "1day";
                break;
        }
    } else {
        dimension = "1min";
        startDate = moment.utc(selectedDay).startOf("day");

        if(!startDate.isValid()) {
            startDate = moment.utc().add(-1, "day");
        }
        endDate = startDate.clone().endOf("day");
        format = "h:mma, MMMM DD, YYYY";
    }

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var isOneFacility = clientObject.selectedFacilities.length === 1;

    var pipeline =  {
        "functions":[{
            "name": "rollup",
            "arguments": ["max", dimension]
        }]
    };

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower,
            new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
        return ;
    }

    /*tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function(err, data) {

        var finalResult = null;
        if(err) {
            finalResult = new utils.serverAnswer(false, err);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower, finalResult);
        } else {
            var storage = {
                totalGeneration: {
                    value: 0,
                    trend: null
                },
                totalProductionBySources: {},
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Generation",
                        data: []
                    }]
                }
            };

            calcUtils.addHighchartsSeriesPerSource(nodeList, isOneFacility, storage.mainChart);

            processTempoIQResponse(data, nodeList, storage, isOneFacility);
            finalResult = new utils.serverAnswer(true, storage);

            //var str = JSON.stringify(finalResult);

            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower, finalResult);
        }
    });*/

    var cacheKeyObj = {
        selection: selection,
        dateRange: dateRange,
        selectedDay: selectedDay,
        selectedFacilitiesId: clientObject.selectedFacilities,
        selectedScopesId: clientObject.selectedScopes
    };

    //var cacheBaseKey = calcUtils.getSocketCacheKey(socket);

    //get hash bases od element parameters
    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower + ":" +
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
        function(tempoiqData, cb) {
            //store cached data in redis
            cache.setex(elementHash, consts.ASSURF_TEMPOIQ_CACHE_TTL, JSON.stringify(tempoiqData),
                function(err, result) {
                cb(err, tempoiqData);
            });
        },
        function(tempoiqData, cb) {
            var storage = {
                totalGeneration: {
                    value: 0,
                    trend: null
                },
                totalProductionBySources: {},
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Generation",
                        data: []
                    }]
                },
                dateRange: dateRange
            };

            calcUtils.addHighchartsSeriesPerSource(nodeList, isOneFacility, storage.mainChart);

            processTempoIQResponse(tempoiqData, nodeList, storage, isOneFacility, format);
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
        if(!isPreloading) {
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.RealTimePower, finalResult);
        }
        storage = null;
        finalResult = null;

        if(finalCallback) {
            finalCallback(finalErr);
        }
    });

}

exports.loadData = loadData;
exports.processTempoIQResponse = processTempoIQResponse;