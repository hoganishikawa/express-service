"use strict";

var //log = require("../../../../libs/log")(module),
    utils = require("../../../../libs/utils"),
    kWhCalculator = require("./kwh-calculator").kWhCalculator,
    EquivalenciesCalculator = require("../../../../general/core/calculation/equivalencies-calculator")
        .EquivalenciesCalculator,
    tempoiq = require("../../../../general/core/tempoiq/tempoiq-wrapper"),
    calcUtils = require("./calculator-utils"),
    async = require("async"),
    moment = require("moment"),
    cacheUtils = require("../../../../general/core/calculation/cache-utils");

/**
 * Function calculates data
 * @access private
 * @param {array} results - tempoiq results
 * @param {array} tempoDBItems - tempoiq query parameters
 * @returns {object}
 */
function process(results) {
    //var dtos = [];

    var equivTotal = 0;

    for(var i = 0; i < results.length;i++) {
        var calc = new kWhCalculator(results[i].tempoIQParam, results[i].dataPoints);
        equivTotal += calc.getTotalKwh();
    }

    var startDate = utils.getFirstDateFromTempoIQResults(results);
    var endDate = utils.getLastDateFromTempoIQResults(results);

    var equivCalc = new EquivalenciesCalculator(equivTotal, startDate, endDate);

    var returnObj = equivCalc.calc();

    return returnObj;
}

function processTempoIQItems(err, totalTempoIQResults, tempoIQResult, presentation, widgetDTO, socket, callback) {
    if (err) {
        callback(err);
    } else {
        totalTempoIQResults.push(tempoIQResult);
        if (socket) {
            //collect total data

            var loadedData = process(totalTempoIQResults);
            calcUtils.sendWidgetData(loadedData, presentation, widgetDTO, false, socket);

        }

        callback(null, tempoIQResult);
    }
}

/**
 * Entry point to the module, functions returns ee widget data
 * @access public
 * @param {object} widgetDTO - widget body
 * @param {object} presentation
 * @param {array} tempoDBItems - tempoiq query parameters
 * @param {object}socket
 * @param {function} finalCallback
 * @returns {void}
 */
function calculateData(cachedData, widgetDTO, presentation, tempoDBItems, socket, finalCallback) {

    var loadAllExistingData = widgetDTO.parameters.widgetEnergyDateRange === "All" && !cachedData.lastDate;
    var totalTempoIQResults = cachedData.tempoIQCachedResults;

    async.map(tempoDBItems, function(tempoDBItem, callback) {

        var selection = {
            "devices": {
                "key": tempoDBItem.sensor
            },
            "sensors": {
                "key": tempoDBItem.type
            }
        };

        var pipeline = calcUtils.getTempoIQPipeline(false, tempoDBItem);

        if(loadAllExistingData) {
            //load ell data
            tempoiq.loadAllExistingData(selection, pipeline, tempoDBItem, function(err, result) {
                processTempoIQItems(err, totalTempoIQResults, result, presentation, widgetDTO, socket, callback);
            });
        } else {

            if(cachedData.lastDate) {
                tempoDBItem.startDate = cachedData.lastDate;
            }

            if(!tempoDBItem.endDate) {
                tempoDBItem.endDate = moment.utc();
            }

            tempoiq.loadData(tempoDBItem.startDate, tempoDBItem.endDate, selection, pipeline, tempoDBItem,
                function(err, result) {
                processTempoIQItems(err, totalTempoIQResults, result, presentation, widgetDTO, socket, callback);
            });
        }

    }, function (err, results) {
        if(err) {
            utils.presentationErrorHandler(err, socket, finalCallback);
        } else {
            var loadedData = process(totalTempoIQResults);

            if(socket) {

                cacheUtils.setWidgetData(socket.id, presentation._id.toString(),
                    widgetDTO._id.toString(), totalTempoIQResults, function(cacheErr, cacheResult) {

                    results = null;
                    totalTempoIQResults = null;

                    if(cacheErr) {
                        utils.presentationErrorHandler(cacheErr, socket, finalCallback);
                    } else {
                        //send full data for that widget
                        calcUtils.sendWidgetData(loadedData, presentation, widgetDTO, true, socket);
                        loadedData = null;
                    }
                });

            } else {
                finalCallback(null, loadedData);
            }

        }
    });
}

exports.calculateData = calculateData;