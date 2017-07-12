"use strict";

var tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    calcUtils = require("./calculator-utils"),
    solarEnergyFeneratioCalc = require("./solar-energy-generation-calculator"),
    totalEnergyGenerationCalc = require("./total-energy-generation-calculator"),
    async = require("async"),
    equivCalc = require("./equivalencies-calculator"),
    _ = require("lodash");

var profiling = require("../../../libs/profiling")();

function processEvent(socket, event, err, data, nodeList, isOneFacility, dimension, elementBaseHash, isPreloading) {
    if (err) {
        var finalResult = new utils.serverAnswer(false, err);
        socket.emit(event, finalResult);
    } else {
        switch (event) {
            case consts.WEBSOCKET_EVENTS.ASSURF.SolarEnergyGeneration:
                solarEnergyFeneratioCalc.calculateData(socket, data, nodeList, isOneFacility, dimension,
                    elementBaseHash, isPreloading);
                break;
            case consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies:
                equivCalc.calculateData(socket, data, elementBaseHash, isPreloading);
                break;
            case consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration:
                totalEnergyGenerationCalc.calculateData(socket, data, elementBaseHash, isPreloading);
                break;
        }
    }
}

function loadData(clientObject, dateRange, selectedYear, selectedMonth, events, isPreloading, finalCallback) {
    var socket = clientObject.socket;

    var startDate = null,
        endDate = moment.utc(),
        dimension = null;

    if(!selectedYear) {
        switch (dateRange) {
            case "total":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-10, "year"));
                dimension = "1month";
                break;
            case "year":
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "year"));
                dimension = "1month";
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
                startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "year"));
                dimension = "1month";
                break;
        }
    } else {
        startDate = moment.utc([selectedYear, 0, 1]);

        if(!startDate.isValid()) {
            startDate = moment.utc().startOf("year");
        }

        if(selectedMonth !== null &&
            !_.isUndefined(selectedMonth) &&
            utils.isNumber(selectedMonth) &&
            selectedMonth >=0 &&
            selectedMonth <=11) {
            //is valid month
            startDate.set("month", selectedMonth);
            endDate = startDate.clone().endOf("month");
            dimension = "1day";
        } else {
            endDate = startDate.clone().endOf("year");
            dimension = "1month";
        }
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
            "arguments": ["sum", dimension] //set user dimension
        }]
    };

    if (selection.devices.or.length === 0){
        socket.emit(events, new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
        return ;
    }

    var cacheKeyObj = {
        selection: selection,
        dateRange: dateRange,
        selectedYear: selectedYear,
        selectedFacilitiesId: clientObject.selectedFacilities,
        selectedScopesId: clientObject.selectedScopes
    };

    //var cacheBaseKey = calcUtils.getSocketCacheKey(socket);

    //get hash bases od element parameters
    var elementBaseHash = calcUtils.getHashByElementParameters(cacheKeyObj);

    if(events.length === 1) {
        //this is one event, load from cache

        var elementHash = events[0] + ":" + elementBaseHash;

        async.waterfall([
                function (cb) {
                    var defaultCachedData = {
                        dataPoints: []
                    };

                    calcUtils.getCachedElementData(socket, elementHash, defaultCachedData, cb);
                },
                function (cacheResult, cb) {
                    //delete last datapoint from cached data
                    var cachedEndDate = calcUtils.getCachedEndDate(cacheResult);
                    cb(null, cacheResult, cachedEndDate);
                },
                function (cacheResult, cachedEndDate, cb) {
                    //use last datapoint as startdate to tempoiq requests
                    if (cachedEndDate) {
                        startDate = cachedEndDate;
                    }

                    profiling.start("united " + events);
                    tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function (err, data) {
                        profiling.endTime("united " + events);
                        if (err) {
                            cb(err);
                        } else {
                            //combine cached data and tempoiq data
                            cacheResult.dataPoints.push.apply(cacheResult.dataPoints, data.dataPoints);
                            cb(null, cacheResult);
                        }
                    });
                }],
            function (finalErr, tempoIQdata) {
                processEvent(socket, events[0], finalErr, tempoIQdata, nodeList, isOneFacility, dimension,
                    elementBaseHash, isPreloading);

                tempoIQdata = null;

                if(finalCallback) {
                    finalCallback(finalErr);
                }
            });

    } else {
        //multiple events, we do not have cache, load from tempoiq full data
        profiling.start("united " + events);
        tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function (err, data) {
            profiling.endTime("united " + events);
            for (var i = 0; i < events.length; i++) {
                processEvent(socket, events[i], err, data, nodeList, isOneFacility, dimension,
                    elementBaseHash, isPreloading);
            }

            data = null;

            if(finalCallback) {
                finalCallback(err);
            }
        });
    }

}

function loadCarbonAvoidedData(clientObject, totalMonthlyData) {
    var socket = clientObject.socket;
    var dataObject = clientObject.CarbonAvoided;

    var startDate = null,
        endDate = moment.utc(),
        dimension = null,
        dateRange = dataObject.dateRange;

    var profileScope = profiling.createScope(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided);

    async.parallel({
        carbon: function(cb){
            switch (dateRange) {
                case "total":
                    startDate = calcUtils.setDateToMidnight(moment.utc().add(-10, "year"));
                    dimension = "1month";
                    break;
                case "year":
                    startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "year"));
                    dimension = "1month";
                    break;
                case "month":
                    startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "month"));
                    dimension = "P1W";
                    break;
                default :
                    startDate = calcUtils.setDateToMidnight(moment.utc().add(-1, "year"));
                    dimension = "1month";
                    break;
            }

            var selection = clientObject.selection;

            var pipeline = {
                "functions":[{
                    "name": "rollup",
                    "arguments": ["mean", "1hour"] //kwh data
                }, {
                    "name": "rollup",
                    "arguments": ["sum", dimension] //set user dimension
                }]
            };

            if (selection.devices.or.length === 0){
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided,
                    new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
                return ;
            }

            profileScope.start("Tempoiq1");
            tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function(err, data) {
                profileScope.endTime("Tempoiq1");
                if (err) {
                    cb(err);
                } else {
                    cb(null, equivCalc.calculateCO2AvoidedData(socket, data));
                }
            });
        },
        total: function(cb){

            if(totalMonthlyData) {
                //we have total monthly data, so do not load again
                cb(null, equivCalc.calculateCO2AvoidedTotalData(socket, totalMonthlyData));
            } else {

                var selection = clientObject.selection;

                var pipeline = {
                    "functions": [{
                        "name": "rollup",
                        "arguments": ["mean", "1hour"] //kwh data
                    }, {
                        "name": "rollup",
                        "arguments": ["sum", "1month"] //set user dimension
                    }]
                };

                if (selection.devices.or.length === 0) {
                    socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided,
                        new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
                    return;
                }

                profileScope.start("Tempoiq2");
                tempoiqWrapper.loadData(moment.utc().add(-10, "year"), endDate, selection,
                    pipeline, null, function (err, data) {
                        profileScope.endTime("Tempoiq2");
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, equivCalc.calculateCO2AvoidedTotalData(socket, data));
                        }
                    });
            }
        }
    }, function(err, res) {
        var finalResult = null;
        if (err) {
            finalResult = new utils.serverAnswer(false, err);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided, finalResult);
        } else {
            var result = {
                "carbonAvoided": res["carbon"],
                "carbonAvoidedTotal": res["total"]
            };
            finalResult = new utils.serverAnswer(true, result);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.CarbonAvoided, finalResult);
            result = null;
            res = null;
        }
    });

}

function loadTotalMonthlyData(clientObject, cb) {
    var selection = clientObject.selection;
    var endDate = moment.utc();

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] //kwh data
        }, {
            "name": "rollup",
            "arguments": ["sum", "1month"]
        }]
    };

    tempoiqWrapper.loadData(moment.utc().add(-10, "year"), endDate, selection, pipeline, null, function(err, data) {
        if (err) {
            cb(err);
        } else {
            cb(null, data);
        }
    });
}

exports.loadData = loadData;
exports.loadCarbonAvoidedData = loadCarbonAvoidedData;
exports.loadTotalMonthlyData = loadTotalMonthlyData;
