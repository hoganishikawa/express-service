"use strict";

var utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    moment = require("moment"),
    calcUtils = require("./calculator-utils"),
    tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    cache = require("../../../libs/cache"),
    async = require("async");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @param {string} labelFormat
 * @returns {void}
 */
function processTempoIQResponse(tempoIQData, nodeList, storage, isOneFacility, labelFormat) {
    var i =0;
    var pieData = {};
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
            var thisSavings = kwh * nodeList[thisInv].rate;

            //save value per segment in that iteration
            if(!iterationSegmentsValues[segmentName]) {
                iterationSegmentsValues[segmentName] = 0;
            }
            iterationSegmentsValues[segmentName] += kwh;

            storage.totalSaving += thisSavings;
            storage.totalProduction += kwh;

            //pie data
            if (!pieData[segmentName]) {
                pieData[segmentName] = 0;
            }
            pieData[segmentName] += kwh;

            //total production by source data
            if (!storage.totalProductionBySources[segmentName]) {
                storage.totalProductionBySources[segmentName] = 0;
            }
            storage.totalProductionBySources[segmentName] += kwh;

            periodKwh += kwh;
            periodSavings += thisSavings;
        }

        storage.mainChart.categories.push(ts.format(labelFormat));
        storage.mainChart.series[0].data.push(periodKwh);
        storage.mainChart.series[1].data.push(periodSavings);

        //add data to sources series (facility, scope)
        for(var k=2; k < storage.mainChart.series.length; k++) {
            var seriesName = storage.mainChart.series[k].name;

            if(iterationSegmentsValues[seriesName]) {
                //we have data for that series
                storage.mainChart.series[k].data.push(iterationSegmentsValues[seriesName]);
            } else {
                //value not exists, use zero
                storage.mainChart.series[k].data.push(0);
            }
        }
    }

    if(storage.totalProduction !== 0) {
        for (var prop in pieData) {
            if (pieData[prop]) {
                storage.pie.series[0].data.push([prop, (pieData[prop] / storage.totalProduction) * 100]);
            }
        }
    }
    pieData = null;
}

function processTempoIQResponseCandlestick(tempoIQData, storage, nodeList, isOneFacility) {
    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);
    var len =  tempoIQData.dataPoints.length;

    var prevTS = null,
        prevMonth = null,
        prevDay = null,
        prevMonthMax = null,
        prevMonthMin = null,
        monthFirstDay = null,
        monthLastDay = null,
        monthMinTS = null,
        monthMaxTS = null;

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var ts = moment.utc(tempoIQData.dataPoints[i].ts);
        calcUtils.convertTimeStampToUTC(ts, deviceOffset);

        var thisMonth = ts.month();
        var thisDay = ts.date();

        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);


        var dayKwh = 0;

        for (var j = 0; j < inverters.length; j++) {
            var thisInv = inverters[j];
            var facility = nodeList[thisInv].facilityName;//find facility by imberter
            var scope = nodeList[thisInv].scopeName;
            var segmentName = isOneFacility? scope : facility;

            var metric = Object.keys(values[thisInv])[0];
            var kwh = values[thisInv][metric] / 1000;


            dayKwh += kwh;

            storage.totalSaving += (kwh * nodeList[thisInv].rate);
            storage.totalProduction += kwh;
            //total production by source data
            if (!storage.totalProductionBySources[segmentName]) {
                storage.totalProductionBySources[segmentName] = 0;
            }
            storage.totalProductionBySources[segmentName] += kwh;
        }

        //this is new monthy
        var isNewMonth = (prevMonth !== null && thisMonth !== prevMonth);

        //this is new monthy OR last day
        if(isNewMonth || (i === len - 1)) {

            var label = prevTS? prevTS.unix() * 1000 : ts.unix() * 1000;

            storage.candlestick.series.data.push(/*[
                label,
                monthLastDay,
                prevMonthMax,
                prevMonthMin,
                monthFirstDay
            ]*/ {
                timestamp: label,
                initial: monthLastDay,
                minimum: prevMonthMin,
                minimumTimestamp: monthMinTS,
                maximum: prevMonthMax,
                maximumTimestamp: monthMaxTS,
                final: monthFirstDay
            });

            //clear min/max values
            prevMonthMax = null;
            prevMonthMin = null;
            monthMinTS = null;
            monthMaxTS = null;
        }

        prevMonth = thisMonth;
        prevDay = thisDay;
        prevTS = ts.clone();

        if(!prevMonthMax || prevMonthMax < dayKwh) {
            prevMonthMax = dayKwh;
            monthMaxTS = ts.unix() * 1000;
        }

        if(!prevMonthMin || prevMonthMin > dayKwh) {
            prevMonthMin = dayKwh;
            monthMinTS = ts.unix() * 1000;
        }

        if(i === 0 || isNewMonth) {
            monthFirstDay = dayKwh;
        }
        monthLastDay = dayKwh;
    }
}


function calculateData(socket, data, nodeList, isOneFacility, dimension, elementBaseHash, isPreloading) {

    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration + ":" + elementBaseHash;

    cache.setex(elementHash, consts.ASSURF_TEMPOIQ_CACHE_TTL, JSON.stringify(data), function(err, result) {
        if(err) {
            utils.logError(err);
        }

        if(!isPreloading) {

            var storage = {
                totalSaving: 0,
                totalProduction: 0,
                totalProductionBySources: {},
                pie: {
                    series: [{
                        type: "pie",
                        name: "Generation Per Sources",
                        data: []
                    }]
                },
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Generation",
                        data: []
                    }, {
                        name: "Savings",
                        data: []
                    }]
                }
            };

            calcUtils.addHighchartsSeriesPerSource(nodeList, isOneFacility, storage.mainChart);

            var labelFormat = "lll";
            if (dimension !== "1hour") {
                labelFormat = "MMMM DD, YYYY";
            }

            processTempoIQResponse(data, nodeList, storage, isOneFacility, labelFormat);

            //var str = JSON.stringify(storage);

            var finalResult = new utils.serverAnswer(true, storage);

            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration, finalResult);

            storage = null;
            finalResult = null;
        }
    });



}

function loadCandlestick(clientObject, dateRange, selectedYear) {
    var socket = clientObject.socket;

    var startDate = null,
        endDate = moment.utc();

    if(!selectedYear) {
        switch (dateRange) {
            case "total":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-10, "year"));
                break;
            case "year":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "year"));
                break;
            /*case "month":
                startDate = moment.utc().add(-1, "month");
                dimension = "1day";
                break;
            case "week":
                startDate = moment.utc().add(-1, "week");
                dimension = "1hour";
                break;*/
            default :
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "year"));
                break;
        }

    } else {
        startDate = moment.utc([selectedYear, 0, 1]);

        if(!startDate.isValid()) {
            startDate = moment.utc().startOf("year");
        }
        endDate = startDate.clone().endOf("year");
    }

    var selection = clientObject.selection;
    var nodeList = clientObject.nodeList;

    var isOneFacility = clientObject.selectedFacilities.length === 1;

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1day"] //set user dimension
        }]
    };

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, 
            new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
        return ;
    }

    /*tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function(err, data) {
        var finalResult = null;
        if(err) {
            finalResult = new utils.serverAnswer(false, err);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, finalResult);
        } else {
            var storage = {
                totalSaving : 0,
                totalProduction: 0,
                totalProductionBySources: {},
                candlestick: {
                    series: {
                        type: "candlestick",
                        name: "Candlestick Chart",
                        data: []
                    }
                }
            };

            processTempoIQResponseCandlestick(data, storage, nodeList, isOneFacility);

            finalResult = new utils.serverAnswer(true, storage);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, finalResult);

        }
    });*/

    var cacheKeyObj = {
        selection: selection,
        dateRange: dateRange,
        selectedYear: selectedYear,
        selectedFacilitiesId: clientObject.selectedFacilities,
        selectedScopesId: clientObject.selectedScopes
    };

    //var cacheBaseKey = calcUtils.getSocketCacheKey(socket);

    //get hash bases od element parameters
    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown + ":" +
        calcUtils.getHashByElementParameters(cacheKeyObj);

    cacheKeyObj = null;

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

            tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function(err, data) {
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
                totalSaving : 0,
                totalProduction: 0,
                totalProductionBySources: {},
                candlestick: {
                    series: {
                        type: "candlestick",
                        name: "Candlestick Chart",
                        data: []
                    }
                }
            };

            processTempoIQResponseCandlestick(tempoiqData, storage, nodeList, isOneFacility);
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
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGenerationDrilldown, finalResult);
        storage = null;
        finalResult = null;
    });
}

exports.calculateData = calculateData;
exports.loadCandlestick = loadCandlestick;
exports.processTempoIQResponseCandlestick = processTempoIQResponseCandlestick;