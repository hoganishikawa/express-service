/**
 * Created 17 Apr 2015
 */
"use strict";

var _ = require("lodash") || "",
    async = require("async"),
    utils = require("../../../../libs/utils"),
    consts = require("../../../../libs/consts"),
    log = require("../../../../libs/log")(module) || "";
var deviceDao = require("../../../../general/core/dao/present-display-dao");


function compareWithSaved(newData, deviceInfo) {

    var deviceId = newData.deviceConfig.deviceId;
    log.silly("compareWithSaved: " + deviceId);

    deviceInfo[deviceId] = deviceInfo[deviceId] || {};

    var saved = deviceInfo[deviceId];

    if (_.isEqual(newData.deviceConfig, saved.deviceConfig)) {
        log.silly("deviceConfigs are equal");
    } else {
        log.silly("deviceConfigs are not equal");
    }

    // if we already have this information return empty
    if (_.isEqual(newData.deviceConfig, saved.deviceConfig) &&
        _.isEqual(newData.deviceLog, saved.deviceLog)) {
        return {};
    }

    saved.deviceConfig = newData.deviceConfig;
    saved.deviceLog = newData.deviceLog;

    return newData;
}


function getMongooseObject(mongooseObject) {
    var res = mongooseObject;
    if (mongooseObject.toObject) {
        res = mongooseObject.toObject();
    }
    res.id = res._id;
    delete res.__v;
    delete res._id;
    return res;
}


function process(deviceInfo, socket) {

    var presentationIds = deviceInfo.presentations;
    log.debug("process: " + presentationIds);

    if (_.isEmpty(presentationIds)) {
        return;
    }

    var clientAns = new utils.ClientWebsocketAnswer(socket, consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceInfo);

    deviceDao.getDevicesByPresentationIds(presentationIds, function(err, data) {

        if (err) {
            log.error(err);
            return clientAns.error(err.message);
        }

        if (_.isEmpty(data)) {
            log.silly("No any devices");
            return clientAns.error("no any devices");
        }

        var result = {};
        var deviceIds = [];

        // group by deviceId
        _.each(data, function(device) {
            log.debug("deviceId = " + device.deviceId);
            result[device.deviceId] = { deviceConfig: getMongooseObject(device) };
            deviceIds.push(device.deviceId);
        });

        async.map(
            deviceIds,
            deviceDao.getLatestLogForDevice,
            function(err, logs) {

                if (err) {
                    return clientAns.error((err.message));
                }

                _.each(logs, function(deviceLog) {
                    if (!deviceLog) {
                        return;
                    }
                    result[deviceLog.deviceId].deviceLog = getMongooseObject(deviceLog);
                });

                var answer = [];

                // test if we already sent such deviceInfo
                _.forOwn(result, function(info) {
                    answer.push(compareWithSaved(info, deviceInfo));
                });

                clientAns.send(answer);
            }
        );
    });
}


exports.process = process;
