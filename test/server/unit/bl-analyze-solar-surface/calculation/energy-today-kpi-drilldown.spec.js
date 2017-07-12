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

    describe('assurf senergy today kpi drilldown calculations test', function () {

        var energyTodayKPIDrilldownCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/energy-today-kpi-drilldown.js');

        beforeEach(function () {
        });

        afterEach(function () {
        });

        it('should filter solar generation candelstick tempoiq response', function () {

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
                totalProduction: 0,
                totalProductionBySources: {},
                energy : {
                    categories: [],
                    series: [{
                        type: "column",
                        name: "Today Energy",
                        data: []
                    }]
                },
                power : {
                    categories: [],
                    series: [{
                        type: "spline",
                        name: "Current Power",
                        data: []
                    }]
                }
            };


            energyTodayKPIDrilldownCalc.processTempoIQResponse(tempoIResponse, storage, "energy", nodeList, true, true);

            expect(storage.energy.series[0].data.length).to.equal(1);
            expect(storage.energy.series[0].data[0]).to.equal(43.441441 / 1000);
        });
    });
}());
