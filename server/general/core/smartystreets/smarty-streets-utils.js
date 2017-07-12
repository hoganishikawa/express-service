"use strict";

var nodeUtil = require("util"),
    config = require("../../../config"),
    request = require("request"),
    BASE_URL = "%s/?%s&auth-id=%s&auth-token=%s";


function getAddress(query, callback) {
    var apihUrl = config.get("smartystreets:apiUrl");
    var authId = config.get("smartystreets:authId");
    var authToken = config.get("smartystreets:authToken");
    var fullUrl = nodeUtil.format(BASE_URL, apihUrl, query, authId, authToken);

    console.log(fullUrl);

    request.get({
        uri:fullUrl
    },function(err,res,body){
        if(err) {
            callback(err);
        } else {
            if(body) {
                var obj = JSON.parse(body);
                callback(null, obj);
            } else {
                callback(null, []);
            }
        }
    });
}

exports.getAddress = getAddress;