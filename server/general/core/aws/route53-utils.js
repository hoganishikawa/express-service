"use strict";

var AWS = require("aws-sdk"),
    config = require("../../../config");
    
function setCredentials() {
    AWS.config.update({
        accessKeyId: config.get("aws:auth:accessKeyId"),
        secretAccessKey: config.get("aws:auth:secretAccessKey"),
        region: config.get("aws:auth:region")
    });
}

function getParams(companyName, isCREATE) {
    var params = {
        ChangeBatch: {
            Changes: [
                {
                    Action: isCREATE? "CREATE" : "DELETE",
                    ResourceRecordSet: {
                        Name: companyName + config.get("aws:route53:ResourceRecordSetBaseName"),
                        Type: "CNAME",
                        ResourceRecords: [
                            {
                                Value: config.get("aws:route53:resourceRecordValue")
                            }
                        ],
                        TTL: 60
                    }
                }
            ]
        },
        HostedZoneId: config.get("aws:route53:hostedZoneId")
    };

    return params;
}

function addCNAME(companyName, callback) {
    setCredentials();

    var route53 = new AWS.Route53();
    var params = getParams(companyName, true);
    route53.changeResourceRecordSets(params, callback);
}

function deleteCNAME(companyName, callback) {
    setCredentials();

    var route53 = new AWS.Route53();
    var params = getParams(companyName, false);
    route53.changeResourceRecordSets(params, callback);
}

exports.addCNAME = addCNAME;
exports.deleteCNAME = deleteCNAME;