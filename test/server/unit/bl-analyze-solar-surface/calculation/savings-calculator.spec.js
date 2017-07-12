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

    describe('assurf savings calculations test', function () {

        var savingsCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/savings-calculator.js');

        beforeEach(function () {
        });

        afterEach(function () {
        });

        it('should filter savings tempoiq response', function () {

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
                    rate: 0.2,
                    scopeName: "scopeA"
                }
            };

            var storage = {
                totalSavingPerDateRange : 0,
                totalSavings : 0,
                totalProduction : 0,
                totalProductionBySources: {},
                areaChart: {
                    categories: [],
                    series: []
                },
                comboChart: {
                    categories: [],
                    series: [{
                        type: "column",
                        name: "Savings",
                        data: []
                    }, {
                        type: "spline",
                        name: "kWh",
                        data: []
                    }]
                }
            };

            savingsCalc.processTempoIQResponse(tempoIResponse, nodeList, storage, false, "1hour", false);

            expect(storage.totalSavingPerDateRange).to.equal((43.441441 / 1000) * 0.2);
        });
    });
}());
