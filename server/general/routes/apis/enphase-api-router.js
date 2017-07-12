"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../core/user/check-auth"),
    presentationDAO = require("../../../bl-brighter-view/core/dao/presentation-dao"),
    enphaseUtils = require("../../core/enphase/enphase-utils");

router.get("/auth", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var enphaseUserId = utils.getObjectValue(req.query, "user_id");
            enphaseUtils.saveEnphaseUserId(enphaseUserId, currentUser, function(saveUserErr, result) {
                if(saveUserErr) {
                    return next(saveUserErr);
                } else {
                    presentationDAO.getLastEditedPresentationId(currentUser, 
                        function (findPresentationErr, lastEditedPresentationId) {
                            if(findPresentationErr) {
                                return next(findPresentationErr);
                            } else {
                                var managementUrl = consts.MANAGEMENT_PAGE_URL + "?id=" + lastEditedPresentationId;
                                res.redirect(managementUrl);
                            }
                        });
                }
            });
        }
    });
});


module.exports = router;