"use strict";

var log = require("../../../../libs/log")(module),
    _ = require("lodash"),
    kWhCalculator = require("./kwh-calculator").kWhCalculator,
    tempoiq = require("../../../../general/core/tempoiq/tempoiq-wrapper"),
    moment = require("moment"),
    consts = require("../../../../libs/consts"),
    utils = require("../../../../libs/utils"),
    async = require("async"),
    calcUtils = require("./calculator-utils"),
    forecastWrapper = require("../../../../general/core/forecast/forecast-wrapper"),
    forecastConverter = require("../../../../general/core/forecast/forecast-converter"),
    cacheUtils = require("../../../../general/core/calculation/cache-utils");

/**
 * Function which is used as sort comparator
 * @param a
 * @param b
 * @returns {number}
 */
function compare(a,b) {
    if (a.x < b.x) {
        return -1;
    }

    if (a.x > b.x) {
        return 1;
    }

    return 0;
}

/**
 * Function adds y axis to highcharts object
 * @access private
 * @param {object} highchartsObj
 * @param {number} index
 * @param {boolean} opposite
 * @param {string} titleLabel
 * @returns {void}
 */
function addYAxis(highchartsObj, index, opposite, titleLabel) {
    highchartsObj.yAxis.push({
        "index": index,
        "opposite": opposite,
        "title": {
            "text": titleLabel,
            "style": {
                "fontSize": "14px"
            }
        }
    });
}

/**
 * Function adds calculated data and weather icons to highcharts object series array
 * @access private
 * @param {object} highchartsObj
 * @param {object} sourceData -calculated Data
 * @param {string} seriesKey
 * @param {string} titleLabel
 * @param {string} yAxisIndex - index of last y axis
 * @returns {void}
 */
function pushIconLineDataToSeries(highchartsObj, sourceData, seriesKey, titleLabel, yAxisIndex) {
    if(sourceData) {

        var seriesItem = {
            "type": "spline",
            "yAxis": yAxisIndex,
            "name": titleLabel,
            "data": []
        };

        for(var i=0; i < sourceData.length; i++) {
            seriesItem.data.push({
                "y": sourceData[i][seriesKey],
                "x": moment.utc(sourceData[i].currentTime).unix() * 1000,
                "t": moment.utc(sourceData[i].currentTime),
                "s": sourceData[i].icon,
                "marker": {
                    "symbol": "url(" + utils.getGraphWidgetIconUrlByName(sourceData[i].icon) + ")"
                }
            });
        }

        //_.sortBy(seriesItem, function(item) { return item.x });

        highchartsObj.series.push(seriesItem);
        yAxisIndex++;
        var yAxisesSize = highchartsObj.yAxis.length;
        addYAxis(highchartsObj, yAxisesSize, yAxisesSize % 2 !== 0, titleLabel);
    }
    return yAxisIndex;
}

/**
 * Function adds calculated data to highcharts object series array
 * @access private
 * @param {object} highchartsObj
 * @param {object} sourceData -calculated Data
 * @param {string} seriesKey
 * @param {string} titleLabel
 * @param {boolean} isChartSelected
 * @param {string} chartType - bar or column
 * @param {string} yAxisIndex - index of last y axis
 * @returns {void}
 */
function pushDataToSeries(highchartsObj, sourceData, seriesKey, titleLabel, isChartSelected, chartType, yAxisIndex) {

    if(sourceData && isChartSelected) {
        var seriesItem = {
            "type": (chartType === "bar") ? "column" : "spline",
            "yAxis": yAxisIndex,
            "name": titleLabel,
            "data": []
        };
        for(var i=0; i < sourceData.length; i++) {
            seriesItem.data.push({
                "y": sourceData[i][seriesKey],
                "x": moment.utc(sourceData[i].currentTime).unix() * 1000,
                "t": moment.utc(sourceData[i].currentTime)
            });
        }

        //_.sortBy(seriesItem, function(item) { return item.x });

        highchartsObj.series.push(seriesItem);
        yAxisIndex++;

        var yAxisesSize = highchartsObj.yAxis.length;
        addYAxis(highchartsObj, yAxisesSize, yAxisesSize % 2 !== 0, titleLabel);
    }
    return yAxisIndex;
}

/**
 * Function converts data to highcharts object
 * @access private
 * @param {object} widgetDTO - widget body
 * @param {array} results - chart calculated data
 * @returns {object}
 */
function convertToHighcharts(widgetDTO, results) {
    var forecastData = results[0];
    var energyData = results[1];

    var highchartsObj = {
        "yAxis": [],
        "xAxis": {
            "type": "datetime",
            "dateTimeLabelFormats": {
                "year": "%Y",
                "week": "%Y<br/>%m-%d",
                "second": "%Y-%m-%d<br/>%H:%M:%S",
                "month": "%Y-%m",
                "minute": "%Y-%m-%d<br/>%H:%M",
                "hour": "%Y-%m-%d<br/>%H:%M",
                "day": "%Y<br/>%m-%d"
            }
        },
        "tooltip": {
            "useHTML": true,
            "shared": true,
            "pointFormat": "<p style='text-align:center'>" +
                "<span style='color:{series.color}'>{series.name}</span>: <b>{point.y:.2f}</b></p>",
            "headerFormat": "{point.key}<br/>"
        },
        "title": {
            "text": null
        },
        "series": [],
        "plotOptions": {
            "spline": {
                "marker": {
                    "radius": 4,
                    "lineWidth": 1,
                    "lineColor": "#666666"
                }
            },
            "series": {
                "turboThreshold": 40000
            }
        },
        "legend": {
            "enabled": false
        },
        "exporting": {
            "enabled": false
        },
        "credits": {
            "enabled": false
        }
    };

    var yAxisIndex = 0;
    var params = widgetDTO.parameters;
    yAxisIndex = pushDataToSeries(highchartsObj, energyData, "kWh", "Generation",
        params.widgetGraphGeneration, params.widgetGraphGenerationChartType, yAxisIndex);
    yAxisIndex = pushDataToSeries(highchartsObj, energyData, "kW", "Current Power",
        params.widgetGraphCurrentPower, params.widgetGraphCurrentPowerChartType, yAxisIndex);
    yAxisIndex = pushDataToSeries(highchartsObj, energyData, "kWMax", "Max Power", params.widgetGraphMaxPower,
        params.widgetGraphMaxPowerChartType, yAxisIndex);
    yAxisIndex = pushDataToSeries(highchartsObj, forecastData, "humidity", "Humidity", params.widgetGraphHumidity,
        params.widgetGraphHumidityChartType, yAxisIndex);


    var LINE = "line";
    var BAR = "bar";

    //temperature
    if(!params.widgetGraphTemperature && params.widgetGraphWeather) {
        //if temperature = false, and weather = true, show temperature line chart with icons.
        yAxisIndex = pushIconLineDataToSeries(highchartsObj, forecastData, "temperature", "Weather", yAxisIndex);
    } else if(params.widgetGraphTemperature &&
        params.wIdgetGraphTemperatureChartType === LINE && !params.widgetGraphWeather) {
        //if temperatureLINE = true, and weather = false, show temperature line chart without icons.
        yAxisIndex = pushDataToSeries(highchartsObj, forecastData, "temperature",
            "Temperature", params.widgetGraphTemperature, LINE, yAxisIndex);
    } else if(params.widgetGraphTemperature &&
        params.wIdgetGraphTemperatureChartType === LINE && params.widgetGraphWeather) {
        //if temperatureLINE = true, and weather = true, show temperature line chart with icons.
        yAxisIndex = pushIconLineDataToSeries(highchartsObj, forecastData, "temperature", "Weather", yAxisIndex);
    } else if(params.widgetGraphTemperature &&
        params.wIdgetGraphTemperatureChartType === BAR && params.widgetGraphWeather) {
        // if temperatureBAR = true and weather = true show temperature bar chart and temperature line chart with icons.
        yAxisIndex = pushDataToSeries(highchartsObj, forecastData, "temperature",
            "Temperature", params.widgetGraphTemperature, BAR, yAxisIndex);//bar chart
        yAxisIndex--;//one axis for bar and line charts

        var lastIndex = highchartsObj.yAxis.length - 1;
        highchartsObj.yAxis.splice(lastIndex, 1);
        yAxisIndex = pushIconLineDataToSeries(highchartsObj, forecastData, "temperature", "Weather", yAxisIndex);
    } else if(params.widgetGraphTemperature &&
        params.wIdgetGraphTemperatureChartType === BAR && !params.widgetGraphWeather) {
        // if temperatureBAR = true, and weather = false, show tempearture bar chart.
        yAxisIndex = pushDataToSeries(highchartsObj, forecastData, "temperature",
            "Temperature", params.widgetGraphTemperature, BAR, yAxisIndex);//bar chart
    }

    for(var i=0; i < highchartsObj.series.length;i++) {
        highchartsObj.series[i].data.sort(compare);
    }

    widgetDTO = null;
    params = null;
    forecastData = null;
    energyData = null;
    results = null;
    return highchartsObj;

    //return forecastData;
}

/**
 * Function converts weather data
 * @access private
 * @param {object} err - error object
 * @param {array} results - tempoiq result
 * @param {object} widgetDTO - widget body
 * @param {function} finalCallback
 * @returns {void}
 */
function processForecastData(err, results, widgetDTO, finalCallback) {

    function uniqIterator(record) {
        return moment.utc(record.currentTime).unix();
    }

    if(err) {
        finalCallback(err, null);
    } else {

        var commonData = [];
        var divider =  results.length;
        var iconNumber = 0;

        for(var i=0; i< results.length; i++) {
            var forecastResult = forecastWrapper.getForecastDataByInterval(results[i],
                widgetDTO.parameters.widgetGraphInterval);

            for(var j = 0; j < forecastResult.length; j++) {

                if(commonData[j] === undefined) {
                    var newRecord = {
                        "currentTime": forecastResult[j].currentTime,
                        "temperature": forecastResult[j].temperature,
                        "humidity": forecastResult[j].humidity,
                        "pressure": forecastResult[j].pressure
                    };

                    iconNumber = parseInt(forecastResult[j].iconNumber);
                    newRecord.iconNumbers = {};
                    newRecord.iconNumbers[iconNumber] = 1;

                    //insert new
                    commonData.push(newRecord);
                } else {
                    commonData[j].temperature += forecastResult[j].temperature;
                    commonData[j].humidity += forecastResult[j].humidity;
                    commonData[j].pressure += forecastResult[j].pressure;
                    //commonData[j].iconNumber += parseInt(forecastResult[j].iconNumber);
                    iconNumber = parseInt(forecastResult[j].iconNumber);
                    if(commonData[j].iconNumbers[iconNumber]) {
                        commonData[j].iconNumbers[iconNumber]++;
                    }
                    else {
                        commonData[j].iconNumbers[iconNumber] = 1;
                    }
                }

            }

            results[i] = null;
        }

        commonData = _.uniq(commonData, uniqIterator);

        for(var index = 0 ; index < commonData.length; index++) {
            commonData[index].temperature = commonData[index].temperature / divider;
            commonData[index].humidity = commonData[index].humidity / divider;
            commonData[index].pressure = commonData[index].pressure / divider;

            var maxCount = 0;
            var maxIconNumber = 0;
            var iconNumbers = commonData[index].iconNumbers;
            if (_.size(iconNumbers) > 0) {
                for (iconNumber in iconNumbers) {
                    if(iconNumbers[iconNumber]) {
                        var iconCount = iconNumbers[iconNumber];
                        if (iconCount > maxCount) {
                            maxCount = iconCount;
                            maxIconNumber = iconNumber;
                        }
                    }
                }
            }

            commonData[index].iconNumber = maxIconNumber;
            commonData[index].icon = forecastConverter.getForecastTextByNumber(maxIconNumber);
        }

        finalCallback(null, commonData);
    }
}

/**
 * Function loads weather data from tempoiq
 * @access private
 * @param {object} widgetDTO - widget body
 * @param {array} tempoDBItems - tempoiq query data
 * @param {function} finalCallback
 * @returns {void}
 */
function loadForecastData(widgetDTO, tempoDBItems, finalCallback) {
    var loadAllExistingData = widgetDTO.parameters.widgetGraphDateRange === "All";
    log.info("loadForecastData");

    async.map(tempoDBItems, function(tempoDBItem, callback) {

        var selection = {
            "devices": {
                "attributes": {
                    Family: "Forecast",
                    Latitude: tempoDBItem.latitude.toString(),
                    Longitude: tempoDBItem.longitude.toString()
                }
            }
        };

        if(loadAllExistingData) {
            //load ell data
            tempoiq.loadAllExistingData(selection, null, tempoDBItem, callback);
        } else {
            tempoiq.loadData(tempoDBItem.startDate, tempoDBItem.endDate, selection, null, tempoDBItem, callback);
        }

    }, function (err, results) {
        processForecastData(err, results, widgetDTO, finalCallback);
    });
}

/**
 * Function converts energy data
 * @access private
 * @param {array} results - tempoiq result
 * @param {object} widgetDTO - widget body
 * @param {function} finalCallback
 * @returns {void}
 */
function processEnergyData(results, widgetDTO, finalCallback) {
    log.info("processEnergyData");

    var dtos = [],
        thisDates = null,
        allDates = [];

    //get data by each webbox and each sensor(inverter)
    for(var i = 0; i < results.length;i++) {
        //log.info("process: " + results[i].dataPoints.length);
        //log.info("process webbox: " + results[i].selection.devices.attributes.Device);
        var calc = new kWhCalculator(results[i].tempoIQParam, results[i].dataPoints);
        var currentData = calc.getEnergyDataByInterval(widgetDTO.parameters.widgetGraphInterval);

        thisDates = Object.keys(currentData.data);
        allDates.push.apply(allDates, thisDates);
        dtos.push(currentData);
        results[i] = null;
    }

    allDates = _.uniq(allDates);

    allDates.sort(function(a,b) {
        var dateA = new Date(a), dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
    });

    var combinedData = [];

    for (i = 0; i < allDates.length; i++) {

        combinedData.push({
            currentTime: allDates[i],
            "kWMax": 0,
            "kWh": 0,
            "kW": 0
        });

        for (var j = 0; j < dtos.length; j++) {

            if(dtos[j].data[allDates[i]]) {
                switch(dtos[j].metricName) {
                    case consts.METRIC_NAMES.kW:
                        combinedData[i].kW += dtos[j].data[allDates[i]].val;
                        break;
                    case consts.METRIC_NAMES.kWh:
                        combinedData[i].kWh += dtos[j].data[allDates[i]].val;
                        break;
                    case consts.METRIC_NAMES.WattsMax:
                        combinedData[i].kWMax += dtos[j].data[allDates[i]].max;
                        break;
                }
                //combinedData[i].kW += dtos[j][allDates[i]].kW;
                //combinedData[i].kWh += dtos[j][allDates[i]].kWh;
                //combinedData[i].kWMax += dtos[j][allDates[i]].kWMax;
            }
        }
    }



    dtos = null;
    allDates = null;

    finalCallback(null, combinedData);
}

/**
 * Function loads energy  data from tempoiq
 * @access private
 * @param {object} widgetDTO - widget body
 * @param {array} tempoDBItems - tempoiq query data
 * @param {function} finalCallback
 * @returns {void}
 */
function loadEnergyData(cachedData, presentation, widgetDTO, tempoDBItems, socket, finalCallback) {
    var loadAllExistingData = widgetDTO.parameters.widgetGraphDateRange === "All" && !cachedData.lastDate;
    log.info("loadEnergyData");

    //var webboxes = widgetDTO.presentation.webBox.split(",");
    async.map(tempoDBItems, function(tempoDBItem, callback) {

        var selection = {
            "devices": {
                "key": tempoDBItem.sensor
            },
            "sensors": {
                "key": tempoDBItem.type
            }
        };

        var pipeline = calcUtils.getTempoIQPipeline(true, tempoDBItem);

        if(loadAllExistingData) {
            //load ell data
            tempoiq.loadAllExistingData(selection, pipeline, tempoDBItem, callback);
        } else {

            if(cachedData.lastDate) {
                tempoDBItem.startDate = cachedData.lastDate;
            }

            if(!tempoDBItem.endDate) {
                tempoDBItem.endDate = moment.utc();
            }

            tempoiq.loadData(tempoDBItem.startDate, tempoDBItem.endDate, selection, pipeline, tempoDBItem, callback);
        }

    }, function (err, results) {
        if(err) {
            finalCallback(err, null);
        } else {

            results.push.apply(results, cachedData.tempoIQCachedResults);

            if(socket) {
                cacheUtils.setWidgetData(socket.id, presentation._id.toString(),
                    widgetDTO._id.toString(), results, function(cacheErr, cacheResult) {

                        if(cacheErr) {
                            finalCallback(cacheErr);
                        } else {
                            processEnergyData(results, widgetDTO, finalCallback);
                        }
                    });
            } else {
                processEnergyData(results, widgetDTO, finalCallback);
            }
        }
    });
}

/**
 * Entry point to the module, functions returns highcharts object for graph widget
 * @access public
 * @param {object} widgetDTO - widget body
 * @param {array} tempoDBItems - tempoiq query parameters
 * @param {object}response
 * @param {object} next obj
 * @returns {object}
 */
function calculateData(cachedData, widgetDTO, presentation, tempoDBItems, socket, finalCallback) {

    var tasks = [];

    tasks.push(function(callback) {
        if(widgetDTO.parameters.widgetGraphHumidity || widgetDTO.parameters.widgetGraphTemperature ||
            widgetDTO.parameters.widgetGraphWeather) {

            var forecastTempoDBItems = [];
            for(var i=0; i< tempoDBItems.length; i++) {
                if(tempoDBItems[i].latitude && tempoDBItems[i].longitude) {
                    forecastTempoDBItems.push(tempoDBItems[i]);
                }
            }

            loadForecastData(widgetDTO, forecastTempoDBItems, callback);
        } else {
            callback(null, []);
        }
    });



    tasks.push(function(callback) {
        if(widgetDTO.parameters.widgetGraphGeneration || widgetDTO.parameters.widgetGraphCurrentPower ||
            widgetDTO.parameters.widgetGraphMaxPower) {

            var energyTempoDBItems = [];
            var energyMetricsNames = [consts.METRIC_NAMES.kWh, consts.METRIC_NAMES.kW, consts.METRIC_NAMES.WattsMax];
            for(var i=0; i< tempoDBItems.length; i++) {
                if(energyMetricsNames.indexOf(tempoDBItems[i].metricName) > -1) {
                    //valid metric
                    energyTempoDBItems.push(tempoDBItems[i]);
                }
            }

            loadEnergyData(cachedData, presentation, widgetDTO, energyTempoDBItems, socket, callback);
        } else {
            callback(null, []);
        }
    });

    async.parallel(tasks, function(err, results){
        if(err) {
            utils.presentationErrorHandler(err, socket, finalCallback);
        } else {
            var highchartsObj = convertToHighcharts(widgetDTO, results);

            if(socket) {
                //send full data for that widget
                calcUtils.sendWidgetData(highchartsObj, presentation, widgetDTO, true, socket);
                highchartsObj = null;
            } else {
                finalCallback(null, highchartsObj);
            }
        }
    });
}

exports.calculateData = calculateData;
