"use strict";

var mongoose = require("mongoose"),
    utils = require("../../../libs/utils"),
    presentationDAO = require("../../../bl-brighter-view/core/dao/presentation-dao"),
    config = require("../../../config"),
    consts = require("../../../libs/consts"),
    uuid = require("node-uuid");

function webLogin(loggedinUser, sessionsCollection, req, res, next, callback) {
    req.session.userId = loggedinUser._id;

    var defaultAppUrl = null;
    if (loggedinUser.defaultApp) {
        var apps = config.get("apps");
        defaultAppUrl = apps[loggedinUser.defaultApp];
    } else {
        defaultAppUrl = consts.DATA_SENCE_PAGE_URL;
    }

    var loginRedirectUrl = config.get("FORCED_LOGIN_REDIRECT_URL");
    if (loginRedirectUrl) {
        callback(null, loginRedirectUrl);
    } else if (defaultAppUrl === consts.MANAGEMENT_PAGE_URL) {
        presentationDAO.getLastEditedPresentationId(loggedinUser,
            function (findPresentationErr, lastEditedPresentationId) {
                if (findPresentationErr) {
                    callback(findPresentationErr);
                } else {
                    var managementUrl = consts.MANAGEMENT_PAGE_URL + "?id=" + lastEditedPresentationId;
                    var fullUrl = utils.getDomain(req, false) + managementUrl;
                    callback(null, fullUrl);
                }
            }
        );
    } else {
        var fullUrl = utils.getDomain(req, false) + defaultAppUrl;
        callback(null, fullUrl);
    }
}

function mobileLogin(loggedinUser, sessionsCollection, req, res, next, callback) {
    //build session obj

    var sessionFieldObject = {
        cookie: {
            originalMaxAge: null,
            expires: null,
            secure: false,
            httpOnly: true,
            domain: utils.isDevelopmentEnv() ? null : config.get("session:cookieDomain"),
            path: "/"
        },
        userId: loggedinUser._id.toString()
    };

    var d = new Date();
    d.setMonth(d.getMonth() + 8);

    var document = {
        _id: uuid.v1(),
        session: JSON.stringify(sessionFieldObject),
        expires: d
    };

    sessionsCollection.insert(document, {w: 1}, function(insertErr, records){
        if(insertErr) {
            callback(insertErr);
        } else {

            //delete very important fields
            var userObj = loggedinUser.toObject();
            delete userObj.tokens;
            delete userObj.password;
            delete userObj.previousPasswords;

            var returnData = {
                user: userObj,
                token: records[0]._id.toString()
            };

            callback(null, returnData);
        }
    });
}

function loginUser(loggedinUser, os, req, res, next, callback) {

    var sessionsCollection = mongoose.connection.db.collection("sessions");

    var userId = "'userId':'" + loggedinUser._id.toString() + "'";
    //console.log(userId);

    sessionsCollection.remove({"session": {$regex : userId}}, function (err) {
        if (err) {
            callback(err);
        } else {

            if(os) {
                mobileLogin(loggedinUser, sessionsCollection, req, res, next, callback);
            } else {
                webLogin(loggedinUser, sessionsCollection, req, res, next, callback);
            }

        }
    });
}

module.exports.loginUser = loginUser;