"use strict";

var loginPageRouter = require("./pages/login-page-router"),
    testPageRouter = require("./pages/test-page-router"),
    setpasswordPageRouter = require("./pages/setpassword-page-router"),
    authAPIRouter = require("./apis/auth-api-router"),
    accountAPIRouter = require("./apis/account-api-router"),
    assetsAPIRouter = require("./apis/assets-api-router"),
    userAPIRouter = require("./apis/user-api-router"),
    passwordAPIRouter = require("./apis/password-api-router"),
    emailAPIRouter = require("./apis/email-api-router"),
    enphaseAPIRouter = require("./apis/enphase-api-router"),
    tagRuleAPIRouter = require("./apis/tag-rule-api-router"),
    tagAPIRouter = require("./apis/tag-api-router"),
    //dataSourceAPIRouter = require("./apis/data-source-api-router"),
    tagaccessibleAPIRouter = require("./apis/tag-accessible-api-router"),
    socialLoginRouter = require("./apis/social-login-api-router"),
    salesforceAPIRouter = require("./apis/salesforce-api-router"),
    locationAPIRouter = require("./apis/location-api-router"),
    collectionAPIRouter = require("./apis/collection-api-router"),
    othersAPIRouter = require("./apis/others-api-router"),
    groupAPIRouter = require("./apis/group-api-router"),
    presentDeviceAPIRouter = require("./apis/present-device-api-router"),
    config = require("../../config");

function register(app, registerOnlyAPIs) {
    //pages routes

    var express = require("express");
    var subdomain = require("express-subdomain");
    var router = express.Router();

    app.use(subdomain("api", router));
    router.get("/", function(req, res, next){
        res.redirect("http://" + req.get("Host") + "/documentation");
    });

    if(!registerOnlyAPIs) {
        app.use("/", loginPageRouter);
        app.use("/login", loginPageRouter);
        app.use("/setpassword", setpasswordPageRouter);
        app.use("/test", testPageRouter);
    }

    //api routes with Version
    app.use(["/" + config.get("api:version") + "/users", "/users"], userAPIRouter);
    app.use(["/" + config.get("api:version") + "/users/password", "/users/password"], passwordAPIRouter);
    app.use(["/" + config.get("api:version") + "/accounts", "/accounts"], accountAPIRouter);
    app.use(["/" + config.get("api:version") + "/tags", "/tags"], tagAPIRouter);
    app.use(["/" + config.get("api:version") + "/tags/accessible", "/tags/accessible"], tagaccessibleAPIRouter);
    app.use(["/" + config.get("api:version") + "/collection", "/collection"], collectionAPIRouter);
    app.use(["/" + config.get("api:version") + "/general/assets", "/general/assets"], assetsAPIRouter);
    app.use(["/" + config.get("api:version") + "/notifications/email", "/notifications/email"], emailAPIRouter);
    app.use(["/" + config.get("api:version") + "/users/enphase", "/users/enphase"], enphaseAPIRouter);
    app.use(["/" + config.get("api:version") + "/tags/rules", "/tags/rules"], tagRuleAPIRouter);
    app.use(["/" + config.get("api:version") + "/", "/"], authAPIRouter);
    app.use(["/" + config.get("api:version") + "/sociallogin", "/sociallogin"], socialLoginRouter);
    app.use(["/" + config.get("api:version") + "/salesforce", "/salesforce"], salesforceAPIRouter);
    app.use(["/" + config.get("api:version") + "/location", "/location"], locationAPIRouter);
    app.use(["/" + config.get("api:version") + "/others", "/others"], othersAPIRouter);
    app.use(["/" + config.get("api:version") + "/groups", "/groups"], groupAPIRouter);
    app.use(["/" + config.get("api:version") + "/presentdevices", "/presentdevices"], presentDeviceAPIRouter);
}

exports.register = register;
