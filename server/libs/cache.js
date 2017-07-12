"use strict";

var config = require("../config"),
    utils = require("./utils"),
    consts = require("./consts"),
    async = require("async"),
    redis = require("redis"),
    client = redis.createClient(config.get("redis:port"), config.get("redis:host"));

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

require("redis-scanstreams")(redis);

client.on("error", function (err) {
    err.name = "RedisError";
    utils.logError(err);
});

redis.RedisClient.prototype.getWildCardKeys = function(key, callback) {
    var rediscli = this;
    var keys = [];

    var stream = rediscli.scan({
        pattern: key,
        count: 1000
    });

    stream.on("data", function(chunk) {
        keys.push(chunk);
    });

    stream.on("end", function() {
        callback(null, keys);
    });

    stream.on("error", function(err) {
        callback(null, err);
    });

};

redis.RedisClient.prototype.delMultipleKeys = function(keys, callback) {
    var rediscli = this;

    if(keys.length > 0) {
        async.each(keys, function (row, callbackDelete) {
            rediscli.del(row, callbackDelete);
        }, function (err) {
            if (err) {
                callback(null, err);
            } else {
                callback(null, consts.OK);
            }
        });
    } else {
        callback(null, consts.OK);
    }

};

redis.RedisClient.prototype.delWildcardKey = function(key, callback) {
    var rediscli = this;

    rediscli.getWildCardKeys(key, function(err, keys) {
        if(err) {
            callback(err);
        } else {
            rediscli.delMultipleKeys(keys, callback);
        }
    });

};

redis.RedisClient.prototype.delWildcarKeyFromHash = function(hashWildcardKey, hashFieldKey, callback) {
    var rediscli = this;

    rediscli.getWildCardKeys(hashWildcardKey, function(err, keys) {
        if(err) {
            callback(err);
        } else {
            if(keys.length > 0) {
                async.each(keys, function (row, callbackDelete) {
                    rediscli.hdel(row, hashFieldKey, callbackDelete);
                }, function (err) {
                    if (err) {
                        callback(null, err);
                    } else {
                        callback(null, consts.OK);
                    }
                });
            } else {
                callback(null, consts.OK);
            }
        }
    });

};

function getCache() {
    return client;
}

module.exports = getCache();