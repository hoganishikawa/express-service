/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../server',
        mongoose = require('mongoose'),
        moment = require('moment'),
        consts = require(serverRoot + "/libs/consts");

    chai.use(require('sinon-chai'));

    describe('assurf last sunny day calculations test', function () {

        var lastSunnyDayCalc = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/last-sunny-day.js');
        var facilityKey = "Forecast.Latitude:123.Longitude:456";

        beforeEach(function () {
        });

        afterEach(function () {
        });

        it('should return currect day', function () {

            var tempoIResponse = {
                "dataPoints": [
                    {
                        "ts": new Date("2015-03-14T19:00:00.000Z"),
                        "values": {
                            "Forecast.Latitude:123.Longitude:456": {
                                "Icon": 0
                            }
                        }
                    }
                ],
                "selection": {
                }
            };

            var currentDay = moment.utc().date();


            var foundTS = lastSunnyDayCalc.getLastSunnyDay(tempoIResponse, facilityKey);
            expect(foundTS.date()).to.equal(currentDay);
            //expect(storage.CurrentDayPower).to.equal((0.8 + 1.8) / 2);
        });

        it('should return clear day', function () {

            var tempoIResponse = {
                "dataPoints": [
                    {
                        "ts": new Date("2015-03-14T09:00:00.000Z"),
                        "values": {
                            "Forecast.Latitude:123.Longitude:456": {
                                "Icon": 0
                            }
                        }
                    },
                    {
                        "ts": new Date("2015-03-14T11:00:00.000Z"),
                        "values": {
                            "Forecast.Latitude:123.Longitude:456": {
                                "Icon": 0
                            }
                        }
                    },
                    {
                        "ts": new Date("2015-03-14T12:00:00.000Z"),
                        "values": {
                            "Forecast.Latitude:123.Longitude:456": {
                                "Icon": 0
                            }
                        }
                    },
                    {
                        "ts": new Date("2015-03-14T13:00:00.000Z"),
                        "values": {
                            "Forecast.Latitude:123.Longitude:456": {
                                "Icon": 0
                            }
                        }
                    },
                    {
                        "ts": new Date("2015-03-14T14:00:00.000Z"),
                        "values": {
                            "Forecast.Latitude:123.Longitude:456": {
                                "Icon": 1
                            }
                        }
                    },
                    {
                        "ts": new Date("2015-03-14T15:00:00.000Z"),
                        "values": {
                            "Forecast.Latitude:123.Longitude:456": {
                                "Icon": 0
                            }
                        }
                    },
                    {
                        "ts": new Date("2015-03-14T16:00:00.000Z"),
                        "values": {
                            "Forecast.Latitude:123.Longitude:456": {
                                "Icon": 0
                            }
                        }
                    }
                ],
                "selection": {
                }
            };

            var foundTS = lastSunnyDayCalc.getLastSunnyDay(tempoIResponse, facilityKey);
            expect(foundTS.date()).to.equal(14);
            //expect(storage.CurrentDayPower).to.equal((0.8 + 1.8) / 2);
        });
    });
}());
