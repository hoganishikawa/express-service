"use strict";

var utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    log = require("../../../libs/log")(module) || "",
    datasenseWidgetBodyParser = require("../../../bl-data-sense/core/calculation/widget/widget-body-parser"),
    brighterViewWidgetBodyParser = require("../../../bl-brighter-view/core/calculation/widget/widget-body-parser"),
    deviceConfigProcessor = require("../../../bl-brighter-view/core/calculation/presentation/device-config-processor"),
    deviceInfoProcessor = require("../../../bl-brighter-view/core/calculation/presentation/device-info-processor"),
    config = require("../../../config"),
    cronJob  = require("cron").CronJob;


/**
 * Function loads data for dashboard widgets and sends result to socket
 * @access private
 * @param {object} clientObject
 * @returns {void}
 */
function processDashboards(clientObject) {
    console.log("START DASHBOARDS");
    var socket = clientObject.socket;
    var dashboardsIds = clientObject.dashboards;
    var viewerTZOffset = clientObject.viewerTZOffset;

    dashboardsIds.forEach(function(dashboardId) {
        datasenseWidgetBodyParser.processDashboardBySocket(dashboardId, viewerTZOffset, socket);
    });
}


/**
 * Function loads data for presentation widgets and sends result to socket
 * @access private
 * @param {object} clientObject
 * @returns {void}
 */
function processPresentations(clientObject) {
    console.log("START PRESENTATIONS");
    var socket = clientObject.socket;
    var presentationsIds = clientObject.presentations;

    presentationsIds.forEach(function(presentationId) {
        brighterViewWidgetBodyParser.processPresentationBySocket(presentationId, socket);
    });
}


/**
 * Function loads all devices configurations which were modified since last
 * process
 *
 */
function processDeviceConfigs(clientObject) {
    log.debug("processDeviceConfigs");
    var socket = clientObject.socket;
    var presentationsIds = clientObject.presentations;
    var deviceConfigs = clientObject.deviceConfigs;

    deviceConfigProcessor.process(presentationsIds, deviceConfigs, socket);
}


/**
 * Function loads all devices configs and logs
 */
function processDeviceInfo(clientObject) {
    log.debug("processDeviceInfo");
    var deviceInfo = clientObject.deviceInfo;
    var socket = clientObject.socket;
    deviceInfoProcessor.process(deviceInfo, socket);
}


/**
 * Function defines server events and adds/removes client socket
 * @access public
 * @param {object} io - socket initial object
 * @returns {void}
 */
exports.run = function(io) {
    var clients = {};

    io.sockets.on("connection", function (socket) {

        console.log("SOCKET_CONNECTION:" + socket.id);

        clients[socket.id] = {
            socket: socket,
            dashboards: [],
            presentations: [],
            deviceConfigs: [],
            deviceInfo: {}
        };

        socket.emit("connected", { socketId: socket.id });

        socket.on("disconnect", function () {
            /*var clientObj = clients[socket.id];

            async.parallel([
                function(callback) {
                    cacheUtils.deleteAppEntitiesCache(socket.id, clientObj.dashboards, callback);
                },
                function(callback) {
                    cacheUtils.deleteAppEntitiesCache(socket.id, clientObj.presentations, callback);
                }
            ], function(err, results){
                if(err) {
                    utils.logError(err);
                }

                delete clients[socket.id];
                console.log("SOCKET_DISCONNECT: " +socket.id);
            });*/

            delete clients[socket.id];
            console.log("SOCKET_DISCONNECT: " +socket.id);
        });

        socket.on("getDashboardData", function (data) {
            if(!data.socketId || !data.dashboards || !data.viewerTZOffset) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.DASHBOARD_DATA, result);
            } else {
                clients[data.socketId].dashboards = data.dashboards;
                clients[data.socketId].viewerTZOffset = data.viewerTZOffset;
                processDashboards(clients[data.socketId]);
            }
        });

        socket.on("getPresentationData", function (data) {
            log.debug("getPresentationData");
            if(!data.socketId || !data.presentations) {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.PRESENTATION_DATA, result);
            } else {
                clients[data.socketId].presentations = data.presentations;
                processPresentations(clients[data.socketId]);
            }
        });

        socket.on(consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceConfig, function(data) {
            log.debug("DeviceConfig");
            deviceConfigProcessor.process(
                clients[data.socketId].presentations,
                clients[data.socketId].deviceConfigs,
                clients[data.socketId].socket
            );
        });

        socket.on(consts.WEBSOCKET_EVENTS.PRESENTATION.inputDeviceInfo, function(data) {
            if (data && data.presentations) {

                // clear old state
                clients[data.socketId].deviceInfo = {
                    presentations: data.presentations
                };

                deviceInfoProcessor.process(
                    clients[data.socketId].deviceInfo,
                    clients[data.socketId].socket
                );
            } else {
                var err = new Error("Incorrect input parameters");
                var result = new utils.serverAnswer(false, err);
                socket.emit(consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceInfo, result);
            }
        });

    });


    //start reading data and sending to client by cron job
    var websocketJob = new cronJob({
        cronTime: config.get("websocketsRestartCronTime"),
        onTick: function() {

            //console.log('CRON worker: ' + cluster.worker.id + ' clients: ' + _.size(clients));

            for(var socketId in clients) {
                if(clients[socketId]) {
                    var clientObject = clients[socketId];

                    processPresentations(clientObject);

                    processDashboards(clientObject);

                    processDeviceConfigs(clientObject);

                    processDeviceInfo(clientObject);
                }

            }
        },
        start: false
    });

    websocketJob.start();
};