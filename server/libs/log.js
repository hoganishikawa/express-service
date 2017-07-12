"use strict";

var winston = require("winston");
var argv = require("minimist")(process.argv.slice(2));


var logLevel = "info";
if ("log-debug" in argv) {
    logLevel = "debug";
} else if ("log-silly" in argv) {
    logLevel = "silly";
}


function getLogger(module) {
    var path = module.filename.split("\\").slice(-1);

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: logLevel,
                label: path
            }),

            new winston.transports.File({
                filename: "errors.log",
                level: "error",
                json: false,
                /*handleExceptions: true,*/
                label: path
            })

        ]
    });
}

module.exports = getLogger;
