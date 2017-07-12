"use strict";

var userDAO = require("../dao/user-dao"),
    consts = require("../../../libs/consts");

module.exports = function(req, res, next, callback) {
    var incorrectSessionErr = new Error(consts.INCORRECT_SESSION);
    incorrectSessionErr.status = 403;

    var authHeader = req.headers.authorization;
    if (!req.session.userId && !authHeader) {
        callback(incorrectSessionErr, null);
    } else {
        if (req.session.userId) {
            userDAO.getUserById(req.session.userId, function (findUserErr, findUser) {
                if (findUserErr) {
                    callback(findUserErr, null);
                } else {
                    callback(null, findUser);
                }
            });
        } else {
            /* we must:
            1) find session by sessionId
            2)extract userId from session
            3)find user by id
            * */
            userDAO.getUserBySessionId(authHeader, callback);
        }
    }
};