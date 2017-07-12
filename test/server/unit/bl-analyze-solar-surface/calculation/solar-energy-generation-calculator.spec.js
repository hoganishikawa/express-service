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

    describe('assurf solar energy generation calculations test', function () {

        var solarEnergyCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/solar-energy-generation-calculator.js');

        var socket = {
            emit: function(){}
        };

        beforeEach(function () {
            sinon.stub(socket, 'emit', function (event, socketResponse) {
                expect(socketResponse.success).to.equal(1);

                expect(socketResponse.message.mainChart.series[0].data.length).to.equal(1);
                expect(socketResponse.message.totalProduction).to.equal(43.441441 / 1000);

                return socketResponse;
            });
        });

        afterEach(function () {
            socket.emit.restore();
        });

        it('should filter solar generation tempoiq response', function () {

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
                totalSaving : 0,
                totalProduction: 0,
                totalProductionBySources: {},
                pie: {
                    series: [{
                        type: "pie",
                        name: "Generation Per Sources",
                        data: []
                    }]
                },
                mainChart: {
                    categories: [],
                    series: [{
                        name: "Solar Energy Generation",
                        data: []
                    }]
                }
            };


            solarEnergyCalc.calculateData(socket, tempoIResponse, nodeList, false, "1month");
        });
    });

    describe('assurf solar energy generation calculations test', function () {

        var solarEnergyCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/solar-energy-generation-calculator.js');

        var socket = {
            emit: function(){}
        };

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
                totalSaving : 0,
                totalProduction: 0,
                totalProductionBySources: {},
                candlestick: {
                    series: {
                        type: "candlestick",
                        name: "Candlestick Chart",
                        data: []
                    }
                }
            };


            solarEnergyCalc.processTempoIQResponseCandlestick(tempoIResponse, storage, nodeList);

            expect(storage.candlestick.series.data.length).to.equal(1);
            expect(storage.totalProduction).to.equal(43.441441 / 1000);
        });
    });
}());
