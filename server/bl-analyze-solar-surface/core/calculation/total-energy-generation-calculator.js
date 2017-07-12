"use strict";

var consts = require("../../../libs/consts"),
    utils = require("../../../libs/utils"),
    cache = require("../../../libs/cache");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @returns {number}
 */
function processTempoIQResponse(tempoIQData) {

    var total = 0;

    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];

            var metric = Object.keys(values[thisInv])[0];

            var kwh = values[thisInv][metric] / 1000;

            total += kwh;

        }
    }

    return total;

}


function calculateData(socket, data, elementBaseHash, isPreloading) {

    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration + ":" + elementBaseHash;

    cache.setex(elementHash, consts.ASSURF_TEMPOIQ_CACHE_TTL, JSON.stringify(data), function(err, result) {
        if (err) {
            utils.logError(err);
        }

        if(!isPreloading) {
            var storage = {
                totalEnergyGeneration: 0
            };

            storage.totalEnergyGeneration = processTempoIQResponse(data);

            var finalResult = new utils.serverAnswer(true, storage);

            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.TotalEnergyGeneration, finalResult);
        }
    });

}

exports.calculateData = calculateData;
