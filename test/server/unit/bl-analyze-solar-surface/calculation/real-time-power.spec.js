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

    describe('assurf real-time power calculations test', function () {

        var realTimeCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/real-time-power-calculator.js');

        beforeEach(function () {
        });

        afterEach(function () {
        });

        it('should filter real time tempoiq response', function () {

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
                totalGeneration: {
                    value: 0,
                    trend: null
                },
                totalProductionBySources: {},
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Total Generation",
                        data: []
                    }]
                }
            };

            realTimeCalc.processTempoIQResponse(tempoIResponse, nodeList, storage, false);

            expect(storage.totalGeneration.value).to.equal(43.441441 / 1000);
            expect(storage.mainChart.series[0].data.length).to.equal(1);
        });
    });
}());
