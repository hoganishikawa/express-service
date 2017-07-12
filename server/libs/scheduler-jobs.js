"use strict";

var config = require("../config"),
    cronJob  = require("cron").CronJob,
    awsAssetsUtils = require("../general/core/aws/assets-utils"),
    salesforceDataLoader = require("../general/core/salesforce/data-loader"),
    forecastWrapper = require("../general/core/forecast/forecast-wrapper"),
    tagDAO = require("../general/core/dao/tag-dao");

function start() {

    var generalAssetsKeyPrefix = config.get("aws:assets:generalAssetsKeyPrefix");
    awsAssetsUtils.storeImagesInCache(generalAssetsKeyPrefix);
    
    salesforceDataLoader.loadAllSalesforceData();

    var salesforceJob = new cronJob({
        cronTime: config.get("salesforce:loadDataCronTime"),
        onTick: function() {
            salesforceDataLoader.loadAllSalesforceData();
        },
        start: false
    });
    
    salesforceJob.start();
    
    forecastWrapper.loadDataAndWriteToTempoDB();

    var forecastJob = new cronJob({
        cronTime: config.get("forecast:loadDataCronTime"),
        onTick: function() {
            forecastWrapper.loadDataAndWriteToTempoDB();
        },
        start: false
    });

    forecastJob.start();

    tagDAO.updateTimeZones();

    var tagTimeZoneUpdateJob = new cronJob({
        cronTime: "0 */45 * * * *",
        onTick: function() {
            tagDAO.updateTimeZones();
        },
        start: false
    });

    tagTimeZoneUpdateJob.start();

}

exports.start = start;