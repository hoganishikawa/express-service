"use strict";

var express = require("express"),
    router = express.Router(),
    permissionsUtils = require("../../../general/core/user/permissions-utils"),
    presentationDAO = require("../../core/dao/presentation-dao"),
    availableWidgetDAO = require("../../core/dao/available-widget-dao"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../../general/core/user/check-auth"),
    utils = require("../../../libs/utils"),
    config = require("../../../config"),
    async = require("async"),
    accountDAO = require("../../../general/core/dao/account-dao"),
    userDAO = require("../../../general/core/dao/user-dao"),
    groupDAO = require("../../../general/core/dao/group-dao"),
    enphaseUtils = require("../../../general/core/enphase/enphase-utils"),
    awsAssetsUtils = require("../../../general/core/aws/assets-utils"),
    log = require("../../../libs/log")(module);


router.get("/", function(req, res, next) {

    var startTime = new Date();

    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return utils.redirectToLoginPage(res);
            //res.render("management", {errors: findUserErr, permissions: null, currentUser: null});
        } else {
            var viewConfig = config.getMany("env", "cdn", "siteAnalytics", "api");

            var currentUserPermissions = permissionsUtils.getUserPermissions(currentUser);
            var keyPrefix = config.get("aws:assets:generalAssetsKeyPrefix");
            var tzNames = utils.getAllowedTimeZonesName();
            var offset = new Date().getTimezoneOffset() * -1;
            var tzName = utils.getTimeZoneByOffset(offset);
            var enphaseUrl = enphaseUtils.getAuthUrl();
            var otherCompanyData = {timeZoneList: tzNames, timezone:tzName, enphaseUrl:enphaseUrl};

            if(!permissionsUtils.userHaveAccessToPresent(currentUser)) {
                res.render("management", {errors: consts.NOT_ACCESSIBLE_PRESENT_APP,
                    permissions: currentUserPermissions, currentUser: currentUser,
                    presentation: null, config: viewConfig });
            } else {
                async.parallel([
                    function(cb) {
                        userDAO.getUserTagsFullHierarchy(currentUser, cb);
                    },
                    function(cb) {
                        accountDAO.getAccountsByUser(currentUser, null, null, cb);
                    },
                    function(cb) {
                        userDAO.getUsersByName(currentUser, null, null, cb);
                    },
                    function(cb) {
                        userDAO.getApplications(currentUser, cb);
                    },
                    function(cb) {
                        var roles = ["Admin", "TM"];
                        var appList = [consts.APPS.Present];
                        var query = {};
                        if (roles && roles.length > 0) {
                            query.role = {$in: roles};
                        }
                        if (currentUser.role === consts.USER_ROLES.BP || currentUser.apps.length > 0) {
                            query.apps = {$all: appList};
                        }
                        userDAO.getUsersByParams(query, cb);
                    },
                    function(cb) {
                        userDAO.getAdmins(currentUser, null, cb);
                    },
                    function(cb) {
                        awsAssetsUtils.findImages(keyPrefix, null, null, cb);
                    },
                    function(cb) {
                        groupDAO.getGroupsByParams({}, cb);
                    },
                    function(cb) {
                        groupDAO.getAvailableSources(currentUser, cb);
                    },
                    function(cb) {
                        availableWidgetDAO.getAvailableWidgets(cb);
                    },
                    function(cb) {
                        presentationDAO.getPresentationsByUser(currentUser, cb);
                    },
                    function(cb) {
                        presentationDAO.getPresentationTemplates(cb);
                    }
                ], function(err, results) {

                        var endTime = new Date();
                        log.info("MANAGEMENT ROUTER QUERIES TIME: " + (endTime - startTime) / 1000);

                        if (err) {
                            res.render("management", {
                                errors: err.message, 
                                permissions: null, 
                                currentUser: currentUser, 
                                config: viewConfig,
                                presentations:null, 
                                presentTemplates:null, 
                                availableWidgets:null, 
                                userTags: null, 
                                accounts: null, 
                                foundUsers: null, 
                                apps: null, 
                                presentUsers:null, 
                                admins: null, 
                                assets:null,
                                groups: null,
                                availableGroups: null
                            });
                        } else {
                            res.render("management", {
                                errors: null, 
                                permissions: currentUserPermissions, 
                                currentUser: currentUser, 
                                config: viewConfig,
                                availableWidgets:results[9],
                                presentations:results[10],
                                presentTemplates:results[11],
                                userTags: results[0],
                                accounts: results[1],
                                foundUsers: results[2],
                                apps: results[3],
                                presentUsers:results[4],
                                admins: results[5],
                                assets: results[6],
                                groups: results[7],
                                availableGroups: results[8],
                                otherCompanyData:otherCompanyData
                            });
                        }
                });
            }
        }
    });
});

module.exports = router;
