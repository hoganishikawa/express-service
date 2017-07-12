"use strict";

var tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    calcUtils = require("./calculator-utils"),
    async = require("async"),
    cache = require("../../../libs/cache"),
    _ = require("lodash");

var profiling = require("../../../libs/profiling")(consts.WEBSOCKET_EVENTS.ASSURF.Savings);

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @param {string} labelFormat
 * @param {boolean} calculateTotal
 * @returns {number}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility, labelFormat, calculateTotal) {

    var totalkwh =0;
    var i=0;
    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);

    for(i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = moment.utc(tempoIQData.dataPoints[i].ts);
        calcUtils.convertTimeStampToUTC(ts, deviceOffset);
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        var periodKwh = 0;
        var periodSavings = 0;

        var iterationSegmentsValues = {};//stores facilities (scopes) values for current iteration

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityName;//find facility by imberter
            var scope = nodeList[thisInv].scopeName;

            //if one facility selected, use scopes as labels
            var segmentName = isOneFacility? scope : facility;

            var metric = Object.keys(values[thisInv])[0];

            var kwh = values[thisInv][metric] / 1000;
            var thisSavings = (kwh * nodeList[thisInv].rate);

            if(!calculateTotal) {
                //save value per segment in that iteration
                if (!iterationSegmentsValues[segmentName]) {
                    iterationSegmentsValues[segmentName] = 0;
                }
                iterationSegmentsValues[segmentName] += thisSavings;

                storage.totalSavingPerDateRange += thisSavings;

            } else {
                storage.totalProduction += kwh;
                storage.totalSavings += (kwh * nodeList[thisInv].rate);

                //total production by source data
                if (!storage.totalProductionBySources[segmentName]) {
                    storage.totalProductionBySources[segmentName] = 0;
                }
                storage.totalProductionBySources[segmentName] += kwh;
            }

            periodKwh += kwh;
            periodSavings += thisSavings;
        }

        if(!calculateTotal) {

            var date = ts.format(labelFormat);

            storage.areaChart.categories.push(date);
            storage.comboChart.categories.push(date);

            //add data to sources series (facility, scope)
            for (var k = 0; k < storage.areaChart.series.length; k++) {
                var seriesName = storage.areaChart.series[k].name;

                if (iterationSegmentsValues[seriesName]) {
                    //we have data for that series
                    storage.areaChart.series[k].data.push(iterationSegmentsValues[seriesName]);
                } else {
                    //value not exists, use zero
                    storage.areaChart.series[k].data.push(0);
                }
            }

            storage.comboChart.series[0].data.push(periodSavings);
            storage.comboChart.series[1].data.push(periodKwh);
        }
    }

    return totalkwh;
}

function loadData(clientObject, dateRange, selectedYear, totalMonthlydata, isPreloading, finalCallback) {
    var socket = clientObject.socket;

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;
    var isOneFacility = clientObject.selectedFacilities.length === 1;

    var rewriteTotalCache = totalMonthlydata !== null && !_.isUndefined(totalMonthlydata);

    var startDate = null,
        endDate = moment.utc(),
        dimension = null;

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Savings, 
            new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
        return ;
    }

    if(!selectedYear) {
        switch (dateRange) {
            case "today":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "day"));
                dimension = "1hour";
                break;
            case "month":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "month"));
                dimension = "1day";
                break;
            case "YTD":
                startDate = calcUtils.setDateToMidnight(moment.utc().startOf("year"));
                dimension = "1month";
                break;
            case "total":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-10, "year"));
                dimension = "1month";
                break;
            default :
                startDate = calcUtils.setDateToMidnight(moment.utc().startOf("year"));
                dimension = "1month";
                break;
        }
    } else {
        dimension = "1month";
        startDate = moment.utc([selectedYear, 0, 1]);

        if(!startDate.isValid()) {
            startDate = moment.utc().startOf("year");
        }
        endDate = startDate.clone().endOf("year");
    }

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", dimension] //set user dimension
        }]
    };

    var pipelineTotal = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1month"] //set user dimension
        }]
    };

    var totalStartDate = moment.utc().add(-10, "year");

    var cacheKeyObj = {
        selection: selection,
        dateRange: dateRange,
        selectedYear: selectedYear,
        selectedFacilitiesId: clientObject.selectedFacilities,
        selectedScopesId: clientObject.selectedScopes
    };

    //var cacheBaseKey = calcUtils.getSocketCacheKey(socket);

    //get hash bases od element parameters
    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.Savings + ":" +
        calcUtils.getHashByElementParameters(cacheKeyObj);

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
            var cachedEndDateCurrent = calcUtils.getCachedEndDate(cacheResults[0]);
            var cachedEndDateTotal = calcUtils.getCachedEndDate(cacheResults[1]);

            cb(null, cacheResults, cachedEndDateCurrent, cachedEndDateTotal);
        },
        function(cacheResults, cachedEndDateCurrent, cachedEndDateTotal, callback) {
            //use last datapoint as startdate to tempoiq requests
            if(cachedEndDateCurrent) {
                startDate = cachedEndDateCurrent;
            }

            if(cachedEndDateTotal) {
                totalStartDate = cachedEndDateTotal;
            }

            //make requests to tempoiq
            async.parallel([
                    function(cb) {
                        //load value according date range
                        profiling.start("Tempoiq1");
                        tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function(err, data) {
                            profiling.endTime("Tempoiq1");
                            cb(err, data);
                        });
                    },
                    function(cb) {
                        if(totalMonthlydata) {
                            cb(null, totalMonthlydata);
                        } else {
                            //load total value
                            profiling.start("Tempoiq2");
                            tempoiqWrapper.loadData(totalStartDate, moment.utc(), selection, pipelineTotal, null,
                                function (err, data) {
                                    profiling.endTime("Tempoiq2");
                                    cb(err, data);
                                }
                            );
                        }
                    }
                ], function(err, tempoIQResults) {
                if(err) {
                    callback(err);
                } else {
                    //combine loaded tempoiq results and cached data
                    cacheResults[0].dataPoints.push.apply(cacheResults[0].dataPoints, tempoIQResults[0].dataPoints);
                    if(rewriteTotalCache) {
                        cacheResults[1].dataPoints = [];
                    }
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
                totalSavingPerDateRange : 0,
                totalSavings : 0,
                totalProduction : 0,
                totalProductionBySources: {},
                areaChart: {
                    categories: [],
                    series: []
                },
                comboChart: {
                    categories: [],
                    series: [{
                        type: "column",
                        name: "Savings",
                        data: []
                    }, {
                        type: "spline",
                        name: "kWh",
                        data: []
                    }]
                }
            };

            var labelFormat = "lll";
            if(dimension !== "1hour") {
                labelFormat = "MMMM DD, YYYY";
            }

            calcUtils.addHighchartsSeriesPerSource(nodeList, isOneFacility, storage.areaChart);

            processTempoIQResponse(tempoiqData[0], nodeList, storage, isOneFacility, labelFormat, false);
            processTempoIQResponse(tempoiqData[1], nodeList, storage, isOneFacility, labelFormat, true);
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
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Savings, finalResult);
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