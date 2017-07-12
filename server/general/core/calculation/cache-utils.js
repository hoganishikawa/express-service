"use strict";

var cache = require("../../../libs/cache");

function getAppEntitySocketCacheKey(socketId, entityId) {
    return "appentity:" +  entityId;//+ ".socket:"+ socketId
}

function getWildCardAppEntityCacheKey(entityId) {
    return "appentity:"+ entityId + "*";
}

function deleteAppEntitiesCache(socketId, entitiesIds, callback) {

    var keys = [];
    entitiesIds.forEach(function(entityId) {
        keys.push(getAppEntitySocketCacheKey(socketId, entityId));
    });

    cache.delMultipleKeys(keys, callback);
}

function deleteSingleAppEntityCache(entityId, callback) {
    var appEntityKey = getWildCardAppEntityCacheKey(entityId);
    cache.delWildcardKey(appEntityKey, callback);
}

function deleteAppEntityWidgetCache(dashboardId, widgetId, callback) {
    //widget key is stored in dashboard hash field, so need find all dashboard keys and remove widgetId from hash
    var entitydWillcard = getWildCardAppEntityCacheKey(dashboardId);
    cache.delWildcarKeyFromHash(entitydWillcard, widgetId, callback);
}

function getWidgetData(socketId, entityId, widgetId, callback) {
    var appEntityKey = getAppEntitySocketCacheKey(socketId, entityId);
    cache.hget(appEntityKey, widgetId, function(err, result) {
        if(err) {
            callback(err);
        } else {
            if(result) {
                callback(null, JSON.parse(result));
            } else {
                callback(null, null);
            }

        }
    });
}

function setWidgetData(socketId, entityId, widgetId, data, callback) {
    var appEntityKey = getAppEntitySocketCacheKey(socketId, entityId);
    var dataStr = JSON.stringify(data);
    cache.hset(appEntityKey, widgetId, dataStr, function(err, result) {
        if(err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

exports.deleteAppEntitiesCache = deleteAppEntitiesCache;
exports.deleteSingleAppEntityCache = deleteSingleAppEntityCache;
exports.deleteAppEntityWidgetCache = deleteAppEntityWidgetCache;
exports.getWidgetData = getWidgetData;
exports.setWidgetData = setWidgetData;