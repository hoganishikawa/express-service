/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../server',
        mongoose = require('mongoose'),
        consts = require(serverRoot + "/libs/consts");

    chai.use(require('sinon-chai'));

    describe('assurf source calculations test', function () {

        var sourcesCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/sources.js');

        beforeEach(function () {
        });

        afterEach(function () {
        });

        it('should filter sources tempoiq response', function () {

            var tempoIResponse = {
                "dataPoints": [
                    {
                        "ts": "2001-01-07T19:30:25.000Z",
                        "values": {
                            "WR7KU020:2007305255": {
                                "Pac": 43.441441
                            }
                        }
                    }
                ],
                "selection": {
                    "devices": {
                        "or": [
                            {
                                "key": "WR7KU020:2007305255"
                            }
                        ]
                    },
                    "sensors": {
                        "or": [
                            {
                                "key": "Pac"
                            },
                            {
                                "key": "powr"
                            },
                            {
                                "key": "W"
                            }
                        ]
                    }
                }
            };

            var nodeList = {
                "WR7KU020:2007305255": {
                    deviceOffset: -360,
                    facilityId: "facility12345",
                    facilityName: "facilityA",
                    rate: 0,
                    scopeName: "scopeA"
                }
            };

            var storage = {
                facilityA: {
                    firstReportedTime: null,
                    firstReportedValue: 0,
                    lastReportedTime: null,
                    lastReportedValue: 0,
                    maxValue: 0,
                    minValue: 0,
                    scopes: {
                        scopeA: {
                            firstReportedTime: null,
                            firstReportedValue: 0,
                            lastReportedTime: null,
                            lastReportedValue: 0,
                            maxValue: 0,
                            minValue: 0
                        }
                    }
                }
            };

            sourcesCalc.processTempoIQResponse(tempoIResponse, nodeList, storage, "firstReportedTime", "firstReportedValue");

            expect(storage.facilityA.firstReportedValue).to.equal(43.441441 / 1000);
            expect(storage.facilityA.firstReportedTime.toISOString()).to.equal("2001-01-08T01:30:25.000Z");
        });
    });
}());
