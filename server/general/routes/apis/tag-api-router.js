"use strict";

var express = require("express"),
    router = express.Router(),
    async = require("async"),
    _ = require("lodash"),
    moment = require("moment"),
    tagUtils = require("../../../libs/tag-binding-utils"),
    _str = require("underscore.string"),
    utils = require("../../../libs/utils"),
    tagDAO = require("../../core/dao/tag-dao"),
    checkAuth = require("../../core/user/check-auth"),
    consts = require("../../../libs/consts"),
    tempoiq = require("../../core/tempoiq/tempoiq-wrapper"),
    config = require("../../../config"),
    cryptoJS = require("crypto-js");

 /**
 * @api {get} /v1/tags/:tagId Get Tag by Id
 * @apiGroup Tags
 * @apiName Get Tag by Id
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the tag data by Tag Id
 * @apiExample Example request
 *  tagId : 5458a2acb0091419007e03df
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id" : "543824c07174d62c1acad525",
 *          "tagType" : "Scope",
 *          "name" : "Enphase DataLoggerII",
 *          "creatorRole" : "Admin",
 *          "creator" : "54133e8fd361774c1696f265",
 *          "__v" : 0,
 *          "usersWithAccess" : [{
 *              "id" : "54133e8fd361774c1696f265"
 *          }],
 *          "appEntities" : [{
 *              "id" : "5429d13f89c1849502287d5d",
 *              "appName" : "Presentation"
 *          }],
 *          "children" : [],
 *          "parents" : [{
 *              "id" : "543824bf7174d62c1acad51d",
 *              "tagType" : "Facility"
 *          }],
 *          "formula" : null,
 *          "metricID" : null,
 *          "metricType" : null,
 *          "metric" : null,
 *          "sensorTarget" : null,
 *          "enphaseUserId" : "4d7a59344d5445300a",
 *          "endDate" : null,
 *          "weatherStation" : "--Use NOAA--",
 *          "longitude" : -90.47239999999999,
 *          "latitude" : 38.5763,
 *          "username": "tester",
 *          "password": "123456",
 *          "webAddress" : null,
 *          "interval" : "Hourly",
 *          "destination" : "Test",
 *          "accessMethod" : "Push to FTP",
 *          "deviceID" : "121006088373",
 *          "device" : "Envoy",
 *          "manufacturer" : "Enphase",
 *          "utilityAccounts" : [],
 *          "utilityProvider" : null,
 *          "nonProfit" : null,
 *          "taxID" : null,
 *          "street" : null,
 *          "state" : null,
 *          "postalCode" : null,
 *          "country" : null,
 *          "city" : null
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:tagId", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var idArray = [req.params.tagId];

            tagDAO.getTagsByParams({_id: { $in: idArray}}, function(findErr, findObjects) {
                if (findErr) {
                    return next(findErr);
                } else {
                    if(findObjects[0].tagType === "Scope"){
                        var encrypted = cryptoJS.AES.decrypt(findObjects[0].password, config.get("scopeCryptoKey"));
                        findObjects[0].password = encrypted.toString(cryptoJS.enc.Utf8);
                    }
                    return utils.successResponse(findObjects[0], res, next);
                }
            });
        }
    });
});

 /**
 * @api {get} /v1/tags/:tagId/deletable Check tag deletable
 * @apiGroup Tags
 * @apiName Check tag deletable
 * @apiVersion 1.0.0
 * @apiDescription Check if the tag is deletable
 * @apiExample Example request
 *  tagId : 5458a8a95409c90e00884ce0
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "543824bd7174d62c1acad50f":{
 *              "isDeletable":false
 *          }
 *      }
 * }
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:tagId/deletable", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var idArray = [req.params.tagId];

            tagDAO.isDeletable(idArray, currentUser, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    var isDeletable = true;
                    _.each(result, function(row, i) {
                        isDeletable = isDeletable && row.isDeletable;
                    });

                    var returnObj = {};
                    returnObj[req.params.tagId] = {
                        isDeletable: isDeletable,
                        children: result
                    };
                    
                    return utils.successResponse(returnObj, res, next);
                }
            });
        }
    });
});

// --------------------------------------------------------------------------------------------------

/**
 * @api {get} /tags/source/users/:tagId Get Accessible Users for Tag
 * @apiGroup Tags
 * @apiName Get Accessible Users for Tag
 * @apiVersion 1.0.0
 * @apiDescription Returns accessible Users Array for Tag
 * @apiSuccess success 1
 * @apiSuccess message Users Array
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/source/users/:tagId", function(req, res, next) {
    var tagId = req.params.tagId;

    checkAuth(req, res, next, function (findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            tagDAO.getTagById(tagId, function (findErr, foundTag) {
                if (findErr) {
                    return next(findErr);
                } else {
                    tagDAO.populateAccessibleUsersForTag(foundTag, function (error, users) {
                        if (error) {
                            return next(error);
                        } else {
                            return utils.successResponse(users, res, next);
                        }
                    });
                }
            });
        }
    });
});

// --------------------------------------------------------------------------------------------------

/**
 * API: Retrieve tag
 *
 * @method  GET
 * @param   string
 */
router.get("/:objecttype/:tagtype/:findNameMask", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var objectType = _str.capitalize(req.params.objecttype);
            var tagtype = req.params.tagtype;
            var idArray = req.query.id;
            var findNameMask = req.params.findNameMask;

            if(findNameMask === consts.ALL) {
                findNameMask = null;
            }
            if(tagtype === consts.ALL_TYPE) {
                tagtype = null;
            } else {
                tagtype = _str.capitalize(tagtype);
            }

            var validateErrors = [];

            if ((consts.APP_ENTITY_TYPES.indexOf(objectType) < 0) && 
                (consts.USER_WITH_ACCESS_TYPES.indexOf(objectType) < 0)) {
                validateErrors.push(consts.INVALID_ENTITY_TYPE);
            }
            if (!idArray) {
                validateErrors.push(consts.MISSING_ENTITY_ID);
            }
            if (tagtype && consts.RESERVED_TAG_RULE_TYPES.indexOf(tagtype) < 0) {
                validateErrors.push(consts.INVALID_TAG_TYPE);
            }

            if (validateErrors.length > 0) {
                var error = new Error(validateErrors.join(", "));
                error.status = 422;
                return next(error);
            } else {
                tagDAO.getTagsByEntityIds(objectType, idArray, tagtype, findNameMask, function (err, result) {
                    if (err) {
                        return next(err);
                    } else {
                        return utils.successResponse(result, res, next);
                    }
                });
            }
        }
    });
});

 /**
 * @api {post} /v1/tags Create Tag
 * @apiGroup Tags
 * @apiName Create Tag
 * @apiVersion 1.0.0
 * @apiDescription Create new tag and add it to user accessibleTags field <br/>
 * Following fields can't be updated: <br/>
 *      usersWithAccess <br/>
 *      appEntities <br/>
 *      creator <br/>
 *      creatorRole <br/>
 *      tagType <br/>
 * @apiParam {Object} body Tag data
 * @apiExample Example request
 *  body
 *  {
 *      "tagType" : "Facility",
 *      "name" : "Liberty Lofts",
 *      "creatorRole" : "BP",
 *      "creator" : "54135f90c6ab7c241e28095e",
 *      "__v" : 0,
 *      "usersWithAccess" : [ 
 *          {
 *              "id" : "54135f90c6ab7c241e28095e"
 *          }, 
 *          {
 *              "id" : "5429d0ba89c1849502287d5c"
 *          }
 *      ],
 *      "appEntities" : [],
 *      "children" : [ 
 *          {
 *              "id" : "5458a84f5409c90e00884cdf",
 *              "tagType" : "Scope"
 *          }
 *      ],
 *      "parents" : [],
 *      "formula" : null,
 *      "metricID" : null,
 *      "metricType" : null,
 *      "metric" : null,
 *      "sensorTarget" : null,
 *      "enphaseUserId" : null,
 *      "endDate" : null,
 *      "weatherStation" : null,
 *      "longitude" : null,
 *      "latitude" : null,
 *      "username": "tester",
 *      "password": "123456",
 *      "webAddress" : null,
 *      "interval" : null,
 *      "destination" : null,
 *      "accessMethod" : null,
 *      "deviceID" : null,
 *      "device" : null,
 *      "manufacturer" : null,
 *      "utilityAccounts" : [],
 *      "utilityProvider" : "",
 *      "nonProfit" : null,
 *      "taxID" : null,
 *      "street" : "",
 *      "state" : "",
 *      "postalCode" : "",
 *      "country" : "",
 *      "city" : ""
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created Tag Object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": [{
 *          "_id" : "543824c07174d62c1acad525",
 *          "tagType" : "Scope",
 *          "name" : "Enphase DataLoggerII",
 *          "creatorRole" : "Admin",
 *          "creator" : "54133e8fd361774c1696f265",
 *          "__v" : 0,
 *          "usersWithAccess" : [{
 *              "id" : "54133e8fd361774c1696f265"
 *          }],
 *          "appEntities" : [{
 *              "id" : "5429d13f89c1849502287d5d",
 *              "appName" : "Presentation"
 *          }],
 *          "children" : [],
 *          "parents" : [{
 *              "id" : "543824bf7174d62c1acad51d",
 *              "tagType" : "Facility"
 *          }],
 *          "formula" : null,
 *          "metricID" : null,
 *          "metricType" : null,
 *          "metric" : null,
 *          "sensorTarget" : null,
 *          "enphaseUserId" : "4d7a59344d5445300a",
 *          "endDate" : null,
 *          "weatherStation" : "--Use NOAA--",
 *          "longitude" : -90.47239999999999,
 *          "latitude" : 38.5763,
 *          "username": "tester",
 *          "password": "123456",
 *          "webAddress" : null,
 *          "interval" : "Hourly",
 *          "destination" : "Test",
 *          "accessMethod" : "Push to FTP",
 *          "deviceID" : "121006088373",
 *          "device" : "Envoy",
 *          "manufacturer" : "Enphase",
 *          "utilityAccounts" : [],
 *          "utilityProvider" : null,
 *          "nonProfit" : null,
 *          "taxID" : null,
 *          "street" : null,
 *          "state" : null,
 *          "postalCode" : null,
 *          "country" : null,
 *          "city" : null
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
            var tagObj = req.body;
            var rawPassword = "";
            if(tagObj.tagType === "Scope"){
                rawPassword = tagObj.password;
                var encrypted = cryptoJS.AES.encrypt(tagObj.password, config.get("scopeCryptoKey"));
                tagObj.password  = encrypted.toString();
            }
            utils.removeMongooseVersionField(tagObj);

            utils.removeMultipleFields(tagObj,
                [
                    "usersWithAccess",
                    "appEntities"
                ]
            );

            var tagsToCreate = tagUtils.addCalculatedMetricTags(tagObj);

            async.map(tagsToCreate, function(tagObj, cb) {
                tagDAO.createTag(tagObj, currentUser, cb);
            }, function(err, result) {
                if (err) {
                    return next(err);
                } else {
                    if(rawPassword !== ""){
                        //after created, shows raw password.
                        result[0].password = rawPassword;
                    }
                    return utils.successResponse(result, res, next);
                    //res.send(new utils.serverAnswer(true, result));
                }
            });
        }
    });
});

 /**
 * @api {put} /v1/tags/:tagId Edit Tag
 * @apiGroup Tags
 * @apiName Edit Tag
 * @apiVersion 1.0.0
 * @apiDescription Edit tag data <br/>
 * Following fields can't be updated: <br/>
 *      usersWithAccess <br/>
 *      appEntities <br/>
 *      creator <br/>
 *      creatorRole <br/>
 * @apiParam {Object} body Tag data object. API can accepts only changed fields. However, id is mandatory
 * @apiExample Example request
 *  tagId : 5458a2acb0091419007e03df
 *  body
 *  {
 *      "_id" : "5458a2acb0091419007e03df",
 *      "tagType" : "Facility",
 *      "name" : "Liberty Lofts test"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {    
 *          "_id" : "543824c07174d62c1acad525",
 *          "tagType" : "Scope",
 *          "name" : "Enphase DataLoggerII",
 *          "creatorRole" : "Admin",
 *          "creator" : "54133e8fd361774c1696f265",
 *          "__v" : 0,
 *          "usersWithAccess" : [{
 *              "id" : "54133e8fd361774c1696f265"
 *          }],
 *          "appEntities" : [{
 *              "id" : "5429d13f89c1849502287d5d",
 *              "appName" : "Presentation"
 *          }],
 *          "children" : [],
 *          "parents" : [{
 *              "id" : "543824bf7174d62c1acad51d",
 *              "tagType" : "Facility"
 *          }],
 *          "formula" : null,
 *          "metricID" : null,
 *          "metricType" : null,
 *          "metric" : null,
 *          "sensorTarget" : null,
 *          "enphaseUserId" : "4d7a59344d5445300a",
 *          "endDate" : null,
 *          "weatherStation" : "--Use NOAA--",
 *          "longitude" : -90.47239999999999,
 *          "latitude" : 38.5763,
 *          "username": "tester",
 *          "password": "123456",
 *          "webAddress" : null,
 *          "interval" : "Hourly",
 *          "destination" : "Test",
 *          "accessMethod" : "Push to FTP",
 *          "deviceID" : "121006088373",
 *          "device" : "Envoy",
 *          "manufacturer" : "Enphase",
 *          "utilityAccounts" : [],
 *          "utilityProvider" : null,
 *          "nonProfit" : null,
 *          "taxID" : null,
 *          "street" : null,
 *          "state" : null,
 *          "postalCode" : null,
 *          "country" : null,
 *          "city" : null
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:tagId", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var tagId = req.params.tagId;
            var tagObj = req.body;

            if(tagObj.tagType === "Scope"){
                var encrypted = cryptoJS.AES.encrypt(tagObj.password, config.get("scopeCryptoKey"));
                tagObj.password  = encrypted.toString();
            }
            utils.removeMongooseVersionField(tagObj);

            utils.removeMultipleFields(tagObj,
                [
                    "usersWithAccess",
                    "appEntities"
                ]
            );

            tagDAO.editTag(tagId, tagObj, currentUser, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                    //res.send(new utils.serverAnswer(true, result));
                }
            });
        }
    });
});

 /**
 * @api {delete} /v1/tags/:tagId Delete Tag with children
 * @apiGroup Tags
 * @apiName Delete Tag
 * @apiVersion 1.0.0
 * @apiDescription Delete tag by Id with children
 * @apiExample Example request
 *  tagId : 5458af3ffe540a120074c20a
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:tagId", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var idArray = [req.params.tagId];

            tagDAO.isDeletable(idArray, currentUser, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    var isDeletable = true;
                    _.each(result, function(row, tagId) {
                        isDeletable = isDeletable && row.isDeletable;
                    });

                    if(isDeletable) {
                        tagDAO.deleteTagsWithChildren(idArray, currentUser, function (err, answer) {
                            if (err) {
                                return next(err);
                            } else {
                                return utils.successResponse(answer, res, next);
                            }
                        });
                    }
                    else {
                        return next(new Error(consts.TAG_IS_BEING_USED));
                    }
                }
            });
        }
    });
});

 /**
 * @api {post} /v1/tags/data/:metricId Save Tag Data
 * @apiGroup Tags
 * @apiName Save Tag Data
 * @apiVersion 1.0.0
 * @apiDescription Save Metric data into tempoiqDB
 * @apiExample Example request
 *  metricId : 5461194d7c895516004561ad
 *  body
 *  {
 *      "sourceData": [
 *          {Metric: "W", DateTime: "2010-01-02 06:00:00", MetricValue: "11000"},
 *          {Metric: "W", DateTime: "2010-01-04 06:00:00", MetricValue: "200.15"}
 *      ]
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 * @apiSuccessExample Success example
 * {
 *   "success":1,
 *   "message":{
 *       "dataPoints":{
 *           "egauge8795:Solar Inverter Aplus":{
 *               "W":[
 *                   {"t":"2010-01-02T04:00:00.000Z","v":"11000.1"},
 *                   {"t":"2010-01-04T04:00:00.000Z","v":"11000.2"}
 *               ]
 *           }
 *       },
 *       "result":{}
 *   }
 * }
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/data/:metricId", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var tagData = req.body,
                metricId = req.params.metricId,
                sourceData = [];

            if(tagData.sourceData !== undefined) {
                sourceData = tagData.sourceData;
            }

            tagDAO.getTagById(metricId, function(findMetricErr, metricTag) {
                if(findMetricErr) {
                    return next(findMetricErr);
                }
                else {
                    if(metricTag.parents.length > 0 && metricTag.parents[0].tagType === consts.TAG_TYPE.Node) {
                        
                        tagDAO.getTagById(metricTag.parents[0].id, function(findSensorErr, sensorTag) {
                            if(findSensorErr) {
                                return next(findSensorErr);
                            }
                            else {
                                var deviceId = utils.encodeSeriesKey(sensorTag.deviceID);
                                var dataPoints = {};
                                
                                _.each(sourceData, function(source) {
                                    tempoiq.addDataPoints(dataPoints, deviceId, 
                                        source.Metric, moment(source.DateTime), source.MetricValue);
                                });

                                tempoiq.writeDataPoints(dataPoints, function(finalErr, finalResult) {
                                    if(finalErr) {
                                        return next(finalErr);
                                    }
                                    else {
                                        return utils.successResponse(finalResult, res, next);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        var error = new Error(consts.NOT_FOUND_SENSOR_IN_PARENTS);
                        error.status = 422;
                        return next(error);
                    }
                }
            });
        }
    });
});

module.exports = router;