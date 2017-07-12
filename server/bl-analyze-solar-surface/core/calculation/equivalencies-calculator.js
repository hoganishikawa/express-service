"use strict";

var utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    EquivalenciesCalculator = require("../../../general/core/calculation/equivalencies-calculator")
        .EquivalenciesCalculator,
    cache = require("../../../libs/cache");

/**
 * Function calculates data from tempoiq response
 * @param {object} tempoIQData
 * @param {object} nodeList
 * @param {object} storage
 * @param {boolean} isOneFacility
 * @returns {object}
 */
function processTempoIQResponse(tempoIQData) {
    var start = null,
        end = null,
        totalkWh = 0;

    if(tempoIQData.dataPoints.length > 0) {
        start = tempoIQData.dataPoints[0].ts;
        end = tempoIQData.dataPoints[tempoIQData.dataPoints.length - 1].ts;
    }


    for(var i=0; i < tempoIQData.dataPoints.length; i++) {
        var values = tempoIQData.dataPoints[i].values;
        var inverters = Object.keys(tempoIQData.dataPoints[i].values);

        for (var j=0; j < inverters.length; j++) {
            var thisInv = inverters[j];

            var metric = Object.keys(values[thisInv])[0];

            totalkWh += (values[thisInv][metric] / 1000);
        }
    }

    return {
        startDate: start,
        endDate: end,
        kWh: totalkWh
    };
}

function calculateData(socket, data, elementBaseHash, isPreloading) {

    var elementHash = consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies + ":" + elementBaseHash;

    cache.setex(elementHash, consts.ASSURF_TEMPOIQ_CACHE_TTL, JSON.stringify(data), function(err, result) {
        if (err) {
            utils.logError(err);
        }

        if(!isPreloading) {

            var equivInitData = processTempoIQResponse(data);

            var equivCalc = new EquivalenciesCalculator(
                equivInitData.kWh,
                equivInitData.startDate,
                equivInitData.endDate
            );

            var storage = equivCalc.calc();

            var finalResult = new utils.serverAnswer(true, storage);

            socket.emit(consts.WEBSOCKET_EVENTS.ASSURF.Equivalencies, finalResult);
        }
    });

}

function calculateCO2AvoidedData(socket, data) {
    var equivInitData = processTempoIQResponse(data);

    var equivCalc = new EquivalenciesCalculator(equivInitData.kWh, equivInitData.startDate, equivInitData.endDate);

    data = null;
    return equivCalc.calc().avoidedCarbon;
}

function calculateCO2AvoidedTotalData(socket, data) {
    var equivInitData = processTempoIQResponse(data);

    var equivCalc = new EquivalenciesCalculator(equivInitData.kWh, equivInitData.startDate, equivInitData.endDate);

    data = null;
    return equivCalc.calc().avoidedCarbonTotal;
}

exports.calculateData = calculateData;
exports.calculateCO2AvoidedData = calculateCO2AvoidedData;
exports.calculateCO2AvoidedTotalData = calculateCO2AvoidedTotalData;
exports.calculateData = calculateData;