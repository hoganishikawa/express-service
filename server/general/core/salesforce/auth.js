"use strict";

var config = require("../../../config"),
    sf = require("node-salesforce");

/**
 * Creates sfdc connection object
 * @return  {object}
 */
function getSFConnection() {
    var con = new sf.Connection({
        loginUrl: config.get("salesforce:auth:url")
    });

    return con;
}

/**
 * Creates sfdc auth data
 * @return  {object}
 */
function getSFAuthData() {
    return {
        username: config.get("salesforce:auth:username"),
        password: config.get("salesforce:auth:password")
    };
}

exports.getSFConnection = getSFConnection;
exports.getSFAuthData = getSFAuthData;