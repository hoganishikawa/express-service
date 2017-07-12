"use strict";

var express = require("express"),
    router = express.Router(),
    log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    userDAO = require("../../core/dao/user-dao"),
    consts = require("../../../libs/consts"),
    authUtils = require("../../core/user/auth-utils");

router.post("/users/login", function(req, res, next) {

    res.clearCookie(consts.USER_COOKIE.STATUS_COOKIE_NAME);

    var origin = req.headers.origin;
    log.info("origin:" + origin);

    var email = req.body.email;
    var password = req.body.password;
    var rememberMe = req.body.rememberMe;
    var os = req.body.os;

    var validateErrors = [];
    if (!email) {
        validateErrors.push(consts.EMAIL_REQUIRED);
    }
    if (!password) {
        validateErrors.push(consts.PASSWORD_REQUIRED);
    }
    /*if (typeof rememberMe !== "boolean") {
        validateErrors.push("specify correct remember me");
    }*/

    if (validateErrors.length > 0) {
        return next(new Error(validateErrors.join(", ")));
    } else {
        /*
        log.info("email: %s", email);
        log.info("password: %s", password);
        log.info("rememberMe: %s", rememberMe);
        */
        log.info("rememberMe: %s", rememberMe);

        userDAO.getUserByEmail(email, function (err, findUser) {
            if (err) {
                if(err.status === 403) {
                    err.message = consts.INCORRECT_LOGIN_OR_PASSWORD;
                }
                return next(err);
            } else {
                findUser.checkPassword(password, function (checkPassErr, isMatch) {
                    if(checkPassErr) {
                        return next(checkPassErr);
                    } else {
                        if(isMatch) {
                            if (rememberMe === "true" && !os) {
                                log.info("one year expiration");
                                req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                            }

                            authUtils.loginUser(findUser, os, req, res, next, function(loginErr, loginResult) {
                                if(loginErr) {
                                    return next(loginErr);
                                } else {
                                    return utils.successResponse(loginResult, res, next);
                                }
                            });
                        } else {
                            var userErr = new Error(consts.INCORRECT_LOGIN_OR_PASSWORD);
                            userErr.status = 403;
                            return next(userErr);
                        }
                    }
                });
            }
        });
    }
});

router.post("/users/logout", function(req, res, next) {
    utils.destroySession(req);
    var fullUrl = utils.getDomain(null, true) + consts.LOGIN_PAGE_URL;
    return utils.successResponse(fullUrl, res, next);
});

module.exports = router;