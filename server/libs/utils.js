"use strict";

var config = require("../config"),
    replacements = config.get("replacements"),
    graphWidgetIcons = config.get("graphWidgetIcons"),
    moment = require("moment"),
    log = require("./log")(module),
    async = require("async"),
    _ = require("lodash"),
    emailSender = require("./email-sender"),
    consts = require("./consts");

function convertError(sourceErr) {

    var destinationErr = {};
    for(var prop in sourceErr) {
        //don't add functions
        if(typeof sourceErr[prop] !== "function") {
            destinationErr[prop] = sourceErr[prop];
        }
    }

    destinationErr.name = sourceErr.name;
    destinationErr.message = sourceErr.message;
    destinationErr.stack = sourceErr.stack;

    return destinationErr;
}

function logError(thisError) {
    var returnMessage = "";

    if(thisError !== null && typeof thisError === "object") {

        if(thisError instanceof Error) {
            thisError = convertError(thisError);
        }

        if (thisError.errors) {
            var errorsMessages = [];

            for (var prop in thisError.errors) {
                if (thisError.errors[prop].message) {
                    errorsMessages.push(thisError.errors[prop].message);
                }
            }

            returnMessage = errorsMessages.join(", ");
        } else if (thisError.message) {
            returnMessage = thisError.message;
        } else {
            returnMessage = thisError;
        }

        if (thisError.name !== "Error") {
            var errStr = JSON.stringify(thisError, null, 2);
            log.error(errStr);
            emailSender.sendExceptionOccuredEmail(errStr);
        }
    } else {
        log.error(thisError);
        emailSender.sendExceptionOccuredEmail(thisError);
        returnMessage = thisError;
    }

    return returnMessage;
}

function serverAnswer(status, answer) {
    this.success = (status === true) ? 1: 0;

    if(!status) {
        this.message = logError(answer);
    } else {
        this.message = answer;
    }
}


// WebSocket helper
var ClientWebsocketAnswer = function(socket, eventName) {
    this.socket = socket;
    this.event = eventName;
};


ClientWebsocketAnswer.prototype.send = function(message) {
    var finalResult = new serverAnswer(true, message);
    this.socket.emit(this.event, finalResult);
};


// alias
ClientWebsocketAnswer.prototype.ok = ClientWebsocketAnswer.prototype.send;


ClientWebsocketAnswer.prototype.error = function(message) {
    var finalResult = new serverAnswer(false, message);
    this.socket.emit(this.event, finalResult);
};

// WebSocket helper end




function isDevelopmentEnv() {
    return config.get("env") === "development";
}

function redirectToLoginPage(res) {
    var coreDomain = config.get("platformdomain");
    if(coreDomain) {
        res.redirect(coreDomain + consts.LOGIN_PAGE_URL);
    } else {
        res.redirect(consts.LOGIN_PAGE_URL);
    }
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isWholePositiveNumber(num){
    return (!isNaN(num) && num % 1 === 0 && num > 0);
}

function replaceDotToComma(str) {
    return str.replace(".", ",");
}

/*function setAccessControlAllowOrigin(request, response, isAsterisk) {
    var header = response.get("Access-Control-Allow-Origin");
    if(!header) {
        if (isAsterisk) {
            response.setHeader("Access-Control-Allow-Origin", "*");
        } else {
            response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
        }
    }
}

function setAccessControlAllowCredentials(request, response) {
    response.setHeader("Access-Control-Allow-Credentials", true);
}*/

function getGraphWidgetIconUrlByName(iconName) {
    var url = graphWidgetIcons[iconName];
    if(url) {
        return url;
    } else {
        return null;
    }
}

function errorResponse(statusCode, errorText, response, next) {
    //setAccessControlAllowOrigin(response);
    response.send(statusCode, new serverAnswer(false, errorText));
    //return next();
}

function successResponse(message, response, next) {
    //response.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    //response.setHeader("Access-Control-Allow-Credentials", true);
    response.send(new serverAnswer(true, message));
}

function encodeSeriesKey(key) {
    var encodedKey = key;

    for(var prop in replacements) {
        //encodedKey = encodedKey.replace(prop, replacements[prop]);
        if(replacements[prop]) {
            var row = replacements[prop];
            encodedKey = encodedKey.split(prop).join(row);
        }

    }

    return encodedKey;
    //return encodedKey.replace(/\s+/g, "");//remove spaces
}

function getParsedWebBox(webbox) {
    if(webbox.indexOf("wb") < 0) {
        return encodeSeriesKey("wb"+webbox);
    } else {
        return encodeSeriesKey(webbox);
    }
}

function getDateByInterval(source, interval) {
    if(interval === "Daily") {
        return new Date(source).getDate();
    } else if(interval === "Weekly") {
        return moment.utc(source).startOf("week").isoWeekday(7);
    } else if(interval === "Monthly") {
        return moment.utc(source).startOf("month");
    } else if(interval === "Yearly") {
        return moment.utc(source).startOf("year");
    }
    else {
        return null;
    }
}

function compareDatesByInterval(d1, d2, interval) {
    if(interval === "Daily") {
        return d1 === new Date(d2).getDate();
    } else if(interval === "Weekly") {
        return d1.isSame(moment.utc(d2).startOf("week").isoWeekday(7));
    } else if(interval === "Monthly") {
        return d1.isSame(moment.utc(d2).startOf("month"));
    } else if(interval === "Yearly") {
        return d1.isSame(moment.utc(d2).startOf("year"));
    }
    else {
        return null;
    }
}

function isValidObjectID(str) {

    // A valid Object Id must be 24 hex characters
    return (/^[0-9a-fA-F]{24}$/).test(str);

}

function capitalizeString(str) {
    if(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    } else {
        return str;
    }
}

function hasDuplicateItems(arr){
    return (arr.length !== _.uniq(arr).length);
}

// Only update needed values
function cloneFieldsToMongooseModel(source, destination) {
    for (var key in source) {
        if (typeof source[key] === "object" && source[key] !== null && destination[key]) {
            cloneFieldsToMongooseModel(source[key], destination[key]);
        } else {
            destination[key] = source[key];
        }
    }
}

function removeAllSpaces(source) {
    return source.replace(/\s+/g, "");
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function multiReplace(source, replacements, newValue) {
    if(newValue === null || newValue === undefined) {
        newValue = "";
    }
    for (var i = 0; i < replacements.length; i++) {
        //source = source.split('(?i)' + replacements[i]).join('')
        source = source.replace(new RegExp(escapeRegExp(replacements[i]), "gi"), newValue);
    }
    return source;
}

function toUpperCaseArray(arr) {
    return  _.map(arr, function (item) {
        return item.toUpperCase();
    });
}

function checkGeoData(obj, next) {
    var params = {
        $and: [{latitude: obj.latitude},
            {longitude: obj.longitude}
        ]
    };

    var forecastWrapper = require("../general/core/forecast/forecast-wrapper");
    var tagDAO = require("../general/core/dao/tag-dao");

    async.waterfall([
            function (callback) {
                tagDAO.getTagsByParams(params, callback);
            },
            function(findDataSources, callback) {
                console.log("LENGTH123: "+ findDataSources.length);
                if(findDataSources.length === 0) {
                    console.log("start forecast");
                    forecastWrapper.loadDataAndWriteToTempoDB(obj);
                } /*else {
                 forecastWrapper.loadDataAndWriteToTempoDB(obj);
                 console.log("OLD LAT/LONG")
                 }*/
                callback(null);
            }
        ],
        function (err, result) {
            if (err) {
                return next(err);
            } else {
                return next();
            }
        });
}

function isGeoDataChanged(obj) {
    /*return (obj.latitude && obj.previousLatitude !== obj.latitude) ||
           (obj.longitude && obj.longitude !== obj.previousLongitude);*/

    return obj.isModified("latitude") || obj.isModified("longitude");
}

function getDomain(req, useBase) {

    var coreDomain = config.get("platformdomain");
    if(coreDomain) {
        return coreDomain;
    } else if(useBase) {
        return config.get("domain");
    } else {
        var domain = req.protocol + "://" + req.get("host");
        //console.log("DOMAIN:" + domain)
        return domain;
    }
}

function isCreratorRoleChanged(obj) {
    return obj.previousCreatorRole && (obj.creatorRole !== obj.previousCreatorRole);
}

function isCreatorChanged(obj) {
    return obj.previousCreator && (obj.creator.toString() !== obj.previousCreator.toString());
}

function getMongooseId(obj) {
    if(obj._id) {
        return obj._id.toString();
    } else {
        return obj.toString();
    }
}

function saveMany(objects, callback) {
    async.each(objects, function(obj, cb) {
        obj.save(cb);
    }, function(err, result) {
        if(err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

function childExistsInParent(childObj, parent) {
    var result = false;

    if ( _.indexOf(parent, childObj) > -1) {
        result = true;
    }

    return result;
}

function generateRandomString(len) {
    var text = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i<len; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return text;
}

function getFileExtention(filename, withPoint) {
    var ext = filename.split(".").pop();

    if(withPoint) {
        return "." + ext;
    }
    else {
        return ext;
    }
}

function searchThumbnailURL(searchKey) {
    var resultKey = "";

    // If this is thumb image, return.
    if(searchKey.indexOf("/thumb/") !== -1) {
        return "";
    }

    var keys = searchKey.split("/");
    var lastKey = keys[keys.length - 1];

    // If this is thumb image, return.
    if(lastKey.indexOf("thumb_") === 0) {
        return "";
    }

    // If this is in thumb folder, return.
    if( keys[keys.length - 2] && keys[keys.length - 2] === "thumb") {
        return "";
    }

    keys[keys.length - 1] = "thumb";
    keys.push("thumb_" + lastKey);

    resultKey = keys.join("/");

    return resultKey;
}

function getFileNameFromKey(key) {
    var keys = key.split("/");
    var lastKey = keys[keys.length - 1];

    return lastKey;
}

function removeMongooseVersionField(object) {
    if(object) {
        delete object.__v;
    }
}

function getArraySum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    return sum;
}

function getFoldBySummaryMethod(tempoIQItem) {
    var fold = "sum";
    switch (tempoIQItem.summaryMethod) {
        case consts.METRIC_SUMMARY_METHODS.Total:
            fold = "sum";
            break;
        case  consts.METRIC_SUMMARY_METHODS.Average:
            fold = "mean";
            break;
        case consts.METRIC_SUMMARY_METHODS.Count:
            fold = "count";
            break;
        case  consts.METRIC_SUMMARY_METHODS.Minimum:
            fold = "min";
            break;
        case consts.METRIC_SUMMARY_METHODS.Maximum:
            fold = "max";
            break;
        case consts.METRIC_SUMMARY_METHODS.Median:
            fold = "range";
            break;
    }

    return fold;
}

function getPositiveValues(arr) {
    var positiveValues = _.filter(arr, function(value) {
        return value > 0;
    });

    return positiveValues;
}

function getNegativeValues(arr) {
    var negativeValues = _.filter(arr, function(value) {
        return value < 0;
    });

    return negativeValues;
}

function getObjectValue(jsonObject, key) {
    if(jsonObject[key] !== undefined) {
        return jsonObject[key];
    }
    else {
        return null;
    }
}

function setObjectValue(jsonObject, key, value) {
    jsonObject[key] = value;

    return jsonObject;
}

function getAllowedTimeZonesName() {
    return _.pluck(consts.TIME_ZONES, "name");
}

function errorHandler(event, err, socket, callback) {
    if (socket) {
        var finalResult = new serverAnswer(false, err);
        socket.emit(event, finalResult);
    } else {
        callback(err);
    }
}

function presentationErrorHandler(err, socket, callback) {
    errorHandler(consts.WEBSOCKET_EVENTS.PRESENTATION_DATA, err, socket, callback);
}

function dashboardErrorHandler(err, socket, callback) {
    errorHandler(consts.WEBSOCKET_EVENTS.DASHBOARD_DATA, err, socket, callback);
}

function successHandler(event, message, socket, callback) {
    if(socket) {
        var finalResult = new serverAnswer(true, message);
        socket.emit(event, finalResult);
    } else {
        callback(null, message);
    }
}

function presentationSuccessResponse(message, socket, callback) {
    successHandler(consts.WEBSOCKET_EVENTS.PRESENTATION_DATA, message, socket, callback);
}

function dashboardSuccessResponse(message, socket, callback) {
    successHandler(consts.WEBSOCKET_EVENTS.DASHBOARD_DATA, message, socket, callback);
}

function destroySession(req) {
    req.session.destroy();
}

function getOffsetByTimeZone(timezoneName) {
    var tzObjects = _.filter(consts.TIME_ZONES, function(tzItem) {
        return tzItem.name === timezoneName;
    });

    if(tzObjects.length > 0) {
        return tzObjects[0].offset;
    } else {
        return 0;
    }
}

function getTimeZoneByOffset(offset) {
    var tzObjects = _.filter(consts.TIME_ZONES, function(tzItem) {
        return tzItem.offset === parseInt(offset);
    });

    if(tzObjects.length > 0) {
        return tzObjects[0].name;
    } else {
        return 0;
    }
}

function addOneDay(val) {
    if(val) {
        val = moment.utc(val);
        val.seconds(59);
        val.minutes(59);
        val.hours(23);
    }

    return val;
}

/**
 * Functions finds min last date in tempoiq results
 * @access private
 * @param {array} tempoDBResults
 * @returns {object}
 */
function getLastDateFromTempoIQResults(tempoDBResults) {
    var lastDate = null;
    for(var i=0; i < tempoDBResults.length; i++) {
        if(tempoDBResults[i].dataPoints.length > 0) {
            var thisLastDate = moment.utc(tempoDBResults[i].dataPoints[tempoDBResults[i].dataPoints.length -1].ts);

            if(!lastDate || thisLastDate > lastDate) {
                lastDate = moment.utc(thisLastDate).clone();
            }
        }
    }

    return lastDate;
}

/**
 * Functions finds first date in tempoiq results
 * @access private
 * @param {array} tempoDBResults
 * @returns {object}
 */
function getFirstDateFromTempoIQResults(tempoDBResults) {
    var firstDate = null;
    for(var i=0; i < tempoDBResults.length; i++) {
        if(tempoDBResults[i].dataPoints.length > 0) {
            var thisFirstDate = moment.utc(tempoDBResults[i].dataPoints[0].ts);

            if(!firstDate || thisFirstDate < firstDate) {
                firstDate = moment.utc(thisFirstDate).clone();
            }
        }
    }

    return firstDate;
}

function removeDuplicateTempoIQDates(tempoIQCachedResults, momentLastDate) {
    if (momentLastDate) {
        var jsLastDateTime = momentLastDate.toDate().getTime();

        for (var i = 0; i < tempoIQCachedResults.length; i++) {
            tempoIQCachedResults[i].isCachedItem = true;
            if (tempoIQCachedResults[i].dataPoints.length > 0) {
                for (var j = tempoIQCachedResults[i].dataPoints.length - 1; j >= 0; j--) {
                    var thisTime = new Date(tempoIQCachedResults[i].dataPoints[j].ts).getTime();
                    if (thisTime > jsLastDateTime || jsLastDateTime === thisTime) {
                        tempoIQCachedResults[i].dataPoints.splice(j, 1);
                    } else {
                        break;
                    }
                }
            }
        }
    }
}

function htmldecode(str) {
    return str.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
}

function removeMultipleFields(object, fields) {
    if(object) {
        fields.forEach(function(field) {
            delete object[field];
        });
    }
}

exports.toUpperCaseArray = toUpperCaseArray;
exports.removeAllSpaces = removeAllSpaces;
exports.multiReplace = multiReplace;
exports.isDevelopmentEnv = isDevelopmentEnv;
exports.cloneFieldsToMongooseModel = cloneFieldsToMongooseModel;
exports.hasDuplicateItems = hasDuplicateItems;
exports.capitalizeString = capitalizeString;
exports.redirectToLoginPage = redirectToLoginPage;
exports.logError = logError;
exports.convertError = convertError;
exports.getGraphWidgetIconUrlByName = getGraphWidgetIconUrlByName;
exports.getDateByInterval = getDateByInterval;
exports.compareDatesByInterval = compareDatesByInterval;
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.encodeSeriesKey = encodeSeriesKey;
exports.replaceDotToComma = replaceDotToComma;
exports.serverAnswer = serverAnswer;
exports.isNumber = isNumber;
exports.isWholePositiveNumber = isWholePositiveNumber;
//exports.setAccessControlAllowOrigin = setAccessControlAllowOrigin;
//exports.setAccessControlAllowCredentials = setAccessControlAllowCredentials;
exports.getParsedWebBox = getParsedWebBox;
exports.isValidObjectID = isValidObjectID;
exports.checkGeoData = checkGeoData;
exports.isGeoDataChanged = isGeoDataChanged;
exports.getDomain = getDomain;
exports.isCreratorRoleChanged = isCreratorRoleChanged;
exports.isCreatorChanged = isCreatorChanged;
exports.generateRandomString = generateRandomString;
exports.getFileExtention = getFileExtention;
exports.searchThumbnailURL = searchThumbnailURL;
exports.getFileNameFromKey = getFileNameFromKey;
exports.getMongooseId = getMongooseId;
exports.saveMany = saveMany;
exports.childExistsInParent = childExistsInParent;
exports.removeMongooseVersionField = removeMongooseVersionField;
exports.getArraySum = getArraySum;
exports.getFoldBySummaryMethod = getFoldBySummaryMethod;
exports.destroySession = destroySession;
exports.getPositiveValues = getPositiveValues;
exports.getNegativeValues = getNegativeValues;
exports.getFoldBySummaryMethod = getFoldBySummaryMethod;
exports.getObjectValue = getObjectValue;
exports.setObjectValue = setObjectValue;
exports.getAllowedTimeZonesName = getAllowedTimeZonesName;
exports.presentationErrorHandler = presentationErrorHandler;
exports.dashboardErrorHandler = dashboardErrorHandler;
exports.presentationSuccessResponse = presentationSuccessResponse;
exports.dashboardSuccessResponse = dashboardSuccessResponse;
exports.getOffsetByTimeZone = getOffsetByTimeZone;
exports.getTimeZoneByOffset = getTimeZoneByOffset;
exports.addOneDay = addOneDay;
exports.getLastDateFromTempoIQResults = getLastDateFromTempoIQResults;
exports.getFirstDateFromTempoIQResults = getFirstDateFromTempoIQResults;
exports.removeDuplicateTempoIQDates = removeDuplicateTempoIQDates;
exports.htmldecode = htmldecode;
exports.removeMultipleFields = removeMultipleFields;
exports.ClientWebsocketAnswer = ClientWebsocketAnswer;
