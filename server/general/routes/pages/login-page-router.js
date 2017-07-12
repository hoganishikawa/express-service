"use strict";

var express = require("express"),
    router = express.Router(),
    checkAuth = require("../../core/user/check-auth"),
    consts = require("../../../libs/consts"),
    config = require("../../../config");

router.get("/", function(req, res, next) {

    var url = req.header("host");
    if (url && url.indexOf("api-") > -1){
        var apidocUrl = url.replace("api-", "");
        res.redirect("http://" + apidocUrl + "/documentation");
    }

    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            var viewConfig = config.getMany("env", "cdn", "siteAnalytics");
            return res.render("login", {config: viewConfig});
            //res.render("management", {errors: findUserErr, permissions: null, currentUser: null});
        } else {

            var defaultAppUrl = config.get("FORCED_LOGIN_REDIRECT_URL");
            if (!defaultAppUrl) {
                if (currentUser.defaultApp) {
                    var apps = config.get("apps");
                    defaultAppUrl = apps[currentUser.defaultApp];
                } else {
                    defaultAppUrl = consts.DATA_SENCE_PAGE_URL;
                }
            }
            res.redirect(defaultAppUrl);
        }
    });
});

module.exports = router;
