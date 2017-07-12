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

    describe('assurf equivalencies calculations test', function () {

        var equivCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/equivalencies-calculator.js');

        var socket = {
            emit: function(){}
        };

        beforeEach(function () {
            sinon.stub(socket, 'emit', function (event, socketResponse) {
                expect(socketResponse.success).to.equal(1);
                expect(Math.round(socketResponse.message.homeElectricityUse *10000) / 10000).to.equal(0.0018);
                return socketResponse;
            });
        });

        afterEach(function () {
            socket.emit.restore();
        });

        it('should filter equivalencies tempoiq response', function () {

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

            equivCalc.calculateData(socket, tempoIResponse);
        });
    });

    describe('assurf Avoided Carbon test', function () {

        var equivCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/equivalencies-calculator.js');

        var socket = {
            emit: function(){}
        };

        beforeEach(function () {
            sinon.stub(socket, 'emit', function (event, socketResponse) {
                expect(socketResponse.success).to.equal(1);
                expect(socketResponse.message).to.equal((43.441441 / 1000 * 0.000823724 / 1.115 / 1) * 365 * 2.2);

                return socketResponse;
            });
        });

        afterEach(function () {
            socket.emit.restore();
        });

        it('should filter equivalencies tempoiq response', function () {

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

            equivCalc.calculateCO2AvoidedData(socket, tempoIResponse);
        });
    });
}());
