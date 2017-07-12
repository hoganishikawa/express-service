/**
 * Created 10 Apr 2015
 */
"use strict";

var _ = require("lodash") || "",
    utils = require("../../../../libs/utils"),
    consts = require("../../../../libs/consts"),
    log = require("../../../../libs/log")(module) || "";
var deviceDao = require("../../../../general/core/dao/present-display-dao");


function process(presentationIds, deviceConfigs, socket) {

    log.debug("process: " + presentationIds);
    if (_.isEmpty(presentationIds)) {
        return;
    }

    var clientAns = new utils.ClientWebsocketAnswer(socket, consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceConfig);

    deviceDao.getDevicesByPresentationIds(presentationIds, function(err, data) {

        if (err) {
            log.error(err);
            return clientAns.error(err.message);
        }

        if (_.isEmpty(data)) {
            // no any devices
            log.silly("no any device");
            return;
        }

        var result = [];

        // we only return deviceConfigs, which version is more then our save version
        _.each(data, function(dev) {

            deviceConfigs[dev._id] = deviceConfigs[dev._id] || {};
            var saved =  deviceConfigs[dev._id];

            log.silly("device version: " + dev.version + ", saved.version: " + saved.version);
            if (saved.version && dev.version && dev.version === saved.version) {
                return;
            }

            result.push(dev);
            saved.version = dev.version;
        });

        if (!_.isEmpty(result)) {
            clientAns.send(result);
        }
    });
}


module.exports.process = process;
