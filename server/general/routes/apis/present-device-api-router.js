"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    presentDisplayDAO = require("../../core/dao/present-display-dao"),
    checkAuth = require("../../core/user/check-auth");

 /**
 * @api {get} /v1/presentdevices/available Get Available Device list
 * @apiGroup Present Display
 * @apiName Get Available Device list
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the All devices
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id":"5421ab10885c2846dcce983e",
 *          "deviceName":"Device1",
 *          "presentationId":"545f2abe649db6140038fc6a",
 *          "__v":0,
 *          "password":"test1234",
 *          "userPassword":"test1234",
 *          "userEmail":"dev.web@brightergy.com",
 *          "remoteApkPath":"remote apk path",
 *          "remoteUpdatePath":"http://test.com",
 *          "scheduleUpdateNewVersion":"version",
 *          "enableAutomaticUpdateNewVersion":true,
 *          "durationToAttemptReconnection":30000,
 *          "ftpPassword":"test1234",
 *          "ftpUsername":"test",
 *          "ftpHost":"brightergy.com",
 *          "preventSuspension":false,
 *          "timeIntervalToReport":60000,
 *          "timeIntervalToMonitorStatus":20000,
 *          "showStatusOnBrowser":true,
 *          "configureScheduleBrowserRestart":null,
 *          "enableScheduleBrowserRestart":false,
 *          "clearPasswords":false,
 *          "clearFormData":true,
 *          "clearHistory":true,
 *          "clearCookies":true,
 *          "clearSessions":true,
 *          "clearOfflineData":true,
 *          "clearCache":true,
 *          "timeOfExecution":"time of execution",
 *          "enableCleanup":true,
 *          "wifiOpenState":true,
 *          "wifiName":"wifiName",
 *          "wifiIpAddress":"182.20.3.0",
 *          "wifiState":true,
 *          "dns2":"dns2 string",
 *          "dns1":"dns1 string",
 *          "gateway":"gateWayA",
 *          "mask":"mask string",
 *          "ethernetIpAddress":"191.18.0.0",
 *          "ethernetIpType":"ipTypeA",
 *          "ethernetDevice":"deviceA",
 *          "ethernetState":true,
 *          "connectionType":"type1"
 *      }]
 * }
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/available", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            presentDisplayDAO.getAvailableDevices(currentUser, function(findErr, findObjects) {
                if (findErr) {
                    return next(findErr);
                } else {
                    return utils.successResponse(findObjects, res, next);
                }
            });
        }
    });
});

 /**
 * @api {get} /v1/presentdevices/logs Get Present device logs
 * @apiGroup Present Display
 * @apiName Get present device logs
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the All logs of present device
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id":"54d49a63b806256d1059cc29",
 *          "timestamp":"Mon Dec 01 2014 02:00:00 GMT+0200",
 *          "__v":0,
 *          "version":"v1",
 *          "totalUpTime":60000,
 *          "wsTrigger":25,
 *          "memUsage":2048,
 *          "wifiStatus":"wifi status",
 *          "ethernatStatus":"ethernet status",
 *          "count":12
 *      },{
 *          "_id":"54d49a63b806256d1059dc29",
 *          "timestamp":"Thu Jan 01 2015 02:00:00 GMT+0200",
 *          "__v":0,
 *          "version":"v2",
 *          "totalUpTime":120000,
 *          "wsTrigger":2500,
 *          "memUsage":4096,
 *          "wifiStatus":"disabled",
 *          "ethernatStatus":"enabled",
 *          "count":533
 *      }]
 * }
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/logs", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            presentDisplayDAO.getDeviceLogs(currentUser, function(findErr, findObjects) {
                if (findErr) {
                    return next(findErr);
                } else {
                    return utils.successResponse(findObjects, res, next);
                }
            });
        }
    });
});

 /**
 * @api {post} /v1/presentdevices/logs Create Device Log
 * @apiGroup Present Display
 * @apiName Create Device Log
 * @apiVersion 1.0.0
 * @apiDescription Create new device log
 * @apiParam {Object} body Device log object
 * @apiExample Example request
 *  body
 *  {
 *      "timestamp" : "2014-12-01T00:00:00.000Z",
 *      "count" : 1,
 *      "ethernatStatus" : "enabled",
 *      "wifiStatus" : "disabled",
 *      "__v" : 0,
 *      "memUsage" : 1024,
 *      "wsTrigger" : 10,
 *      "totalUpTime" : 300000,
 *      "version" : "v1"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created Log Object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id":"550bcdbf910c256e18759391",
 *          "timestamp":"2014-12-01T00:00:00.000Z",
 *          "__v":0,
 *          "version":"v1",
 *          "totalUpTime":300000,
 *          "wsTrigger":10,
 *          "memUsage":1024,
 *          "wifiStatus":"enabled",
 *          "ethernatStatus":"disabled",
 *          "count":1
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/logs", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var deviceLogObj = req.body;
            utils.removeMongooseVersionField(deviceLogObj);

            presentDisplayDAO.createLog(deviceLogObj, currentUser, function(err, result){
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
        }
    });
});

 /**
 * @api {put} /v1/presentdevices/:deviceId Update Device configuration
 * @apiGroup Present Display
 * @apiName Update Device
 * @apiVersion 1.0.0
 * @apiDescription Update device configuration
 * @apiParam {Object} body Device object
 * @apiExample Example request
 *  deviceId: 5421ab10885c2846dcce983e
 *  body
 *  {
 *      "_id" : "5421ab10885c2846dcce983e",
 *      "deviceName" : "Device3 updated",
 *      "connectionType" : "type1",
 *      "ethernetState" : true,
 *      "ethernetDevice" : "deviceC",
 *      "ethernetIpType" : "ipTypeA",
 *      "ethernetIpAddress" : "191.18.0.0",
 *      "mask" : "mask string",
 *      "gateway" : "gateWayA",
 *      "dns1" : "dns1 string",
 *      "dns2" : "dns2 string",
 *      "wifiState" : true,
 *      "wifiIpAddress" : "182.20.3.0",
 *      "wifiName" : "wifiName",
 *      "wifiOpenState" : true,
 *      "enableCleanup" : true,
 *      "timeOfExecution" : "time of execution",
 *      "clearCache" : true,
 *      "clearOfflineData" : true,
 *      "clearSessions" : true,
 *      "clearCookies" : true,
 *      "clearHistory" : true,
 *      "clearFormData" : true,
 *      "clearPasswords" : false,
 *      "enableScheduleBrowserRestart" : false,
 *      "configureScheduleBrowserRestart" : null,
 *      "showStatusOnBrowser" : true,
 *      "timeIntervalToMonitorStatus" : 20000,
 *      "timeIntervalToReport" : 60000,
 *      "preventSuspension" : false,
 *      "ftpHost" : "brightergy.com",
 *      "ftpUsername" : "test",
 *      "ftpPassword" : "test1234",
 *      "durationToAttemptReconnection" : 30000,
 *      "enableAutomaticUpdateNewVersion" : true,
 *      "scheduleUpdateNewVersion" : "version",
 *      "remoteUpdatePath" : "http://test.com",
 *      "remoteApkPath" : "remote apk path",
 *      "userEmail" : "dev.web@brightergy.com",
 *      "userPassword" : "test1234",
 *      "password" : "test1234",
 *      "presentationId" : "545f2abe649db6140038fc6a",
 *      "deviceId" : "68753A44-4D6F-1226-9C60-0050E4C00067",
 *      "deviceToken" : "FE66489F304DC75B8D6E8200DFF8A456E8DAEACEC428B427E9518741C92C6660",
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Update Device Object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id":"550bcdbf910c256e18759391",
 *          "deviceName" : "Device3",
 *          "connectionType" : "type1",
 *          "ethernetState" : true,
 *          "ethernetDevice" : "deviceC",
 *          "ethernetIpType" : "ipTypeA",
 *          "ethernetIpAddress" : "191.18.0.0",
 *          "mask" : "mask string",
 *          "gateway" : "gateWayA",
 *          "dns1" : "dns1 string",
 *          "dns2" : "dns2 string",
 *          "wifiState" : true,
 *          "wifiIpAddress" : "182.20.3.0",
 *          "wifiName" : "wifiName",
 *          "wifiOpenState" : true,
 *          "enableCleanup" : true,
 *          "timeOfExecution" : "time of execution",
 *          "clearCache" : true,
 *          "clearOfflineData" : true,
 *          "clearSessions" : true,
 *          "clearCookies" : true,
 *          "clearHistory" : true,
 *          "clearFormData" : true,
 *          "clearPasswords" : false,
 *          "enableScheduleBrowserRestart" : false,
 *          "configureScheduleBrowserRestart" : null,
 *          "showStatusOnBrowser" : true,
 *          "timeIntervalToMonitorStatus" : 20000,
 *          "timeIntervalToReport" : 60000,
 *          "preventSuspension" : false,
 *          "ftpHost" : "brightergy.com",
 *          "ftpUsername" : "test",
 *          "ftpPassword" : "test1234",
 *          "durationToAttemptReconnection" : 30000,
 *          "enableAutomaticUpdateNewVersion" : true,
 *          "scheduleUpdateNewVersion" : "version",
 *          "remoteUpdatePath" : "http://test.com",
 *          "remoteApkPath" : "remote apk path",
 *          "userEmail" : "dev.web@brightergy.com",
 *          "userPassword" : "test1234",
 *          "password" : "test1234",
 *          "presentationId" : "545f2abe649db6140038fc6a",
 *          "deviceId" : "68753A44-4D6F-1226-9C60-0050E4C00067",
 *          "deviceToken" : "FE66489F304DC75B8D6E8200DFF8A456E8DAEACEC428B427E9518741C92C6660",
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:deviceId", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var deviceId = req.params.deviceId;
            var deviceObj = req.body;

            utils.removeMongooseVersionField(deviceObj);

            presentDisplayDAO.editDevice(deviceId, deviceObj, currentUser, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
        }
    });
});

 /**
 * @api {post} /v1/presentdevices/ Create Device
 * @apiGroup Present Display
 * @apiName Create Device
 * @apiVersion 1.0.0
 * @apiDescription Create new device
 * @apiParam {Object} body Device object
 * @apiExample Example request
 *  body
 *  {
 *      "deviceName" : "Device4",
 *      "connectionType" : "type1",
 *      "ethernetState" : true,
 *      "ethernetDevice" : "deviceC",
 *      "ethernetIpType" : "ipTypeA",
 *      "ethernetIpAddress" : "191.18.0.0",
 *      "mask" : "mask string",
 *      "gateway" : "gateWayA",
 *      "dns1" : "dns1 string",
 *      "dns2" : "dns2 string",
 *      "wifiState" : true,
 *      "wifiIpAddress" : "182.20.3.0",
 *      "wifiName" : "wifiName",
 *      "wifiOpenState" : true,
 *      "enableCleanup" : true,
 *      "timeOfExecution" : "time of execution",
 *      "clearCache" : true,
 *      "clearOfflineData" : true,
 *      "clearSessions" : true,
 *      "clearCookies" : true,
 *      "clearHistory" : true,
 *      "clearFormData" : true,
 *      "clearPasswords" : false,
 *      "enableScheduleBrowserRestart" : false,
 *      "configureScheduleBrowserRestart" : null,
 *      "showStatusOnBrowser" : true,
 *      "timeIntervalToMonitorStatus" : 20000,
 *      "timeIntervalToReport" : 60000,
 *      "preventSuspension" : false,
 *      "ftpHost" : "brightergy.com",
 *      "ftpUsername" : "test",
 *      "ftpPassword" : "test1234",
 *      "durationToAttemptReconnection" : 30000,
 *      "enableAutomaticUpdateNewVersion" : true,
 *      "scheduleUpdateNewVersion" : "version",
 *      "remoteUpdatePath" : "http://test.com",
 *      "remoteApkPath" : "remote apk path",
 *      "userEmail" : "dev.web@brightergy.com",
 *      "userPassword" : "test1234",
 *      "password" : "test1234",
 *      "presentationId" : "545f2abe649db6140038fc6a",
 *      "deviceId" : "68753A44-4D6F-1226-9C60-0050E4C00067",
 *      "deviceToken" : "FE66489F304DC75B8D6E8200DFF8A456E8DAEACEC428B427E9518741C92C6660"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created Device Object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id" : "5421ab10885c2846dcce983e",
 *          "deviceName" : "Device3 updated",
 *          "connectionType" : "type1",
 *          "ethernetState" : true,
 *          "ethernetDevice" : "deviceC",
 *          "ethernetIpType" : "ipTypeA",
 *          "ethernetIpAddress" : "191.18.0.0",
 *          "mask" : "mask string",
 *          "gateway" : "gateWayA",
 *          "dns1" : "dns1 string",
 *          "dns2" : "dns2 string",
 *          "wifiState" : true,
 *          "wifiIpAddress" : "182.20.3.0",
 *          "wifiName" : "wifiName",
 *          "wifiOpenState" : true,
 *          "enableCleanup" : true,
 *          "timeOfExecution" : "time of execution",
 *          "clearCache" : true,
 *          "clearOfflineData" : true,
 *          "clearSessions" : true,
 *          "clearCookies" : true,
 *          "clearHistory" : true,
 *          "clearFormData" : true,
 *          "clearPasswords" : false,
 *          "enableScheduleBrowserRestart" : false,
 *          "configureScheduleBrowserRestart" : null,
 *          "showStatusOnBrowser" : true,
 *          "timeIntervalToMonitorStatus" : 20000,
 *          "timeIntervalToReport" : 60000,
 *          "preventSuspension" : false,
 *          "ftpHost" : "brightergy.com",
 *          "ftpUsername" : "test",
 *          "ftpPassword" : "test1234",
 *          "durationToAttemptReconnection" : 30000,
 *          "enableAutomaticUpdateNewVersion" : true,
 *          "scheduleUpdateNewVersion" : "version",
 *          "remoteUpdatePath" : "http://test.com",
 *          "remoteApkPath" : "remote apk path",
 *          "userEmail" : "dev.web@brightergy.com",
 *          "userPassword" : "test1234",
 *          "password" : "test1234",
 *          "presentationId" : "545f2abe649db6140038fc6a",
 *          "deviceId" : "68753A44-4D6F-1226-9C60-0050E4C00067",
 *          "deviceToken" : "FE66489F304DC75B8D6E8200DFF8A456E8DAEACEC428B427E9518741C92C6660"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var deviceObj = req.body;
            //utils.removeMongooseVersionField(deviceObj);

            presentDisplayDAO.createDevice(deviceObj, currentUser, function(err, result){
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
        }
    });
});

module.exports = router;
