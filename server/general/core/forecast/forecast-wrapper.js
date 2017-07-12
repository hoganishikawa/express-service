"use strict";

var request = require("request"),
    log = require("../../../libs/log")(module),
    _ = require("lodash"),
    tempoiq = require("../tempoiq/tempoiq-wrapper"),
    tagDAO = require("../dao/tag-dao"),
    config = require("../../../config/index"),
    parallelProcessing = config.get("parallelProcessing"),
    forecastApiKey = config.get("forecast:apiKey"),
    moment = require("moment"),
    async = require("async"),
    utils = require("../../../libs/utils"),
    nodeUtil = require("util"),
    BASE_TIME_URL = "https://api.forecast.io/forecast/%s/%s,%s,%s?exclude=%s",
    BASE_CURRENT_URL = "https://api.forecast.io/forecast/%s/%s,%s?exclude=%s",
    consts = require("../../../libs/consts"),
    excludeBlocks = "currently,flags",
    forecastConverter = require("./forecast-converter"),
    existingDeviceNames = [],
    bvCalcUtils = require("../../../bl-brighter-view/core/calculation/widget/calculator-utils");

/**
 * Function filters unique lat/long
 * @access private
 * @param {array} findSources
 * @returns {array}
 */
function filterSources(findSources) {
    var geoData = [];

    //custom distinct logic
    var exists = false;
    for(var i=0; i < findSources.length; i++) {
        exists = false;
        for(var j=0; j < geoData.length;j++) {
            if(geoData[j].latitude === findSources[i].latitude && geoData[j].longitude === findSources[i].longitude) {
                exists = true;
                break;
            }
        }

        if(!exists) {
            var geoDataItem = {
                oneYearData: false,
                latitude: findSources[i].latitude,
                longitude: findSources[i].longitude,
                endDate: moment.utc()
            };
            geoData.push(geoDataItem);
        }
    }

    return geoData;
}

/**
 * Function adds data to tempoiq data points object
 * @access private
 * @param {object} dataPoints
 * @param {string} deviceName
 * @param {string} metric
 * @param {object} t
 * @param {number} v
 * @returns {void}
 */
function addDataPoints(dataPoints, deviceName, metric, t, v) {
    if (!dataPoints[deviceName]) {
        dataPoints[deviceName] = {};
    }

    if (!dataPoints[deviceName][metric]) {
        dataPoints[deviceName][metric] = [];
    }

    dataPoints[deviceName][metric].push({
        t: t,
        v: v
    });
}

function getTempoDBBaseGeoKey(geoDataItem) {
    return "Forecast.Latitude:" + geoDataItem.latitude + ".Longitude:"+ geoDataItem.longitude;
}

/**
 * Function comverts weathe data to tempoiq format and writes to tempoiq
 * @access private
 * @param {object} geoDataItem
 * @param {object} answer - forecast data
 * @param {function} callback
 * @returns {void}
 */
function processForecastAnswer(geoDataItem, answer, callback) {
    var minutesOffset = 0;

    if (answer.offset) {
        var hours = parseFloat(answer.offset);
        minutesOffset = (hours * 60);
    }

    //log.info("offset %s", minutesOffset);

    var forecastTempoIQData = {};
    var tempoiqBaseKey = getTempoDBBaseGeoKey(geoDataItem);

    var metrics = ["PrecipIntensity", "PrecipProbability", "Temperature", "ApparentTemperature",
        "DewPoint", "Humidity", "WindSpeed", "WindBearing", "Visibility", "CloudCover", "Pressure",
        "Ozone", "Icon", "PrecipType", "SunriseTime", "SunsetTime", "PrecipIntensityMax",
        "PrecipIntensityMaxTime", "PrecipAccumulation", "TemperatureMin", "TemperatureMinTime",
        "TemperatureMax", "TemperatureMaxTime", "ApparentTemperatureMin", "ApparentTemperatureMinTime",
        "ApparentTemperatureMax", "ApparentTemperatureMaxTime"];

    var thisDevicesToCreate = {
        key: tempoiqBaseKey,
        attributes: {
            Family: "Forecast",
            Latitude: geoDataItem.latitude,
            Longitude: geoDataItem.longitude
        },
        sensors: []
    };

    for (var metricIndex = 0; metricIndex < metrics.length; metricIndex++) {
        thisDevicesToCreate.sensors.push({
            key: metrics[metricIndex]
        });
    }

    var dataBlock = null, dt = null, i = 0;


    // function to convert forecast values to tempoIq records
    // @param dataBlock - the object of forecast
    // @param td time
    // @param key - key in forecast data
    // @param value - if not defined that dataBlock[key] is used
    var addData = function(dataBlock, dt, key, value) {

        if (_.isUndefined(value)) {
            value = dataBlock[key];
        }

        if (_.isUndefined(value) || _.isNull(value)) {
            return;
        }

        // capitalize first letter
        var tempoiqKey = key.charAt(0).toUpperCase() + key.slice(1);

        addDataPoints(forecastTempoIQData, tempoiqBaseKey, tempoiqKey, dt, value);
    };


    if (answer && answer.hourly) {

        for (i = 0; i < answer.hourly.data.length; i++) {
            dataBlock = answer.hourly.data[i];
            dt = moment(dataBlock.time * 1000).add(minutesOffset, "minutes");

            addData(dataBlock, dt, "precipIntensity");
            addData(dataBlock, dt, "precipProbability");
            addData(dataBlock, dt, "temperature");
            addData(dataBlock, dt, "apparentTemperature");
            addData(dataBlock, dt, "dewPoint");
            addData(dataBlock, dt, "humidity");
            addData(dataBlock, dt, "windSpeed");
            addData(dataBlock, dt, "windBearing");
            addData(dataBlock, dt, "visibility");
            addData(dataBlock, dt, "cloudCover");
            addData(dataBlock, dt, "pressure");
            addData(dataBlock, dt, "ozone");
            addData(dataBlock, dt, "icon", forecastConverter.getForecastNumberByText(dataBlock.icon));
            addData(dataBlock, dt, "precipType", forecastConverter.getForecastNumberByText(dataBlock.precipType));
        }
    }

    if (answer && answer.daily) {

        for (i = 0; i < answer.daily.data.length; i++) {
            dataBlock = answer.daily.data[i];
            dt = moment(dataBlock.time * 1000).add(minutesOffset, "minutes");

            addData(dataBlock, dt, "sunriseTime");
            addData(dataBlock, dt, "sunsetTime");
            addData(dataBlock, dt, "precipIntensityMax");
            addData(dataBlock, dt, "precipIntensityMaxTime");
            addData(dataBlock, dt, "precipAccumulation");
            addData(dataBlock, dt, "temperatureMin");
            addData(dataBlock, dt, "temperatureMinTime");
            addData(dataBlock, dt, "temperatureMax");
            addData(dataBlock, dt, "temperatureMaxTime");
            addData(dataBlock, dt, "apparentTemperatureMin");
            addData(dataBlock, dt, "apparentTemperatureMinTime");
            addData(dataBlock, dt, "apparentTemperatureMax");
            addData(dataBlock, dt, "apparentTemperatureMaxTime");

            // if we have icon for every hour we don't need this icon
            if (!answer.hourly) {
                addData(dataBlock, dt, "icon", forecastConverter.getForecastNumberByText(dataBlock.icon));
            }
        }
    }

    //log.debug("answer: " + JSON.stringify(answer));
    //log.debug("dataBlock: " + JSON.stringify(dataBlock));
    //log.debug("forecastTempoiqData: " + JSON.stringify(forecastTempoIQData));

    tempoiq.createDevice(thisDevicesToCreate, existingDeviceNames, function(createDeviceErr, createdDevice) {
        if(createDeviceErr) {
            callback(createDeviceErr);
        } else {
            tempoiq.writeMultiDataPoints(forecastTempoIQData, callback);
        }
    });
}

/**
 * Function loads weather data for one day
 * @access private
 * @param {object} geoDataItem
 * @param {object} date
 * @param {function} callback
 * @returns {void}
 */
function loadForecastDataByDay(geoDataItem, date, callback) {
    //log.info("loadForecastDataByDay ");
    var timeStamp = date.unix();
    //log.info(timeStamp);

    var currentUrl = nodeUtil.format(BASE_TIME_URL, forecastApiKey,
        geoDataItem.latitude, geoDataItem.longitude, timeStamp, excludeBlocks);

    request.get({
        uri:currentUrl
    },function(err,res,body){
        if(err) {
            err.name = "ForecastError";
            err.currentUrl = currentUrl;
            utils.logError(err);
            //even if this day failed, need process other days
            callback(null);
        } else {
            var forecastAnswer = JSON.parse(body);
            processForecastAnswer(geoDataItem, forecastAnswer, callback);
        }
    });
}

/**
 * Function loads weather data for one day
 * @access private
 * @param {object} geoDataItem
 * @param {object} date
 * @param {function} callback
 * @returns {void}
 */
function loadCurrentForecastData(geoDataItem, callback) {
    var timeStamp = moment().unix();

    var currentUrl = nodeUtil.format(BASE_TIME_URL, forecastApiKey,
        geoDataItem.latitude, geoDataItem.longitude, timeStamp, excludeBlocks);

    request.get({
        uri:currentUrl
    },function(err,res,body){
        if(err) {
            err.name = "ForecastError";
            err.currentUrl = currentUrl;
            utils.logError(err);
            callback(err, null);
        } else {
            var forecastAnswer = JSON.parse(body);
            var retObj = {};
            for (var i = 0; i < forecastAnswer.hourly.data.length; i++) {
                if ((forecastAnswer.hourly.data[i].time < timeStamp) &&
                    (timeStamp <= forecastAnswer.hourly.data[i+1].time)) {
                    retObj = forecastAnswer.hourly.data[i];
                }
            }
            callback(null, retObj);
        }
    });
}

/**
 * Function returns data by each day for period
 * @access private
 * @param {object} geoDataItem
 * @returns {array}
 */
function getDatesByGeoDataItem(geoDataItem) {
    //log.info("iso: %s", geoDataItem.endDateISO);
    var endDate = geoDataItem.endDate, startDate = null;
    log.info("endDate1: %s", endDate.toISOString());

    if(geoDataItem.oneYearData) {
        startDate = endDate.clone().add(-1, "years");
    } else {
        startDate = endDate.clone().add(-1, "d");
    }

    //log.info("startDate: %s", startDate.toISOString());
    //log.info("endDate2: %s", endDate.toISOString());

    var dates = [];
    while (endDate >= startDate) {
        dates.push(startDate.clone());
        startDate.add(1, "d");
    }


    //log.info("dates  size %s",dates.length);
    //log.info("dates  first %s",dates[0].toISOString());
    //log.info("dates  last %s",dates[dates.length -1].toISOString());
    //log.info("dates: start %s  end %s", startDate.toISOString(), endDate.toISOString());

    return dates;
}

/**
 * Function process one lat.long combination
 * @access private
 * @param {object} geoDataItem
 * @param {function} finalCallback
 * @returns {void}
 */
function processGeoDataItem(geoDataItem, finalCallback) {
    var datesByDay = getDatesByGeoDataItem(geoDataItem);

    //load data by each day

    async.eachLimit(datesByDay, parallelProcessing, function(date, thisCallback) {
        loadForecastDataByDay(geoDataItem, date, thisCallback);
    }, function(err) {
        if(err) {
            utils.logError(err);
        }
        //even if this geo data item failed, need process other items
        finalCallback();
    });
}

/**
 * Function reads weather data from forecast.io and writes to tempoiq
 * @access public
 * @param {object} sourceObject - object, that lat/long need use
 * @returns {object}
 */
function loadDataAndWriteToTempoDB(sourceObject) {
    console.log("loadDataAndWriteToTempoDB");
    //if sourceObject -> load year data for that sourceObject
    if(sourceObject) {
        var geoDataItem = {
            oneYearData: true,
            latitude: sourceObject.latitude,
            longitude: sourceObject.longitude,
            endDate: moment.utc()
        };

        processGeoDataItem(geoDataItem, function (err) {
            if(err) {
                utils.logError(err);
            }
            //console.log("COMPLETED_PRESENTATION_processGeoDataItem");
        });
    } else {
        var params = {
            $and: [{latitude: {$ne:null}},
                {longitude: {$ne:null}}
            ]
        };

        async.waterfall([
                function (callback) {
                    tagDAO.getTagsByParams(params, callback);
                },
                function (findDataSources, callback) {
                    var geoData = filterSources(findDataSources);
                    callback(null, geoData);
                }
            ],
            function (err, geoData) {
                if (err) {
                    utils.logError(err);
                } else {

                    tempoiq.getDevicesByFamily("Forecast", function(getDeviceErr, foundDevices) {
                        if(getDeviceErr) {
                            utils.logError(getDeviceErr);
                        } else {

                            existingDeviceNames = _.map(foundDevices, function(dev) {
                                return dev.key;
                            });

                            async.eachLimit(geoData, parallelProcessing, processGeoDataItem, function (processErr) {
                                if (processErr) {
                                    utils.logError(processErr);
                                }

                                log.info("loadDataAndWriteToTempoDB final callback");
                            });
                        }
                    });
                }
            });
    }
}

function getTempoIQAnswerKey(selection) {
    var attr = selection.devices.attributes;
    return "Forecast.Latitude:" + attr.Latitude + ".Longitude:"+ attr.Longitude;
}

function getValueByType(source, rootKey, fieldType) {
    /*for(prop in source) {
        var start = prop.indexOf("Type:");
        var substr = prop.substring(start + 5, prop.length -1);

        if(substr === fieldType) {
            return source[prop];
        }
    }
    return null;
    */
    return source[rootKey][fieldType];
}

/**
 * Function returns weather data in common format for each hour
 * @access private
 * @param {object} tempodbAnswer
 * @returns {array}
 */
function getForecastDataByHour(tempodbAnswer) {
    var graphDataList = [];

    var rootKey = getTempoIQAnswerKey(tempodbAnswer.selection);

    for(var i = 0; i <  tempodbAnswer.dataPoints.length;i++) {
        var currentTemp = getValueByType(tempodbAnswer.dataPoints[i].values, rootKey, consts.temperature);
        var currentHumidity = getValueByType(tempodbAnswer.dataPoints[i].values, rootKey, consts.humidity);
        var currentPressure = getValueByType(tempodbAnswer.dataPoints[i].values, rootKey, consts.pressure);
        var currentIconNumber = getValueByType(tempodbAnswer.dataPoints[i].values, rootKey, consts.icon);

        graphDataList.push({
            "currentTime": moment.utc(tempodbAnswer.dataPoints[i].ts).minute(0).second(0).millisecond(0),
            "temperature": currentTemp,
            "humidity": currentHumidity,
            "pressure": currentPressure,
            "icon": forecastConverter.getForecastTextByNumber(currentIconNumber),
            "iconNumber": currentIconNumber
        });
    }

    return graphDataList;
}

/**
 * Function returns weather data in common format by interval
 * @access private
 * @param {object} tempodbAnswer
 * @param {string} interval
 * @returns {array}
 */
function getForecastDataByInterval(tempodbAnswer, interval) {

    if(interval === "Hourly") {
        return getForecastDataByHour(tempodbAnswer);
    } else {
        var rootKey = getTempoIQAnswerKey(tempodbAnswer.selection);
        var graphDataList = [];
        if (tempodbAnswer.dataPoints.length > 0) {
            //var startDay = new Date(tempodbAnswer.dataPoints[0].t).getDate();
            var start = utils.getDateByInterval(tempodbAnswer.dataPoints[0].ts, interval);

            var temperature = 0;
            var humidity = 0;
            var pressure = 0;
            var temperatureDayCount = 0;
            var humidityDayCount = 0;
            var pressureDayCount = 0;
            var totalIconNumber = 0;

            var iconsCountMap = {};
            var dateForecast = null;
            var max = 0, iconNumber = null, currentValue = null;
            for (var i = 0; i < tempodbAnswer.dataPoints.length; i++) {

                var currentTemp = getValueByType(tempodbAnswer.dataPoints[i].values, rootKey, consts.temperature);
                var currentHumidity = getValueByType(tempodbAnswer.dataPoints[i].values, rootKey, consts.humidity);
                var currentPressure = getValueByType(tempodbAnswer.dataPoints[i].values, rootKey, consts.pressure);
                var currentIconNumber = null;

                if (utils.compareDatesByInterval(start, tempodbAnswer.dataPoints[i].ts, interval)) {
                    currentIconNumber = getValueByType(tempodbAnswer.dataPoints[i].values, rootKey, consts.icon);
                    if(currentIconNumber === 1) {
                        currentIconNumber = null;
                    }

                    if (currentTemp) {
                        temperature += currentTemp;
                        temperatureDayCount++;
                    }
                    if (currentHumidity) {
                        humidity += currentHumidity;
                        humidityDayCount++;
                    }
                    if (currentPressure) {
                        pressure += currentPressure;
                        pressureDayCount++;
                    }
                    if (currentIconNumber) {
                        var iconCount = iconsCountMap[currentIconNumber];
                        if (iconCount) {
                            //log.info("increase %s", currentIconNumber);
                            iconsCountMap[currentIconNumber]++;
                        } else {
                            //log.info("added new %s", currentIconNumber);
                            iconsCountMap[currentIconNumber] = 1;
                        }
                    }

                    if (interval === "Daily") {
                        dateForecast = tempodbAnswer.dataPoints[i].ts;
                    } else if (interval === "Weekly") {
                        dateForecast = start;
                    } else if(interval === "Monthly") {
                        dateForecast = start;
                    } else if(interval === "Yearly") {
                        dateForecast = start;
                    }
                } else {
                    //startDay = new Date(tempodbAnswer.dataPoints[i].t).getDate()
                    start = utils.getDateByInterval(tempodbAnswer.dataPoints[i].ts, interval);
                    if (temperatureDayCount !== 0) {
                        temperature = temperature / temperatureDayCount;
                    }
                    if (humidityDayCount !== 0) {
                        humidity = humidity / humidityDayCount;
                    }
                    if (pressureDayCount !== 0) {
                        pressure = pressure / pressureDayCount;
                    }

                    max = 0;
                    if (_.size(iconsCountMap) > 0) {
                        for (iconNumber in iconsCountMap) {
                            if(iconsCountMap[iconNumber]) {
                                currentValue = iconsCountMap[iconNumber];
                                if (currentValue > max) {
                                    max = currentValue;
                                    totalIconNumber = iconNumber;
                                }
                            }
                        }
                    }

                    graphDataList.push({
                        "currentTime": moment.utc(dateForecast).hour(0).minute(0).second(0).millisecond(0),
                        "temperature": temperature,
                        "humidity": humidity,
                        "pressure": pressure,
                        "icon": forecastConverter.getForecastTextByNumber(totalIconNumber),
                        "iconNumber": totalIconNumber
                    });

                    if (currentTemp) {
                        temperature = currentTemp;
                        temperatureDayCount = 1;
                    }
                    if (currentHumidity) {
                        humidity = currentHumidity;
                        humidityDayCount = 1;
                    }
                    if (currentPressure) {
                        pressure = currentPressure;
                        pressureDayCount = 1;
                    }
                }

                tempodbAnswer.dataPoints[i].values = null;
                tempodbAnswer.dataPoints[i].ts = null;
                tempodbAnswer.dataPoints[i] = null;
            }
            //log.info(iconsCountMap);

            //write last
            if (temperatureDayCount !== 0) {
                temperature = temperature / temperatureDayCount;
            }
            if (humidityDayCount !== 0) {
                humidity = humidity / humidityDayCount;
            }
            if (pressureDayCount !== 0) {
                pressure = pressure / pressureDayCount;
            }

            max = 0;
            if (_.size(iconsCountMap) > 0) {
                for (iconNumber in iconsCountMap) {
                    if(iconsCountMap[iconNumber]) {
                        currentValue = iconsCountMap[iconNumber];
                        if (currentValue > max) {
                            max = currentValue;
                            totalIconNumber = iconNumber;
                        }
                    }
                }
            }
            graphDataList.push({
                "currentTime": moment.utc(dateForecast).hour(0).minute(0).second(0).millisecond(0),
                "temperature": temperature,
                "humidity": humidity,
                "pressure": pressure,
                "icon": forecastConverter.getForecastTextByNumber(totalIconNumber),
                "iconNumber": totalIconNumber
            });

        }

        tempodbAnswer.dataPoints = null;
        tempodbAnswer = null;
        return graphDataList;
    }
}

/**
 * Function calculated widget data from forecast result
 * @access public
 * @param {object} results - forecast answer
 * @returns {object}
 */
function processForecastAnswers(results) {
    var commonData = {
        currently: {},
        daily: {
            data: []
        }
    };
    var divider = results.length;
    var prop = null;
    var dayNumber = null;

    for (var i = 0; i < results.length; i++) {

        if (i === 0) {
            //insert new

            //console.log('NEW:')

            for (prop in results[i].currently) {
                if(results[i].currently[prop]) {
                    commonData.currently[prop] = results[i].currently[prop];
                }
            }


            for (dayNumber = 0; dayNumber < results[i].daily.data.length; dayNumber++) {

                if (commonData.daily.data[dayNumber] === undefined) {
                    commonData.daily.data[dayNumber] = {};
                }

                if (!commonData.daily.data[dayNumber].currentTime) {
                    commonData.daily.data[dayNumber].currentTime = results[i].daily.data[dayNumber].time;
                }

                if (!commonData.daily.data[dayNumber].icon) {
                    commonData.daily.data[dayNumber].icon = results[i].daily.data[dayNumber].icon;
                }

                if (results[i].daily.data[dayNumber].temperatureMax) {
                    commonData.daily.data[dayNumber].temperatureMax = results[i].daily.data[dayNumber].temperatureMax;
                }

                if (results[i].daily.data[dayNumber].temperatureMin) {
                    commonData.daily.data[dayNumber].temperatureMin = results[i].daily.data[dayNumber].temperatureMin;
                }
            }


        } else {

            //console.log('EXISTING')

            for (prop in results[i].currently) {
                if(results[i].currently[prop]) {
                    if (utils.isNumber(results[i].currently[prop])) {
                        if (commonData.currently[prop] === undefined) {
                            commonData.currently[prop] = results[i].currently[prop];
                        } else {
                            commonData.currently[prop] += results[i].currently[prop];
                        }
                    }
                }
            }

            for (dayNumber = 0; dayNumber < results[i].daily.data.length; dayNumber++) {

                if (commonData.daily.data[dayNumber] === undefined) {
                    commonData.daily.data[dayNumber] = {};
                }

                if (!commonData.daily.data[dayNumber].currentTime) {
                    commonData.daily.data[dayNumber].currentTime = results[i].daily.data[dayNumber].time;
                }

                if (!commonData.daily.data[dayNumber].icon) {
                    commonData.daily.data[dayNumber].icon = results[i].daily.data[dayNumber].icon;
                }

                if (results[i].daily.data[dayNumber].temperatureMax) {
                    if (commonData.daily.data[dayNumber].temperatureMax) {
                        commonData.daily.data[dayNumber].temperatureMax +=
                            results[i].daily.data[dayNumber].temperatureMax;
                    } else {
                        commonData.daily.data[dayNumber].temperatureMax =
                            results[i].daily.data[dayNumber].temperatureMax;
                    }

                }
                if (results[i].daily.data[dayNumber].temperatureMin) {
                    if (commonData.daily.data[dayNumber].temperatureMin) {
                        commonData.daily.data[dayNumber].temperatureMin +=
                            results[i].daily.data[dayNumber].temperatureMin;
                    } else {
                        commonData.daily.data[dayNumber].temperatureMin =
                            results[i].daily.data[dayNumber].temperatureMin;
                    }

                }
            }


        }

        //results[i] = null;
    }

    for (prop in commonData.currently) {
        if (utils.isNumber(commonData.currently[prop])) {
            commonData.currently[prop] = commonData.currently[prop] / divider;
        }
    }

    for (dayNumber = 0; dayNumber < commonData.daily.data.length; dayNumber++) {

        if (commonData.daily.data[dayNumber].temperatureMax) {
            commonData.daily.data[dayNumber].temperatureMax = commonData.daily.data[dayNumber].temperatureMax / divider;
        }
        if (commonData.daily.data[dayNumber].temperatureMin) {
            commonData.daily.data[dayNumber].temperatureMin = commonData.daily.data[dayNumber].temperatureMin / divider;
        }

    }

    return commonData;
}

/**
 * Function calculates data from each forecast result and sends it via websocket
 * @access public
 * @param {object} err - tempoiq query parameters
 * @param {object} forecastItem
 * @param {object} widget
 * @param {object} presentation
 * @param {object} socket
 * @param {function} callback
 * @returns {void}
 */
function processForecastItem(err, totalForecastItems, forecastItem, widget, presentation, socket, callback) {
    if(err) {
        callback(err);
    } else {
        if(socket) {
            totalForecastItems.push(forecastItem);
            var loadedData = processForecastAnswers(totalForecastItems);
            bvCalcUtils.sendWidgetData(loadedData, presentation, widget, false, socket);
            //sendWeatherWidgetData(loadedData, presentation, false, socket);
        }

        callback(null, forecastItem);
    }
}

/**
 * Function returns current weather data  for brighterview weather widget
 * @access public
 * @param {object} tempoDBItems - tempoiq query parameters
 * @param {object} response
 * @param {object} next
 * @returns {object}
 */
function getWeatherWidgetData(widget, presentation, tempoDBItems, socket, finalCallback) {
    log.info("getWeatherWidgetData");
    var thisExcludeBlocks = "hourly,minutely,flags";

    if(tempoDBItems.length === 0) {
        var error = new Error("Please add latitude and longitude to at least one sensor");
        error.status = 422;
        utils.presentationErrorHandler(error, socket, finalCallback);
    } else {

        tempoDBItems = _.uniq(tempoDBItems, function(item) {
            return item.latitude && item.longitude;
        });

        var totalForecastItems = [];

        async.map(tempoDBItems, function (tempoDBItem, callback) {

            var currentUrl = nodeUtil.format(BASE_CURRENT_URL, forecastApiKey,
                tempoDBItem.latitude, tempoDBItem.longitude, thisExcludeBlocks);

            request.get({
                uri: currentUrl
            }, function (err, res, body) {
                if (err) {
                    callback(err);
                } else {
                    var forecastAnswer = JSON.parse(body);
                    if (forecastAnswer && forecastAnswer.currently) {
                        processForecastItem(null, totalForecastItems, forecastAnswer,
                            widget, presentation, socket, callback);
                    } else {
                        processForecastItem(
                            new Error("Forecast answer wrong: " + forecastAnswer.error)
                        );
                    }
                }
            });

        }, function (err, results) {
            if (err) {
                utils.presentationErrorHandler(err, socket, finalCallback);
            } else {
                var loadedData = processForecastAnswers(results);

                results = null;
                totalForecastItems = null;

                if(socket) {
                    bvCalcUtils.sendWidgetData(loadedData, presentation, widget, true, socket);
                    //sendWeatherWidgetData(loadedData, presentation, true, socket);
                } else {
                    finalCallback(null, loadedData);
                }
                //return utils.successResponse(commonData, response, next);
            }
        });
    }
}

exports.getWeatherWidgetData = getWeatherWidgetData;
exports.getForecastDataByInterval = getForecastDataByInterval;
exports.loadDataAndWriteToTempoDB = loadDataAndWriteToTempoDB;
exports.loadCurrentForecastData = loadCurrentForecastData;
exports.loadForecastDataByDay = loadForecastDataByDay;

// for UT only
exports._processForecastAnswer = processForecastAnswer;
