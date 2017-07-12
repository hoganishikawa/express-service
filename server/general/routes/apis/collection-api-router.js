"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../core/user/check-auth"),
    defaultMappingDAO = require("../../core/dao/default-mapping-dao"),
    deviceDAO = require("../../core/dao/device-dao"),
    manufacturerDAO = require("../../core/dao/manufacturer-dao"),
    enphaseUtils = require("../../core/enphase/enphase-utils");

 
router.get("/defaultmapping/:limit?", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var limit = req.params.limit;

            defaultMappingDAO.getDefaultMappings(limit, function (err, result) {
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

router.post("/defaultmapping", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var defaultMappingObj = req.body;

            defaultMappingDAO.createDefaultMapping(defaultMappingObj, currentUser, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });

        }
    });

});

router.put("/defaultmapping", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var defaultMappingObj = req.body;

            defaultMappingDAO.updateDefaultMapping(defaultMappingObj, currentUser, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });

        }
    });

});

router.delete("/defaultmapping/:defaultMappingId", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            console.log(currentUser);

            var defaultMappingId = req.params.defaultMappingId;

            if(currentUser.role !== consts.USER_ROLES.BP) {
                var error = new Error(consts.CAN_NOT_DELETE_DEFAULT_MAPPING);
                error.status = 422;
                return next(error, null);
            } else {

                defaultMappingDAO.deleteDefaultMappingById(defaultMappingId, function (err, answer) {
                    if (err) {
                        return next(err);
                    } else {
                        return utils.successResponse(answer, res, next);
                    }
                });
            }
        }
    });
});

 /**
 * @api {get} /v1/collection/nodes Get Devices
 * @apiGroup Collection
 * @apiName Get Devices
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the list of devices
 *
 * @apiSuccess success 1
 * @apiSuccess message Device Objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"5421ab10885c2846dcce9d3e",
 *          "name":"Envoy"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/nodes/:limit?", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var limit = req.params.limit;

            deviceDAO.getDevices(limit, function (err, result) {
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
 * @api {get} /v1/collection/scopes Get Manufactures or Enphase systems
 * @apiGroup Collection
 * @apiName Get Manufactures or Enphase systems
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the list of manufactures. when company query equals ehphase, 
 *  it retrieves the list of enphase systems of logged in user.
 *
 * @apiSuccess success 1
 * @apiSuccess message Manufacture Objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"5421ab08885c2846dcce9d3d",
 *          "name":"Enphase"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/scopes/:limit?", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            if (req.query.company === "enphase"){
                enphaseUtils.getSystems(currentUser, function(enphaseErr, result) {
                    if(enphaseErr) {
                        return next(enphaseErr);
                    } else {
                        return utils.successResponse(result, res, next);
                    }
                });
            } else {
                var limit = req.params.limit;
                manufacturerDAO.getManufacturers(limit, function (err, result) {
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
 * @api {get} /v1/collection/auth?company=enphase Get Enphase Auth URL
 * @apiGroup Collection
 * @apiName Get Enphase Auth URL
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the enphase auth URL of currently logged in user.
 *
 * @apiSuccess success 1
 * @apiSuccess message enphase auth url
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": "https://enlighten.enphaseenergy.com/app_user_auth/
 *              new?app_id=1409611230371&redirect=http://brightergy.com/users/enphase/auth"
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/auth?", function(req, res, next) {
    if (req.query.company === "enphase") {
        checkAuth(req, res, next, function(findUserErr, currentUser) {
            if (findUserErr) {
                return next(findUserErr);
            } else {
                var fullUrl = enphaseUtils.getAuthUrl();
                return utils.successResponse(fullUrl, res, next);
            }
        });
    } else {
        return next("not found");
    }
});

 /**
 * @api {get} /v1/collection/scopes/:scopeId/nodes?company=enphase Get Enphase Inventory
 * @apiGroup Collection
 * @apiName Get Enphase Inventory
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the the inventory list of Enphase System by Id
 * @apiExample Example request
    scopeId : 38377
 *
 * @apiSuccess success 1
 * @apiSuccess message inventory list
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "system_id":38377,
 *          "envoys":[{
 *              "sn":"121035340955"
 *          }],
 *          "inverters":[{
 *              "sn":"121106540268",
 *              "model":"M210"
 *          },{
 *              "sn":"121106540291",
 *              "model":"M210"
 *          }]
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/scopes/:scopeId/nodes", function(req, res, next) {
    if (req.query.company === "enphase") {
        checkAuth(req, res, next, function(findUserErr, currentUser) {
            if (findUserErr) {
                return next(findUserErr);
            } else {
                var scopeId = req.params.scopeId;
                enphaseUtils.getInventory(scopeId, currentUser, function(enphaseErr, result) {
                    if(enphaseErr) {
                        return next(enphaseErr);
                    } else {
                        return utils.successResponse(result, res, next);
                    }
                });
            }
        });
    } else {
        return next("not found");
    }
});

module.exports = router;