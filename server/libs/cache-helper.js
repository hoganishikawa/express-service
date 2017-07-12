/**
 * Created 26 Mar 2015
 */
"use strict";

var log = require("./log")(module);

/**
 * Save in redis result of function, return from cache if exists
 *
 * This wrapper test if the result of function in cache
 * if exists in cache - then the result from cache will be return
 * if not, then the function will be called like func(next) and result of function will
 * be stored in redis with expire
 *
 * @param func - the function
 * @param cache - the cache object (redis usually)
 * @param cacheKey {String} the key in cache
 * @param expire {Integer} expire in seconds
 * @param next callback
 *
 * Example of usage:
 * someComplicatedLongFunc should have next signature:
 * someComplicatedLongFunc(param1, param2, ... paramN, callback);
 *
 * var key = func(param1, param2, param3);
 * var func = someComplicatedLongFunc.bind(null, param1, param2, param3, ... paramN);
 *
 * cacheFunctionWrapper(cacheObject, func, key, 3600, callback);
 */
function cacheFunctionWrapper(func, cache, cacheKey, expire, next) {

    log.silly("cache key = " + cacheKey + ", expire = " + expire);

    cache.get(cacheKey, function(err, data) {

        if (err) {
            log.error(err);
        }

        if (data) {
            try {
                // we have found a cache in the redis
                var result = JSON.parse(data);
                log.silly("result from cache");
                return next(null, result);
            } catch (e) {
                // nothing here, just corrupted cache
                log.warn("Can't parse json data from cache");
            }
        }

        log.silly("no result in cache");
        // we didn't find in cache, run the function
        func(function(err, data) {
            if (err) {
                return next(err);
            }
            if (data) {
                cache.setex(cacheKey, expire, JSON.stringify(data), function(err) {
                    if (err) {
                        log.warn(err);
                    }
                    return next(err, data);
                });
            } else {
                return next(err, data);
            }
        });
    });
}

module.exports.cacheFunctionWrapper = cacheFunctionWrapper;
