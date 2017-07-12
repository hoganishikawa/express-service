"use strict";

var log = require("../../../libs/log")(module),
    config = require("../../../config/index"),
    moment = require("moment"),
    tempoiq = require("tempoiq"),
    utils = require("../../../libs/utils"),
    _ = require("lodash"),
    //os = require("os"),
    //cpus = os.cpus(),
    client = new tempoiq.Client(config.get("tempoiq:apiKey"),
        config.get("tempoiq:apiSecret"),
        config.get("tempoiq:host")
    );

/*function profilingCPU(logTitle) {
    var type;

    console.log(logTitle);

    for (var i=0, len = cpus.length; i < len; i++) {
        console.log('CPU %s:',i);
        var cpu = cpus[i], total = 0;

        for (type in cpu.times) {
            total += cpu.times[type];
        }

        for (type in cpu.times) {
            console.log("\t", type, Math.round(100 * cpu.times[type] / total));
        }
    }
}*/

/**
 * Function writes data to tempoiq
 * @access public
 * @param {object} dataPoints
 * @param {function} callback
 * @returns {void}
 */
function writeMultiDataPoints(dataPoints, callback) {
    if(_.size(dataPoints) > 0) {

        client.writeBulk(dataPoints, function (err, result) {
            if (err) {
                log.error("WRITING DATA POINTS AGAIN. ERROR: %s", err.message);
                /*//even if writing failed, we need try write other data points, so pass null to callback
                 if (fileName) {
                 log.error("file: %s", fileName);
                 console.log(dataPoints)
                 }
                 utils.logError(err);
                 */
                writeMultiDataPoints(dataPoints, callback);

            } else {
                //console.log("DATA POINTS WRITED");
                dataPoints = null;
                callback(null);
            }
        });
    } else {
        callback(null);
    }
}

/**
 * Function writes data to tempoiq only onetime
 * @access public
 * @param {object} dataPoints
 * @param {function} callback
 * @returns {void}
 */
function writeDataPoints(dataPoints, callback) {
    if(_.size(dataPoints) > 0) {

        client.writeBulk(dataPoints, function (err, result) {
            if (err) {
                log.error("WRITING DATA POINTS ERROR: %s", err.message);
                callback(err);
            } else {
                console.log("DATA POINTS WRITED FROM UPLOADED DATA");

                var returnObj = {
                    "dataPoints": dataPoints,
                    "result" : result
                };

                dataPoints = null;
                callback(null, returnObj);
            }
        });
    } else {
        callback(null);
    }
}

/**
 * Function creates new device in tempoiq
 * @access public
 * @param {object} device
 * @param {array} existing device names
 * @param {function} callback
 * @returns {void}
 */
function createDevice(device, globalDevicesNames, callback) {

    var found = globalDevicesNames.indexOf(device.key) > -1;

    if(!found) {
        client.createDevice(device, function (err, result) {
            if (err) {
                if(err.message.indexOf("A device with that key already exists") < 0) {
                    err.deviceToCreate = device;
                    utils.logError(err);
                } else {
                    //log.info("DEVICE_ALREADY_CREATED: " + device.key);
                    if(globalDevicesNames.indexOf(device.key) < 0) {
                        globalDevicesNames.push(device.key);
                    }
                }
            } else {
                //log.info("CREATED DEVICE:" + device.key);
                globalDevicesNames.push(device.key);
            }
            callback(null);
        });
    } else {
        callback(null);
    }
}

/**
 * Function reads data from tempoiq
 * @access private
 * @param {string} startDateStr
 * @param {string} endDateStr
 * @param {object} selection
 * @param {object} pipeline
 * @param {function} callback
 * @returns {void}
 */
function readMulti(startDateStr, endDateStr, selection, pipeline, tempoIQParam, callback) {

    //var startTime = new Date();

    //log.info("startDateStr %s", startDateStr);
    //log.info("endDateStr %s", endDateStr);

    if(pipeline && pipeline.functions) {
        for (var i=0; i < pipeline.functions.length; i++) {
            pipeline.functions[i].arguments.push(startDateStr);
        }
    }

    if(pipeline && pipeline.functions && pipeline.functions.length === 0) {
        pipeline = null;
    }

    //profilingCPU('readMulti Before');

    client.read(selection, startDateStr, endDateStr, pipeline,  {
        streamed: true
    }, function (cursor) {

        /*if(err) {
            console.log("TEMPOIQ_ERR", err);
            callback(err);
        } else {
            console.log("DATA READED");
            var obj = {
                "dataPoints":data,
                "selection": selection,
                "tempoIQParam": tempoIQParam
            };

            callback(null, obj);
        }*/

        //profilingCPU('readMulti Start');

        var tempoiqData = [];
        cursor.on("data", function (data) {
            tempoiqData.push(data);
            //profilingCPU('readMulti Reading Data From TempoIQ');
        });

        cursor.on("end", function () {
            //console.log("DATA READED");
            //profilingCPU('readMulti Readed Data From TempoIQ');
            var obj = {
                "dataPoints":tempoiqData,
                "selection": selection,
                "tempoIQParam": tempoIQParam
            };

            //var endTime = new Date();

            //log.error("TEMPOIQ READING: " + (endTime - startTime) / 1000);

            callback(null, obj);
        });

        cursor.on("error", function (cursorErr) {
            callback(cursorErr);
        });

    });
}

function loadData(startDate, endDate, selection, pipeline, tempoIQParam, callback) {
    //log.info("findImages");
    readMulti(startDate.toISOString(), endDate.toISOString(), selection, pipeline, tempoIQParam, callback);
}

function loadAllExistingData(selection, pipeline, tempoIQParam, callback) {
    //log.info("loadAllExistingData");
    var end = moment.utc().toISOString();
    readMulti("2000-01-01", end, selection, pipeline, tempoIQParam, callback);
}

/**
 * Function returns tempoiq devices by family
 * @access private
 * @param {string} family
 * @param {function} callback
 * @returns {void}
 */
function getDevicesByFamily(family, callback) {

    var selection = {
        "devices": {
            "attributes": {"Family": family}
        }
    };

    client.listDevices(selection, {
        streamed: false
    }, function (err, data) {

        if(err) {
            callback(err);
        } else {
            callback(null, data);
        }

        /*var foundDevices = [];
         cursor.on("data", function (data) {
         foundDevices.push(data);
         })

         cursor.on("end", function () {
         callback(null, foundDevices);
         })

         cursor.on("error", function (cursorErr) {
         callback(cursorErr);
         })
         */

    });
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

function getLastValue(selection, callback) {

    client.single(selection, "latest", null, null, function(err, data) {
        if (err) {
            callback(err);
        } else {
            var obj = {
                "dataPoints": data,
                "selection": selection,
            };

            callback(null, obj);
        }
    });
}

function getFirstValue(selection, callback) {

    client.single(selection, "earliest", null, null, function(err, data) {
        if (err) {
            callback(err);
        } else {
            var obj = {
                "dataPoints": data,
                "selection": selection,
            };

            callback(null, obj);
        }
    });
}

exports.writeMultiDataPoints = writeMultiDataPoints;
exports.writeDataPoints = writeDataPoints;
exports.loadData = loadData;
exports.loadAllExistingData = loadAllExistingData;
exports.getDevicesByFamily = getDevicesByFamily;
exports.createDevice = createDevice;
exports.addDataPoints = addDataPoints;
exports.getLastValue = getLastValue;
exports.getFirstValue = getFirstValue;
