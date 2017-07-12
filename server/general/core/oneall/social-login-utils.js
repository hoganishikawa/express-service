"use strict";

var nodeUtil = require("util"),
    async = require("async"),
    config = require("../../../config"),
    consts = require("../../../libs/consts"),
    request = require("request"),
    userDAO = require("../../core/dao/user-dao"),
    utils = require("../../../libs/utils"),
    //BASE_URL = "%s/?%s&auth-id=%s&auth-token=%s";
    BASE_URL = "%s/connections/%s.json",
    USERS_URL = "%s/users/%s.json";

function getUserJSON (connectionToken, authHeader, callback) {
    var apiUrl = config.get("oneall:apiUrl"),
        fullUrl = nodeUtil.format(BASE_URL, apiUrl, connectionToken);

    request.get({
        uri: fullUrl,
        headers: {
            "Authorization": authHeader
        }
    }, function (err, res, body) {
        if (err) {
            callback(err);
        } else {
            var userJSON = JSON.parse(body);
            callback(null, userJSON);
        }
    });
}

function processSocialAction(userJSON, req, res, callback) {
    var jsonErr = new Error(consts.UNEXPECTED_ONEALL_RESPONSE);
    jsonErr.status = 422;

    if (userJSON && userJSON.response && userJSON.response.result && userJSON.response.result.data) {
        var data = userJSON.response.result.data;
        var socialToken = null;
        if(data.user) {
            socialToken = utils.getObjectValue(data.user, "user_token");
        }

        switch (data.plugin.key) {
            case  "social_login":
                if(data.plugin.data.status === "success") {
                    userDAO.getUserBySocialToken(socialToken, function(foundUserError, foundUserResult) {
                        if (foundUserError) {
                            callback(foundUserError, null);
                        } else {
                            callback(null, foundUserResult);
                        }
                    });
                } else {
                    callback(jsonErr, null);
                }
                break;
            case "social_link":
                if(data.plugin.data.status ===  "success") {
                    //only logged user can perform social link, so we can find user by session
                    async.waterfall([
                        function(cb) {
                            userDAO.getUserById(req.session.userId, cb);
                        },
                        function(currentUser, cb) {

                            if(data.plugin.data.action ===  "link_identity") {
                                //we should save social token to current user
                                if(!currentUser.socialToken) {
                                    currentUser.socialToken = socialToken;
                                    userDAO.saveUser(currentUser, cb);
                                } else {
                                    cb(null, currentUser);
                                }
                            } else if(data.plugin.data.action ===  "unlink_identity") {
                                cb(null, currentUser);
                            }
                        }
                    ], function (error, foundUserResult) {
                        if (error) {
                            callback(error, null);
                        } else {
                            callback(null, foundUserResult);
                        }
                    });

                } else {
                    callback(jsonErr, null);
                }
                break;
            default :
                callback(jsonErr, null);
                break;
        }
    } else {
        callback(jsonErr, null);
    }
}

function getUserBySocialLogin(connectionToken, req, res, finalCallback) {
    async.waterfall([
        function(callback) {

            var publicKey = config.get("oneall:publicKey"),
                privateKey = config.get("oneall:privateKey"),
                authorizationHeaderSource = (publicKey + ":" + privateKey),
                authorizationHeaderBase64 = new Buffer(authorizationHeaderSource).toString("base64"),
                authorizationHeader = "Basic " + authorizationHeaderBase64;

            getUserJSON(connectionToken, authorizationHeader, function(error, userJSON) {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, userJSON);
                }
            });
        },
        function(userJSON, callback) {
            processSocialAction(userJSON, req, res, function(error, foundUser) {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, foundUser);
                }
            });
        }
    ], function (error, foundUserResult) {
        if (error) {
            finalCallback(error, null);
        } else {
            finalCallback(null, foundUserResult);
        }
    });
}

function getAccountsAll (socialToken, req, res, finalCallback) {
    var apiUrl = config.get("oneall:apiUrl"),
        publicKey = config.get("oneall:publicKey"),
        privateKey = config.get("oneall:privateKey"),
        authorizationHeader = (publicKey + ":" + privateKey),
        authorizationHeaderBase64 = new Buffer(authorizationHeader).toString("base64"),
        fullUrl = nodeUtil.format(USERS_URL, apiUrl, socialToken);

    request.get({
        uri: fullUrl,
        headers: {
            "Authorization": "Basic " + authorizationHeaderBase64
        }
    }, function (err, res, body) {
        if (err) {
            finalCallback(err);
        } else {
            var bodyJSON = JSON.parse(body);
            var accountsJSON = [];
            
            if(bodyJSON && bodyJSON.response && bodyJSON.response.result && 
                bodyJSON.response.result.data && bodyJSON.response.result.data.user && 
                bodyJSON.response.result.data.user.identities ) {
                var identities = bodyJSON.response.result.data.user.identities;
                for(var i=0; i<identities.length; i++) {
                    var socialAccount = {
                        "provider" : identities[i].provider,
                        "displayName" : identities[i].displayName
                    };
                    if(identities[i].profileUrl) {
                        socialAccount.profileUrl = identities[i].profileUrl;
                    }
                    else {
                        socialAccount.profileUrl = identities[i].id;
                    }
                    accountsJSON.push(socialAccount);
                }
            }
            
            finalCallback(null, accountsJSON);
        }
    });
}

function getUserBySocialLoginMobile(connectionToken, nonce, req, res, finalCallback) {
    async.waterfall([
        function(callback) {

            var authorizationHeader = "OneAllNonce " + nonce;

            getUserJSON(connectionToken, authorizationHeader, function(error, userJSON) {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, userJSON);
                }
            });
        },
        function(userJSON, callback) {
            processSocialAction(userJSON, req, res, function(error, foundUser) {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, foundUser);
                }
            });
        }
    ], function (error, foundUserResult) {
        if (error) {
            finalCallback(error, null);
        } else {
            finalCallback(null, foundUserResult);
        }
    });
}

exports.getUserBySocialLogin = getUserBySocialLogin;
exports.getUserBySocialLoginMobile = getUserBySocialLoginMobile;
exports.getAccountsAll  = getAccountsAll;