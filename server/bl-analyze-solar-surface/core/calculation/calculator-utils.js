"use strict";

var _ = require("lodash"),
    cache = require("../../../libs/cache"),
    utils = require("../../../libs/utils"),
    crypto = require("crypto"),
    moment = require("moment");


function getTempoIQParametersByUserSources(firstLoading,
                                           originalSolarTags, selectedFacilitiesId, selectedScopesId, selectedNodesId) {

    var i=0;
    var j=0;
    var k=0;
    var solarTags = _.cloneDeep(originalSolarTags);

    if(firstLoading) {
        //use only selected sources
        solarTags = _.filter(solarTags, function(facility) {
            return facility.selected;
        });
    }

    if(selectedFacilitiesId && selectedFacilitiesId.length && selectedFacilitiesId.length > 0) {
        solarTags = _.filter(solarTags, function(facility) {
            return selectedFacilitiesId.indexOf(facility.id) > -1;
        });
    }

    if(selectedScopesId && selectedScopesId.length && selectedScopesId.length > 0) {
        for(i=0; i < solarTags.length;i++) {
            solarTags[i].scopes = _.filter(solarTags[i].scopes, function(scope) {
                return selectedScopesId.indexOf(scope.id) > -1;
            });// jshint ignore:line
        }
    }

    if(selectedNodesId && selectedNodesId.length && selectedNodesId.length > 0) {
        for(i=0; i < solarTags.length;i++) {
            for(j=0; j < solarTags[i].scopes.length; j++) {
                solarTags[i].scopes[j].nodes = _.filter(solarTags[i].scopes[j].nodes, function(node) {
                    return selectedNodesId.indexOf(node.id) > -1;
                });// jshint ignore:line
            }
        }
    }

    var nodesSelection = [];
    var nodeList =  {};
    var facilitiesList = {};

    var metricId = [];


    for(i=0; i < solarTags.length;i++) {
        var facilityObj = {
            name: solarTags[i].name,
            displayName: solarTags[i].displayName || solarTags[i].name,
            scopes: {},
            lastReportedValue: 0,
            lastReportedTime: null,
            firstReportedValue: 0,
            firstReportedTime: null,
            maxValue: 0,
            minValue: 0,
            totalEnergyGenerated: 0,
            percent: 0,
            currentValue: 0,
            trend: null
        };

        for(j=0; j < solarTags[i].scopes.length; j++) {

            facilityObj.scopes[solarTags[i].scopes[j].name] = {
                name: solarTags[i].scopes[j].name,
                displayName: solarTags[i].scopes[j].displayName || solarTags[i].scopes[j].name,
                lastReportedValue: 0,
                lastReportedTime: null,
                firstReportedValue: 0,
                firstReportedTime: null,
                maxValue: 0,
                minValue: 0,
                totalEnergyGenerated: 0,
                percent: 0,
                currentValue: 0,
                trend: null
            };

            for(k=0; k < solarTags[i].scopes[j].nodes.length; k++) {
                nodesSelection.push(
                    {
                        "key": solarTags[i].scopes[j].nodes[k].nodeId
                    }
                );

                nodeList[solarTags[i].scopes[j].nodes[k].nodeId] = {
                    facilityName: solarTags[i].name,
                    facilityId: solarTags[i].id,
                    scopeName: solarTags[i].scopes[j].nodes[k].scopeName,
                    rate: solarTags[i].scopes[j].nodes[k].rate,
                    deviceOffset: solarTags[i].scopes[j].nodes[k].deviceOffset,
                    powerMetricId: solarTags[i].scopes[j].nodes[k].powerMetricId
                };

                if(solarTags[i].scopes[j].nodes[k].powerMetricId) {
                    metricId.push(solarTags[i].scopes[j].nodes[k].powerMetricId);
                }
            }
        }

        facilitiesList[solarTags[i].name] = facilityObj;

    }

    metricId = _.uniq(metricId);

    var sensors = _.map(metricId, function(id) {
        return {
            "key": id
        };
    });


    var selection = {
        "devices": {
            "or": nodesSelection
        },
        "sensors": {
            "or": sensors
        }
    };

    return {
        selection: selection,
        nodeList: nodeList,
        facilitiesList: facilitiesList
    };
}

function addHighchartsSeriesPerSource(nodeList, isOneFacility, highchartsObj) {
    var addedSeries = [];//stores name of added series
    for(var nodeId in nodeList) {
        if(nodeList[nodeId]) {

            var name = isOneFacility ? nodeList[nodeId].scopeName: nodeList[nodeId].facilityName;

            if(addedSeries.indexOf(name) < 0) {
                //name not added
                addedSeries.push(name);
                highchartsObj.series.push({
                    name: name,
                    data: []
                });
            }
        }
    }
}

function getSocketCacheKey(socket) {
    return "assurf:" + socket.id;
}

function getCachedElementData(socket, elementKey, defaultCachedData, callback) {
    //var baseKey = getSocketCacheKey(socket);
    cache.get(elementKey, function(err, result) {
        if(err) {
            callback(err);
        } else {
            if(result) {
                callback(null, JSON.parse(result));
            } else {
                callback(null, defaultCachedData);
            }

        }
    });
}

function getHashByElementParameters(params) {
    return crypto.createHash("md5")
        .update(JSON.stringify(params))
        .digest("hex");
}

function getCachedEndDate(cacheResult) {
    var cachedEndDate = null;
    if (cacheResult && cacheResult.dataPoints && cacheResult.dataPoints.length > 0) {
        var ts = cacheResult.dataPoints[cacheResult.dataPoints.length - 1].ts;
        cachedEndDate = moment.utc(ts);

        //remove last date from cached result, because we will reload that date from tempoiq
        utils.removeDuplicateTempoIQDates([cacheResult], cachedEndDate);
    }

    return cachedEndDate;
}

function convertTimeStampToUTC(ts, deviceOffset) {
    if(deviceOffset) {
        ts.subtract(deviceOffset, "minutes");
    }
}

function getDeviceOffsetfromNodeList(nodeList) {
    var nodeIds = Object.keys(nodeList);
    if(nodeIds.length > 0 && nodeList[nodeIds[0]].deviceOffset) {
        var offset = nodeList[nodeIds[0]].deviceOffset;
        return offset;
    } else {
        return 0;
    }
}

function setDateToMidnight(date) {
    date.hour(0).minute(0).second(0).millisecond(0);
    return date;
}

exports.getTempoIQParametersByUserSources = getTempoIQParametersByUserSources;
exports.addHighchartsSeriesPerSource = addHighchartsSeriesPerSource;
exports.getSocketCacheKey = getSocketCacheKey;
exports.getCachedElementData = getCachedElementData;
exports.getHashByElementParameters = getHashByElementParameters;
exports.getCachedEndDate = getCachedEndDate;
exports.convertTimeStampToUTC = convertTimeStampToUTC;
exports.getDeviceOffsetfromNodeList = getDeviceOffsetfromNodeList;
exports.setDateToMidnight = setDateToMidnight;
