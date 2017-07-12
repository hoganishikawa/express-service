"use strict";

var express = require("express"),
    router = express.Router(),
    checkAuth = require("../../core/user/check-auth"),
    //consts = require("../../../libs/consts"),
    config = require("../../../config");
var viewConfig;

router.get("/", function(req, res, next) {

    checkAuth(req, res, next, function(findUserErr, currentUser) {
        viewConfig = config.getMany("env", "cdn", "siteAnalytics");
            
        if (findUserErr) {
            return res.render("test", {config: viewConfig});
            //res.render("management", {errors: findUserErr, permissions: null, currentUser: null});
        } else {
            return res.render("test", {config: viewConfig});
        }
    });
});

module.exports = router;
