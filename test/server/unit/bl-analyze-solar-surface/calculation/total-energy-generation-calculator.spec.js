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

    describe('assurf total energy generation calculations test', function () {

        var totalEnergyCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/total-energy-generation-calculator.js');

        var socket = {
            emit: function(){}
        };

        beforeEach(function () {
            sinon.stub(socket, 'emit', function (event, socketResponse) {
                expect(socketResponse.success).to.equal(1);

                expect(socketResponse.message.totalEnergyGeneration).to.equal(43.441441 / 1000);

                return socketResponse;
            });
        });

        afterEach(function () {
            socket.emit.restore();
        });

        it('should filter total generation tempoiq response', function () {

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

            var storage = {
                totalEnergyGeneration : 0
            };


            totalEnergyCalc.calculateData(socket, tempoIResponse);
        });
    });
}());
