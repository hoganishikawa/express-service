"use strict";

var _ = require("lodash"),
    moment = require("moment"),
    async = require("async"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    calcUtils = require("./calculator-utils"),
    tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    cache = require("../../../libs/cache");

var energyByMonth = [0.0648, 0.0644, 0.0985,
    0.0968, 0.0926, 0.0968,
    0.1052, 0.1171, 0.0669,
    0.0858, 0.0720, 0.0391]; // ratio of annual energy generation by month


/*
var LRU = require("lru-cache")
  , options = { max: 100, maxAge: 1000 * 60 * 60 }
  , cache = LRU(options);
*/

/*function loadDataPower(solarTags, inspectedFacility, cb) {
    // var cached_data = cache.get(inspectedFacility + "_power") || {};

    var startDate = moment.utc().add(-1, "year"); // During last 12 month
    var endDate = moment.utc();

    // cached_data['startDate'] = startDate;
    // cached_data['endDate'] = endDate;

        // For power
    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1day"]
        }]
    };

    var tmp  = calcUtils.getTempoIQParametersByUserSources(solarTags, [inspectedFacility], []);
    var selection = tmp.selection;

    var nodeList = tmp.nodeList;
    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);

    tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function(err, data) {
        if(err) {
            cb(err);
        } else {
            var tmpResult = _.map(data.dataPoints, function(point) {
                var sumOfNodes = _.reduce(_.map(_.values(point.values), function(el) {
                    if(el["powr"]) {
                        return parseFloat(el["powr"]);
                    } else if(el["Pac"]) {
                        return parseFloat(el["Pac"]);
                    } else {
                        return 0;
                    }
                }), function(sum, x) {
                    return sum + x;
                }, 0.0);
                //return [ moment(point.ts).utc().startOf("day").valueOf(), sumOfNodes ];

                var date = moment.utc(point.ts);
                calcUtils.convertTimeStampToUTC(date, deviceOffset);

                return {
                    "category": date.startOf("day").format("lll"),
                    "series": sumOfNodes
                };
            });
            var result = {
                "categories": _.pluck(tmpResult, "category"),
                "series": _.pluck(tmpResult, "series")
            };

            cb(null, result);

        }
    });
}

function loadDataEnergy(solarTags, inspectedFacility, cb) {
    var startDate = moment.utc().add(-10, "year").startOf("year"), // All history
        endDate = moment.utc();

    var pipeline = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] // average power by hour
        }, {
            "name": "rollup",
            "arguments": ["sum", "1day"] // Wh data - EOD result
        }]
    };

    var tmp  = calcUtils.getTempoIQParametersByUserSources(solarTags, [inspectedFacility], []);
    var selection = tmp.selection;

    tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, function(err, data) {
        if(err) {
            cb(err);
        } else {
            var tmp = _.map(data.dataPoints, function(point) {
                var sumOfNodes = _.reduce(_.map(_.values(point.values), function(el) {
                    if(el["powr"]) {
                        return parseFloat(el["powr"]);
                    } else if(el["Pac"]) {
                        return parseFloat(el["Pac"]);
                    } else {
                        return 0;
                    }
                }), function(sum, x) {
                    return sum + x;
                }, 0.0);
                return {
                    "ts": point.ts,
                    "kWh": sumOfNodes / 1000.0
                };
            });

            var byMonth = _.groupBy(tmp, function(el) {
                return moment(el.ts).format("YYYY-MM");
            });

            var res = _.mapValues(byMonth, function(els) {
                var kWhs = _.pluck(els, "kWh");
                var t = moment(_.first(els).ts).utc().startOf("month");
                return [t.valueOf(), _.first(kWhs), _.max(kWhs), _.min(kWhs), _.last(kWhs)];
            });
            cb(null, _.values(res));
        }
    });
}*/

function getPowerData(deviceOffset, tempoiqResponse) {
    var tmpResult = _.map(tempoiqResponse.dataPoints, function(point) {
        var sumOfNodes = _.reduce(_.map(_.values(point.values), function(el) {
            var metric = _.first(_.keys(el)); // We are expecting powr or Pac
            var val = el[metric];
            return _.isNumber(val) ? parseFloat(val) : 0;
        }), function(sum, x) {
            return sum + x;
        }, 0.0);

        var date = moment.utc(point.ts);
        calcUtils.convertTimeStampToUTC(date, deviceOffset);

        return {
            "category": date.startOf("day").format("lll"),
            "series": sumOfNodes
        };
    });
    var result = {
        "categories": _.pluck(tmpResult, "category"),
        "series": _.pluck(tmpResult, "series")
    };
    tmpResult = null;

    return result;
}

function getEnergyData(tempoiqResponse) {
    var constEmissionFactor = 0.000823724;
    var tmp = _.map(tempoiqResponse.dataPoints, function(point) {
        var sumOfNodes = _.reduce(_.map(_.values(point.values), function(el) {
            var metric = _.first(_.keys(el)); // We are expecting powr or Pac
            var val = el[metric];
            return _.isNumber(val) ? parseFloat(val) : 0;
        }), function(sum, x) {
            return sum + x;
        }, 0.0);

        return {
            "ts": point.ts,
            "kWh": sumOfNodes / 1000.0
        };
    });

    var byMonth = _.groupBy(tmp, function(el) {
        return moment(el.ts).format("YYYY-MM");
    });

    var res = _.mapValues(byMonth, function(els) {
        var kWhs = _.pluck(els, "kWh");
        var t = moment(_.first(els).ts).utc().startOf("month");
        return [t.format("YYYY"), t.valueOf(), _.first(kWhs), _.max(kWhs), _.min(kWhs), _.last(kWhs)];
    });

    var pags = _.mapValues(byMonth, function(els) {
        var total = _.reduce(_.pluck(els, "kWh"), function(sum, x) {
            return sum + x;
        }, 0.0);
        var month = moment(_.first(els).ts).utc().month();
        return total / energyByMonth[month];  // Annual energy estimation
    });

    // It is better now to make outlier detection or something like that
    var pag = _.reduce(_.values(pags), function(sum, x) { return sum + x; }, 0.0) / _.values(pags).length;

    return {
        "graph": _.values(res),
        "predictedAnnualGeneration": pag,
        "predictedCarbonAvoided": pag * constEmissionFactor
    };
}

function loadData(clientObject, inspectedFacility) {
    var socket = clientObject.socket;
    var solarTags = clientObject.solarTags;
    var dateRange = clientObject.dateRange;

    if (!inspectedFacility) {
        var finalResult = new utils.serverAnswer(true, {});
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, finalResult);
        return;
    }

    var pipelinePower = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1day"]
        }]
    };

    var pipelineEnergy = {
        "functions":[{
            "name": "rollup",
            "arguments": ["mean", "1hour"] // average energy by hour
        }, {
            "name": "rollup",
            "arguments": ["sum", "1day"] // Wh data - EOD result
        }]
    };

    var tmp  = calcUtils.getTempoIQParametersByUserSources(clientObject, solarTags, [inspectedFacility], [], []);
    var selection = tmp.selection;

    var nodeList = tmp.nodeList;
    var deviceOffset = calcUtils.getDeviceOffsetfromNodeList(nodeList);

    var powerStartDate = moment.utc().startOf("year"); // During last 12 month
    var energyStartDate = moment.utc().startOf("year"); // During last 12 month
    /*async.parallel({
        energy: function(cb){
            loadDataEnergy(solarTags, inspectedFacility, cb);
        },
        power: function(cb){
            loadDataPower(solarTags, inspectedFacility, cb);
        }
    }, function(err, res) {
        var finalResult = null;
        if (err) {
            finalResult = new utils.serverAnswer(false, err);
        } else {
            var result = {
                "chart_data_energy": res["energy"],
                "chart_data_power": res["power"]
            };
            finalResult = new utils.serverAnswer(true, result);
        }
    });*/

    //var cacheBaseKey = calcUtils.getSocketCacheKey(socket);

    var cacheKeyObj = {
        selection: selection,
        inspectedFacility: inspectedFacility
    };

    //get hash bases od element parameters
    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown + ":" +
        calcUtils.getHashByElementParameters(cacheKeyObj);

    if (selection.devices.or.length === 0){
        socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown,
            new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
        return ;
    }

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
            var cachedEndDatePower = calcUtils.getCachedEndDate(cacheResults[0]);
            var cachedEndDateEnergy = calcUtils.getCachedEndDate(cacheResults[1]);

            cb(null, cacheResults, cachedEndDatePower, cachedEndDateEnergy);
        },
        function(cacheResults, cachedEndDatePower, cachedEndDateEnergy, callback) {
            //use last datapoint as startdate to tempoiq requests
            if(cachedEndDatePower) {
                powerStartDate = cachedEndDatePower;
            }

            if(cachedEndDateEnergy) {
                energyStartDate = cachedEndDateEnergy;
            }

            //make requests to tempoiq
            async.parallel([
                function(cb) {
                    tempoiqWrapper.loadData(powerStartDate, moment.utc(), selection, pipelinePower, null, cb);
                },
                function(cb) {
                    tempoiqWrapper.loadData(energyStartDate, moment.utc(), selection, pipelineEnergy, null, cb);
                }
            ], function(err, tempoIQResults) {
                if(err) {
                    callback(err);
                } else {
                    //combine loaded tempoiq results and cached data

                    //power value
                    cacheResults[0].dataPoints.push.apply(cacheResults[0].dataPoints, tempoIQResults[0].dataPoints);

                    //energy value
                    cacheResults[1].dataPoints.push.apply(cacheResults[1].dataPoints, tempoIQResults[1].dataPoints);
                    tempoIQResults = null;
                    callback(null, cacheResults);
                }
            });
        },
        function(cachedTempoiqData, cb) {
            //store cached data in redis
            cache.setex(elementHash, consts.ASSURF_TEMPOIQ_CACHE_TTL, JSON.stringify(cachedTempoiqData),
                function(err, result) {
                cb(err, cachedTempoiqData);
            });
        },
        function(cachedTempoiqData, cb) {
            //calculate data based on tempoiq response
            var resEnergy = getEnergyData(cachedTempoiqData[1]);
            var res = {
                "power": getPowerData(deviceOffset, cachedTempoiqData[0]),
                "energy": resEnergy.graph,
                "predictedAnnualGeneration": resEnergy.predictedAnnualGeneration,
                "predictedCarbonAvoided": resEnergy.predictedCarbonAvoided
            };

            cb(null, res);
        }
    ], function(finalErr, res) {
        var finalResult = null;
        if (finalErr) {
            finalResult = new utils.serverAnswer(false, finalErr);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, finalResult);
        } else {
            var resEnergy = res["energy"];
            if (dateRange){
                resEnergy = _.filter(res["energy"], function(value){
                    return value[0] === dateRange;
                });
            }
            var result = {
                "predictedAnnualGeneration": res["predictedAnnualGeneration"],
                "predictedCarbonAvoided": res["predictedCarbonAvoided"],
                "chart_data_energy": resEnergy,
                "chart_data_power": res["power"]
            };
            finalResult = new utils.serverAnswer(true, result);
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.FacilityDrillDown, finalResult);
            res = null;
            result = null;
            finalResult = null;
        }
    });
}

exports.loadData = loadData;
