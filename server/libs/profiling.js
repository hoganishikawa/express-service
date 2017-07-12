/**
 * Created 27 Mar 2015
 */
"use strict";

var log = require("./log")(module),
    config = require("../config");


/**
 * this class is used to receive the estimation of response time
 * for different elements of ASSurf elements (#91266342)
 */
var TimeProfiler = function(initPrefix) {
    this.initPrefix = initPrefix;
};


TimeProfiler.prototype.getLabel = function(id) {
    var label = "profiling.";
    if (this.initPrefix) {
        label += this.initPrefix + ".";
    }
    label += id;
    return label;
};


//
TimeProfiler.prototype.start = function(id) {
    var label  = this.getLabel(id);
    log.debug("registering: " + label);
    console.time(label);
};


TimeProfiler.prototype.endTime = function(id) {
    try {
        var label  = this.getLabel(id);
        console.timeEnd(label);
    } catch (err) {
        log.error("Profiling response time error: " +  err);
    }
};


// create new scope
TimeProfiler.prototype.createScope = function(id) {
    var newPrefix = this.initPrefix ? this.initPrefix + "." : "";
    newPrefix += id;
    return new TimeProfiler(newPrefix);
};


module.exports = function(id) {

    // return fake if profiling is disabled
    if (config.get("TIME_PROFILING_ENABLE") !== true) {
        var FakeProfiler = function () { };
        FakeProfiler.prototype.start = function () { };
        FakeProfiler.prototype.endTime = function () { };
        FakeProfiler.prototype.createScope = function (id) { return new FakeProfiler(); };
        return new FakeProfiler();
    }

    return new TimeProfiler(id);
};
