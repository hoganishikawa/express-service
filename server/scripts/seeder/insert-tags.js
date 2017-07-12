"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    Tag = mongoose.model("tag"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    async = require("async"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils");

function insertTags(finalCallback) {

    Tag.remove({}, function (err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var tags = [];
                    tags.push({
                        "_id": new ObjectId("5458a2acb0091419007e03df"),
                        "tagType": "Facility",
                        "name": "Liberty Lofts",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [{
                            "appName" : "Dashboard",
                            "id" : new ObjectId("5461ff1251d2f91500187462")
                        }],
                        "children": [
                            {
                                "id" : new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType" : "Scope"
                            }
                        ],
                        "parents": [],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": "",
                        "nonProfit": null,
                        "taxID": null,
                        "street": "",
                        "state": "",
                        "postalCode": "",
                        "country": "",
                        "city": ""
                    });
                    tags.push({
                        "_id" : new ObjectId("5458a84f5409c90e00884cdf"),
                        "tagType" : "Scope",
                        "name" : "Liberty Lofts eGauge",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v" : 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458a8a95409c90e00884ce0"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458aea9fe540a120074c206"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af11fe540a120074c207"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af22fe540a120074c208"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af36fe540a120074c209"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af3ffe540a120074c20a"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af53fe540a120074c20b"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af72fe540a120074c20c"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af85fe540a120074c20d"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458af9bfe540a120074c20e"),
                                "tagType": "Node"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a2acb0091419007e03df"),
                                "tagType": "Facility"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": "http://egauge8795.egaug.es/",
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": "Download via API",
                        "timezone": "Central Daylight Time",
                        "deviceID": "egauge8795",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458a8a95409c90e00884ce0"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter A",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458a8bc5409c90e00884ce1"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter A",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter A",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458a8bc5409c90e00884ce1"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458a8a95409c90e00884ce0"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458aea9fe540a120074c206"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter A+",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb0179fd7a46009ef843"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter A+",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter A+",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af11fe540a120074c207"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter B",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb1479fd7a46009ef844"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter B",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter B",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("5458af22fe540a120074c208"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter B+",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb1f79fd7a46009ef845"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter B+",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter B+",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af36fe540a120074c209"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter C",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb3179fd7a46009ef846"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter C",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter C",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af3ffe540a120074c20a"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Solar Inverter C+",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [
                            {
                                "id": new ObjectId("5458eb4379fd7a46009ef847"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter C+",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Solar Inverter C+",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af53fe540a120074c20b"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Elevator",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458eb5479fd7a46009ef848"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Elevator",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Elevator",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af72fe540a120074c20c"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Garage Lighting",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458eb5e79fd7a46009ef849"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Garage Lighting",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Garage Lighting",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af85fe540a120074c20d"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Lobby Lighting",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458eb6a79fd7a46009ef84a"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Lobby Lighting",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Lobby Lighting",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458af9bfe540a120074c20e"),
                        "tagType": "Node",
                        "nodeType": "Supply",
                        "name": "Liberty Lofts: Lot Lights",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 2,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545cee9b7f99954600348f4d"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458eb7779fd7a46009ef84b"),
                                "tagType": "Metric"
                            },
                            {
                                "tagType": "Metric",
                                "id": new ObjectId("545cef9f7f99954600348f52")
                            },
                            {
                                "tagType": "Metric",
                                "id": new ObjectId("545cefc77f99954600348f53")
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458a84f5409c90e00884cdf"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Lot Lights",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "egauge8795:Lot Lights",
                        "device": "EG3000",
                        "manufacturer": "eGauge",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458afc6fe540a120074c20f"),
                        "tagType": "Facility",
                        "name": "Barretts Elementary",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("5457e1990c5a5d2700affe77"),
                                "appName": "Dashboard"
                            },
                            {
                                "id": new ObjectId("5461363bdfef7c4800146f4b"),
                                "appName": "Dashboard"
                            },
                            {
                                "id": new ObjectId("5461ff0951d2f91500187461"),
                                "appName": "Dashboard"
                            },
                            {
                                "id": new ObjectId("5461ff1251d2f91500187462"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458b01afe540a120074c210"),
                                "tagType": "Scope"
                            }
                        ],
                        "parents": [],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": "",
                        "nonProfit": null,
                        "taxID": null,
                        "street": "",
                        "state": "",
                        "postalCode": "",
                        "country": "",
                        "city": "",
                        "displayName": "Some renamed facility"
                    });
                    tags.push({
                        "_id": new ObjectId("5458b01afe540a120074c210"),
                        "tagType": "Scope",
                        "name": "Barretts Elementary: Sunny WebBox",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("5457e33f0c5a5d2700affe7c"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            },
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458afc6fe540a120074c20f"),
                                "tagType": "Facility"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -90.47239999999999,
                        "latitude": 38.5763,
                        "timezone": "Central Daylight Time",
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": "54.201.16.210",
                        "accessMethod": "Push to FTP",
                        "deviceID": "wb150115159",
                        "device": "Sunny WebBox",
                        "manufacturer": "SMA",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "displayName": "Hello"
                    });
                    tags.push({
                        "_id": new ObjectId("5458b22379e7b60e00b1133a"),
                        "tagType": "Node",
                        "nodeType": "Solar",
                        "name": "Barretts Elementary: Inverter A",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458b27e79e7b60e00b1133c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c522c0fa5a0e0045f178"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c54dc0fa5a0e0045f179"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c56dc0fa5a0e0045f17b"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c597c0fa5a0e0045f17d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c646c0fa5a0e0045f17f"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c664c0fa5a0e0045f182"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c699c0fa5a0e0045f183"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6bec0fa5a0e0045f186"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6e1c0fa5a0e0045f188"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6f1c0fa5a0e0045f189"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c717c0fa5a0e0045f18c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c735c0fa5a0e0045f18d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c75bc0fa5a0e0045f18f"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c781c0fa5a0e0045f191"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c793c0fa5a0e0045f193"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c7bec0fa5a0e0045f195"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c7e5c0fa5a0e0045f197"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c805c0fa5a0e0045f199"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c83fc0fa5a0e0045f19b"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906ddded7ea0f0079840c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906e4ded7ea0f0079840d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906edded7ea0f0079840e"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906edded7ea0f0079940e"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458b01afe540a120074c210"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter A",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -90.47239999999999,
                        "latitude": 38.5763,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "WR7KU009:2002112342",
                        "device": "Sunny WebBox",
                        "manufacturer": "SMA",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458b23e79e7b60e00b1133b"),
                        "tagType": "Node",
                        "nodeType": "Solar",
                        "name": "Barretts Elementary: Inverter B",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458b2aa79e7b60e00b1133d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c4edc0fa5a0e0045f177"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c55ac0fa5a0e0045f17a"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c56fc0fa5a0e0045f17c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c59ac0fa5a0e0045f17e"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c649c0fa5a0e0045f180"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c663c0fa5a0e0045f181"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c69cc0fa5a0e0045f184"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6bcc0fa5a0e0045f185"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6dec0fa5a0e0045f187"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c6f5c0fa5a0e0045f18a"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c714c0fa5a0e0045f18b"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c737c0fa5a0e0045f18e"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c75ec0fa5a0e0045f190"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c784c0fa5a0e0045f192"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c798c0fa5a0e0045f194"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c7c1c0fa5a0e0045f196"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c7e8c0fa5a0e0045f198"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c808c0fa5a0e0045f19a"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458c841c0fa5a0e0045f19c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906f7ded7ea0f0079840f"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("545906feded7ea0f00798410"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("54590706804783290060e700"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458b01afe540a120074c210"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter B",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -90.47239999999999,
                        "latitude": 38.5763,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "WR7KU009:2002112282",
                        "device": "Sunny WebBox",
                        "manufacturer": "SMA",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458b27e79e7b60e00b1133c"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458b2aa79e7b60e00b1133d"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                        "tagType": "Node",
                        "nodeType": "Solar",
                        "name": "Barretts Elementary: Inverter C",
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [
                            {
                                "id": new ObjectId("545ed97a649db6140038fc64"),
                                "appName": "Dashboard"
                            }
                        ],
                        "children": [
                            {
                                "id": new ObjectId("5458ba46c0fa5a0e0045f162"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bbf0c0fa5a0e0045f163"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc02c0fa5a0e0045f164"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc29c0fa5a0e0045f165"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc53c0fa5a0e0045f166"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc61c0fa5a0e0045f167"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc73c0fa5a0e0045f168"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bc81c0fa5a0e0045f169"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bca4c0fa5a0e0045f16a"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bccbc0fa5a0e0045f16b"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bce6c0fa5a0e0045f16c"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd23c0fa5a0e0045f16d"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd52c0fa5a0e0045f16f"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd5fc0fa5a0e0045f170"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd70c0fa5a0e0045f171"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd7ac0fa5a0e0045f172"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bd8cc0fa5a0e0045f173"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bdabc0fa5a0e0045f174"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bdb6c0fa5a0e0045f175"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5458bdc7c0fa5a0e0045f176"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("54590712804783290060e701"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5459071e1c1bb134009a9757"),
                                "tagType": "Metric"
                            },
                            {
                                "id": new ObjectId("5459072a1c1bb134009a9758"),
                                "tagType": "Metric"
                            }
                        ],
                        "parents": [
                            {
                                "id": new ObjectId("5458b01afe540a120074c210"),
                                "tagType": "Scope"
                            }
                        ],
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "sensorTarget": "Solar Inverter C",
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": -90.47239999999999,
                        "latitude": 38.5763,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "WR8KU002:2002126708",
                        "device": "Sunny WebBox",
                        "manufacturer": "SMA",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458ba46c0fa5a0e0045f162"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bbf0c0fa5a0e0045f163"),
                        "tagType": "Metric",
                        "name": "Target Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess": [
                            {
                                "id": new ObjectId("54135f90c6ab7c241e28095e")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-Setpoint",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc02c0fa5a0e0045f164"),
                        "tagType": "Metric",
                        "name": "Direct Voltage to Ground",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-_PE",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc29c0fa5a0e0045f165"),
                        "tagType": "Metric",
                        "name": "Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc53c0fa5a0e0045f166"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL1",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc61c0fa5a0e0045f167"),
                        "tagType": "Metric",
                        "name": "Line Voltage L2-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL2",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc73c0fa5a0e0045f168"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-L2",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bc81c0fa5a0e0045f169"),
                        "tagType": "Metric",
                        "name": "Temperature",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bca4c0fa5a0e0045f16a"),
                        "tagType": "Metric",
                        "name": "# of Grid Connections",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Power On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bccbc0fa5a0e0045f16b"),
                        "tagType": "Metric",
                        "name": "Maximum Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bce6c0fa5a0e0045f16c"),
                        "tagType": "Metric",
                        "name": "Max Temperature at IGBT Module",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd23c0fa5a0e0045f16d"),
                        "tagType": "Metric",
                        "name": "Current",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Ipv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": 70,
                        "latitude": 47,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd52c0fa5a0e0045f16f"),
                        "tagType": "Metric",
                        "name": "Input Terminal Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "I-dif",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd5fc0fa5a0e0045f170"),
                        "tagType": "Metric",
                        "name": "Grid Current Phase",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Iac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd70c0fa5a0e0045f171"),
                        "tagType": "Metric",
                        "name": "Total Feed-In Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd7ac0fa5a0e0045f172"),
                        "tagType": "Metric",
                        "name": "Operating Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bd8cc0fa5a0e0045f173"),
                        "tagType": "Metric",
                        "name": "Frequency",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Fac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bdabc0fa5a0e0045f174"),
                        "tagType": "Metric",
                        "name": "Number of Events",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Event-Cnt",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bdb6c0fa5a0e0045f175"),
                        "tagType": "Metric",
                        "name": "Total Yield",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "E-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458bdc7c0fa5a0e0045f176"),
                        "tagType": "Metric",
                        "name": "CO2 Saved",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "CO2 saved",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c4edc0fa5a0e0045f177"),
                        "tagType": "Metric",
                        "name": "Target Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-Setpoint",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c522c0fa5a0e0045f178"),
                        "tagType": "Metric",
                        "name": "Target Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-Setpoint",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c54dc0fa5a0e0045f179"),
                        "tagType": "Metric",
                        "name": "Direct Voltage to Ground",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-_PE",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c55ac0fa5a0e0045f17a"),
                        "tagType": "Metric",
                        "name": "Direct Voltage to Ground",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv-_PE",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c56dc0fa5a0e0045f17b"),
                        "tagType": "Metric",
                        "name": "Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c56fc0fa5a0e0045f17c"),
                        "tagType": "Metric",
                        "name": "Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c597c0fa5a0e0045f17d"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": "Line Voltage L1-N",
                        "metricID": "VacL1",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c59ac0fa5a0e0045f17e"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL1",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c646c0fa5a0e0045f17f"),
                        "tagType": "Metric",
                        "name": "Line Voltage L2-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL2",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c649c0fa5a0e0045f180"),
                        "tagType": "Metric",
                        "name": "Line Voltage L2-N",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "VacL2",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c663c0fa5a0e0045f181"),
                        "tagType": "Metric",
                        "name": "Temperature",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c664c0fa5a0e0045f182"),
                        "tagType": "Metric",
                        "name": "Temperature",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c699c0fa5a0e0045f183"),
                        "tagType": "Metric",
                        "name": "# of Grid Connections",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Power On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c69cc0fa5a0e0045f184"),
                        "tagType": "Metric",
                        "name": "# of Grid Connections",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Power On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6bcc0fa5a0e0045f185"),
                        "tagType": "Metric",
                        "name": "Maximum Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6bec0fa5a0e0045f186"),
                        "tagType": "Metric",
                        "name": "Maximum Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Vpv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6dec0fa5a0e0045f187"),
                        "tagType": "Metric",
                        "name": "Max Temperature at IGBT Module",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6e1c0fa5a0e0045f188"),
                        "tagType": "Metric",
                        "name": "Max Temperature at IGBT Module",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Max Temperature",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6f1c0fa5a0e0045f189"),
                        "tagType": "Metric",
                        "name": "Current",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Ipv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c6f5c0fa5a0e0045f18a"),
                        "tagType": "Metric",
                        "name": "Current",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Ipv",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c714c0fa5a0e0045f18b"),
                        "tagType": "Metric",
                        "name": "Input Terminal Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": "Input Terminal Voltage",
                        "metricID": "I-dif",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c717c0fa5a0e0045f18c"),
                        "tagType": "Metric",
                        "name": "Input Terminal Voltage",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "I-dif",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c735c0fa5a0e0045f18d"),
                        "tagType": "Metric",
                        "name": "Grid Current Phase",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Iac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c737c0fa5a0e0045f18e"),
                        "tagType": "Metric",
                        "name": "Grid Current Phase",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Iac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c75bc0fa5a0e0045f18f"),
                        "tagType": "Metric",
                        "name": "Total Feed-In Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c75ec0fa5a0e0045f190"),
                        "tagType": "Metric",
                        "name": "Total Feed-In Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c781c0fa5a0e0045f191"),
                        "tagType": "Metric",
                        "name": "Operating Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c784c0fa5a0e0045f192"),
                        "tagType": "Metric",
                        "name": "Operating Time",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "h-On",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c793c0fa5a0e0045f193"),
                        "tagType": "Metric",
                        "name": "Frequency",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Fac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c798c0fa5a0e0045f194"),
                        "tagType": "Metric",
                        "name": "Frequency",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Fac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c7bec0fa5a0e0045f195"),
                        "tagType": "Metric",
                        "name": "Number of Events",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Event-Cnt",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c7c1c0fa5a0e0045f196"),
                        "tagType": "Metric",
                        "name": "Number of Events",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Event-Cnt",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c7e5c0fa5a0e0045f197"),
                        "tagType": "Metric",
                        "name": "Total Yield",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "E-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c7e8c0fa5a0e0045f198"),
                        "tagType": "Metric",
                        "name": "Total Yield",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "E-Total",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c805c0fa5a0e0045f199"),
                        "tagType": "Metric",
                        "name": "CO2 Saved",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "CO2 saved",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c808c0fa5a0e0045f19a"),
                        "tagType": "Metric",
                        "name": "CO2 Saved",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "CO2 saved",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c83fc0fa5a0e0045f19b"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-L2",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458c841c0fa5a0e0045f19c"),
                        "tagType": "Metric",
                        "name": "Line Voltage L1-L2",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Vac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb0179fd7a46009ef843"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458aea9fe540a120074c206"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb1479fd7a46009ef844"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af11fe540a120074c207"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb1f79fd7a46009ef845"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af22fe540a120074c208"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb3179fd7a46009ef846"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af36fe540a120074c209"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb4379fd7a46009ef847"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af3ffe540a120074c20a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb5479fd7a46009ef848"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af53fe540a120074c20b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb5e79fd7a46009ef849"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af72fe540a120074c20c"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb6a79fd7a46009ef84a"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af85fe540a120074c20d"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5458eb7779fd7a46009ef84b"),
                        "tagType": "Metric",
                        "name": "Power (W)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af9bfe540a120074c20e"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545906ddded7ea0f0079840c"),
                        "tagType": "Metric",
                        "name": "Power (kW)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Average,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": 70,
                        "latitude": 47,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545906e4ded7ea0f0079840d"),
                        "tagType": "Metric",
                        "name": "Energy (Wh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079840e"),
                        "tagType": "Metric",
                        "name": "Energy (kWh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": -94.58940699999999,
                        "latitude": 39.083672,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940e"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b22379e7b60e00b1133a"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.3,
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906f7ded7ea0f0079840f"),
                        "tagType": "Metric",
                        "name": "Energy (Wh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545906feded7ea0f00798410"),
                        "tagType": "Metric",
                        "name": "Power (kW)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("54590706804783290060e700"),
                        "tagType": "Metric",
                        "name": "Energy (kWh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458b23e79e7b60e00b1133b"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("54590712804783290060e701"),
                        "tagType": "Metric",
                        "name": "Power (kW)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5459071e1c1bb134009a9757"),
                        "tagType": "Metric",
                        "name": "Energy (Wh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("5459072a1c1bb134009a9758"),
                        "tagType": "Metric",
                        "name": "Energy (kWh)",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458ba38c0fa5a0e0045f161"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "Pac",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });
                    tags.push({
                        "_id": new ObjectId("545cef9f7f99954600348f52"),
                        "name": "Energy (kWh)",
                        "tagType": "Metric",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135e285a749f381d2dd46a"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af9bfe540a120074c20e"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "__v": 1
                    });
                    tags.push({
                        "_id": new ObjectId("545cefc77f99954600348f53"),
                        "name": "Energy (Wh)",
                        "tagType": "Metric",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5458af9bfe540a120074c20e"),
                                "tagType": "Node"
                            }
                        ],
                        "formula": null,
                        "metricID": "W",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null,
                        "__v": 0
                    });


                    //-------------------------------------enphase sources
                    tags.push({
                        "_id" : new ObjectId("549012531e94a8881e6e8e54"),
                        "name" : "Enphase Facility",
                        "displayName": "Three witches watch three Swatch watches",
                        "tagType" : "Facility",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("549012d1c15488681a64b6ab")
                            },
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("54902ed7ba2ca1141e4afd72")
                            },
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("54902ee7ba2ca1141e4afd73")
                            },
                            {
                                "tagType" : "Scope",
                                "id" : new ObjectId("54902ef4ba2ca1141e4afd74")
                            }
                        ],
                        "parents" : [],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [
                            ""
                        ],
                        "utilityProvider" : "",
                        "nonProfit" : false,
                        "taxID" : "",
                        "address" : "",
                        "street" : "",
                        "state" : "",
                        "postalCode" : "",
                        "country" : "",
                        "city" : "",
                        "__v" : 4
                    });

                    tags.push({
                        "_id" : new ObjectId("549012d1c15488681a64b6ab"),
                        "name" : "Envoy_1",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [
                            {
                                "appName" : "Dashboard",
                                "id" : new ObjectId("5461fee651d2f9150018745f")
                            }
                        ],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5490307bba2ca1141e4afd75")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012531e94a8881e6e8e54"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : "Central Daylight Time",
                        "enphaseUserId" : "4d6a49784e7a67790a",
                        "endDate" : "2014-12-16T11:05:00.000Z",
                        "weatherStation" : "1",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Push to FTP",
                        "deviceID" : "415544",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("54902ed7ba2ca1141e4afd72"),
                        "name" : "Envoy_2",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [
                            {
                                "appName" : "Dashboard",
                                "id" : new ObjectId("5461fee651d2f9150018745f")
                            }
                        ],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("549068c968eabd681b71182a")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012531e94a8881e6e8e54"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : "Central Daylight Time",
                        "enphaseUserId" : "4d6a49784e7a67790a",
                        "endDate" : "2014-12-16T11:05:00.000Z",
                        "weatherStation" : "1",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Push to FTP",
                        "deviceID" : "416036",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("54902ee7ba2ca1141e4afd73"),
                        "name" : "Envoy_3",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("5490697f81cda60823657639")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012531e94a8881e6e8e54"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : "Central Daylight Time",
                        "enphaseUserId" : "4d6a49784e7a67790a",
                        "endDate" : "2014-12-16T11:05:00.000Z",
                        "weatherStation" : "1",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Push to FTP",
                        "deviceID" : "347894",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("54902ef4ba2ca1141e4afd74"),
                        "name" : "Envoy_4",
                        "tagType" : "Scope",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Node",
                                "id" : new ObjectId("54906a9b81cda60823657641")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012531e94a8881e6e8e54"),
                                "tagType" : "Facility"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : null,
                        "timezone" : "Central Daylight Time",
                        "enphaseUserId" : "4d6a49784e7a67790a",
                        "endDate" : "2014-12-16T11:05:00.000Z",
                        "weatherStation" : "1",
                        "longitude" : -94.58940699999999,
                        "latitude" : 39.083672,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : "Push to FTP",
                        "deviceID" : "406326",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : "Kansas City",
                        "__v" : 1
                    });

                    tags.push({
                        "_id" : new ObjectId("5490307bba2ca1141e4afd75"),
                        "name" : "Envoy sensor1",
                        "tagType" : "Node",
                        "nodeType": "Solar",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490308aba2ca1141e4afd76")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("549069e981cda6082365763b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("549069f781cda6082365763c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906a0381cda6082365763d")
                            },
                            {
                                "tagType": "Metric",
                                "id" : new ObjectId("545906edded7ea0f0079940d")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("549012d1c15488681a64b6ab"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : "ff",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Daily",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "Envoy:415544",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 8
                    });

                    tags.push({
                        "_id" : new ObjectId("549068c968eabd681b71182a"),
                        "name" : "Envoy sensor 2",
                        "tagType" : "Node",
                        "nodeType": "Solar",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("549068e368eabd681b71182b")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490691c81cda60823657636")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490693781cda60823657637")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490694581cda60823657638")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("545906edded7ea0f0079940c")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54902ed7ba2ca1141e4afd72"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : "1",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "Envoy:416036",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 4
                    });

                    tags.push({
                        "_id" : new ObjectId("5490697f81cda60823657639"),
                        "name" : "Envoy sensor 3",
                        "tagType" : "Node",
                        "nodeType": "Solar",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("5490699081cda6082365763a")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906a3281cda6082365763e")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906a4081cda6082365763f")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906a4b81cda60823657640")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("545906edded7ea0f0079940b")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54902ee7ba2ca1141e4afd73"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : "1",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Hourly",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "Envoy:347894",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 4
                    });

                    tags.push({
                        "_id" : new ObjectId("54906a9b81cda60823657641"),
                        "name" : "Envoy sensor 4",
                        "tagType" : "Node",
                        "nodeType": "Solar",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906ab081cda60823657642")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906add68eabd681b71182c")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("54906af268eabd681b71182e")
                            },
                            {
                                "tagType" : "Metric",
                                "id" : new ObjectId("545906edded7ea0f0079940a")
                            }
                        ],
                        "parents" : [
                            {
                                "id" : new ObjectId("54902ef4ba2ca1141e4afd74"),
                                "tagType" : "Scope"
                            }
                        ],
                        "summaryMethod" : null,
                        "formula" : null,
                        "metricID" : null,
                        "metricType" : null,
                        "metric" : null,
                        "sensorTarget" : "1",
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : "--Use NOAA--",
                        "longitude" : 1,
                        "latitude" : 1,
                        "webAddress" : null,
                        "interval" : "Daily",
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : "Envoy:406326",
                        "device" : "Envoy",
                        "manufacturer" : "Enphase",
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 4
                    });

                    tags.push({
                        "_id" : new ObjectId("5490308aba2ca1141e4afd76"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });


                    tags.push({
                        "_id" : new ObjectId("5490693781cda60823657637"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("549068c968eabd681b71182a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("5490694581cda60823657638"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("549068c968eabd681b71182a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("549069e981cda6082365763b"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906a4081cda6082365763f"),
                        "name" : "Power (W)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490697f81cda60823657639"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906a4b81cda60823657640"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490697f81cda60823657639"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906af268eabd681b71182e"),
                        "name" : "Power (kW)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54906a9b81cda60823657641"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Average",
                        "formula" : null,
                        "metricID" : "powr",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    tags.push({
                        "_id" : new ObjectId("549068e368eabd681b71182b"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("549068c968eabd681b71182a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("5490691c81cda60823657636"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("549068c968eabd681b71182a"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("5490699081cda6082365763a"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490697f81cda60823657639"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("549069f781cda6082365763c"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906a0381cda6082365763d"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906a3281cda6082365763e"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("5490697f81cda60823657639"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906ab081cda60823657642"),
                        "name" : "Energy (Wh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54906a9b81cda60823657641"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });
                    tags.push({
                        "_id" : new ObjectId("54906add68eabd681b71182c"),
                        "name" : "Energy (kWh)",
                        "tagType" : "Metric",
                        "creatorRole" : "BP",
                        "creator" : new ObjectId("54621cd2349cc84500dee9ea"),
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities" : [],
                        "children" : [],
                        "parents" : [
                            {
                                "id" : new ObjectId("54906a9b81cda60823657641"),
                                "tagType" : "Node"
                            }
                        ],
                        "summaryMethod" : "Total",
                        "formula" : null,
                        "metricID" : "enwh",
                        "metricType" : "Datafeed",
                        "metric" : "Standard",
                        "sensorTarget" : null,
                        "timezone" : null,
                        "enphaseUserId" : null,
                        "endDate" : null,
                        "weatherStation" : null,
                        "longitude" : null,
                        "latitude" : null,
                        "webAddress" : null,
                        "interval" : null,
                        "destination" : null,
                        "accessMethod" : null,
                        "deviceID" : null,
                        "device" : null,
                        "manufacturer" : null,
                        "utilityAccounts" : [],
                        "utilityProvider" : null,
                        "nonProfit" : null,
                        "taxID" : null,
                        "address" : null,
                        "street" : null,
                        "state" : null,
                        "postalCode" : null,
                        "country" : null,
                        "city" : null,
                        "__v" : 0
                    });

                    //EnphaseReimbursement

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940d"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5490307bba2ca1141e4afd75"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.3,
                        "formula": null,
                        "metricID": "powr",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940c"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("549068c968eabd681b71182a"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.4,
                        "formula": null,
                        "metricID": "powr",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940b"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("5490697f81cda60823657639"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.5,
                        "formula": null,
                        "metricID": "powr",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    tags.push({
                        "_id": new ObjectId("545906edded7ea0f0079940a"),
                        "tagType": "Metric",
                        "name": "Reimbursement",
                        "summaryMethod": consts.METRIC_SUMMARY_METHODS.Total,
                        "creatorRole": "BP",
                        "creator": new ObjectId("54135f90c6ab7c241e28095e"),
                        "__v": 0,
                        "usersWithAccess" : [
                            {
                                "id" : new ObjectId("54135f90c6ab7c241e28095e")
                            },
                            {
                                "id" : new ObjectId("5416f4647fd9bfec17c6253d")
                            },
                            {
                                "id" : new ObjectId("5416f4a4aa6409d01d0c91dc")
                            },
                            {
                                "id" : new ObjectId("545898afa6e5da3a00dfe131")
                            },
                            {
                                "id" : new ObjectId("5458ac6a5e9b792200497fad")
                            },
                            {
                                "id" : new ObjectId("5458c537de56992100f87cb7")
                            },
                            {
                                "id" : new ObjectId("54590cc2fcbf7357005117cf")
                            }
                        ],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": new ObjectId("54906a9b81cda60823657641"),
                                "tagType": "Sensor"
                            }
                        ],
                        "rate": 0.6,
                        "formula": null,
                        "metricID": "powr",
                        "metricType": "Calculated",
                        "metric": "Standard",
                        "sensorTarget": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    });

                    async.each(tags, function (tag, saveCallback) {
                        var TagModel = new Tag(tag);
                        TagModel.save(saveCallback);
                    }, function (saveErr, saveResult) {
                        if (saveErr) {
                            callback(saveErr);
                        } else {
                            callback(null, consts.OK);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    var correctErr = utils.convertError(err);
                    log.error(correctErr);
                    finalCallback(correctErr, null);
                } else {
                    log.info(result);
                    finalCallback(null, result);
                }
            });
        }
    });
}

exports.insertTags = insertTags;
