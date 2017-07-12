"use strict";

var _ = require("lodash");

var tempoiqWrapper = require("../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    async = require("async"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts");

// --- Added for info module (last sunny day + energy for that day) ---
// Author: @alexice
// Date: 25 Mar 2015
/**
 * Function processes data from TempoIQ in order to find last sunny day
 * @param {object} data
 * @returns {object} lastSunnyDay
 */

function getLastSunnyDay(data, facilityKey) {
    var clearDay = null;
    var clearHours = 0;
    var prevClearDayNum = null;
    var thisClearDayNum = 0;

    if(data.dataPoints.length > 0) {
        //get last sunny hour
        for (var i = data.dataPoints.length - 1; i >= 0; i--) {
            if (data.dataPoints[i].values[facilityKey]) {
                var icon = data.dataPoints[i].values[facilityKey].Icon;

                if(icon === 0) {
                    //clear day

                    //6 hours should be cleared in same day
                    thisClearDayNum = data.dataPoints[i].ts.getDate();
                    if(thisClearDayNum !== prevClearDayNum) {
                        //it is new day
                        prevClearDayNum = thisClearDayNum;
                        clearDay =  moment.utc(data.dataPoints[i].ts);
                        clearHours = 1;
                    } else {
                        clearHours++;
                    }

                    //it is 6 cleared hours, return ts
                    if(clearHours === 6) {
                        return clearDay;
                    }

                }
            }
        }
    }

    return moment.utc();
}

/**
 * Function sends query to TempoIQ
 * @param {object} clientObject
 * @returns {void}
 */

function loadLastSunnyDay(clientObject, finalCallback) {
    var socket = clientObject.socket;

    // first facility is supposed to be primary facility
    //

    //var primaryFacility = _.first(solarTags);
    //var primaryFacility = solarTags[1];
    var facilityKey = "Forecast.Latitude:" + clientObject.geo["latitude"] +
        ".Longitude:" + clientObject.geo["longitude"];

    async.waterfall([
        function(cb) {
            //console.log("Querying day...");
            var startDate = moment.utc().add(-45, "day").startOf("day"); // During last 30 days
            var endDate = moment.utc().add(-1, "day").endOf("day"); // Till yesterday

            var selection = {
                "devices": { "key": facilityKey },
                "sensors": { "key": "Icon" }
            };

            /*var pipeline = {
                "functions":[{
                    "name": "rollup",
                    "arguments": ["first", "1hour"]
                }]
            };*/

            tempoiqWrapper.loadData(startDate, endDate, selection, null, null, cb);
        },
        function(data, cb) {
            //console.log("Processing result");
            var sunnyDay = getLastSunnyDay(data, facilityKey);

            var startDate = moment(sunnyDay).utc().startOf("day");
            var endDate = moment(sunnyDay).utc().endOf("day");

            var selection = clientObject.selection;
            var pipeline = {
                "functions":[{
                    "name": "rollup",
                    "arguments": ["mean", "1hour"] // average power by hour
                }, {
                    "name": "rollup",
                    "arguments": ["sum", "1day"]
                }]
            };

            if (selection.devices.or.length === 0){
                socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SunnyDay, 
                    new utils.serverAnswer(false, consts.NOT_ALLOWED_EMPTY_SELECTION));
                return ;
            }

            tempoiqWrapper.loadData(startDate, endDate, selection, pipeline, null, cb);
        },
        function(data, cb) {
            var tmp = _.map(data.dataPoints, function(point) {
                var sumOfNodes = _.reduce(_.map(_.values(point.values), function(el) {
                    var metric = _.first(_.keys(el)); // We are expecting powr or Pac
                    var val = el[metric];
                    return _.isNumber(val) ? parseFloat(val) : 0;
                }), function(sum, x) {
                    return sum + x;
                }, 0.0);
                return {
                    "day": point.ts,
                    "Energy": sumOfNodes / 1000.0
                };
            });

            cb(null, tmp);
        }
        ],function (err, result) {
            var finalResult = null;
            if(err) {
                finalResult = new utils.serverAnswer(false, err);
            } else {
                // Compose finalResult here
                finalResult = new utils.serverAnswer(true, result);
            }
            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.SunnyDay, finalResult);

            if(finalCallback) {
                finalCallback(err);
            }
    });
}

exports.loadLastSunnyDay = loadLastSunnyDay;
exports.getLastSunnyDay = getLastSunnyDay;
