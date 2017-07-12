/**
 * Created 15 Mar 2015
 */
(function() {
    "use strict";
    var _ = require("lodash");
    var chai = require("chai"),
        sinon = require("sinon"),
        expect = chai.expect,
        EventEmitter = require('events').EventEmitter,
        moment = require('moment'),
        mockery = require("mockery"),
        rootPath = "../../../../..",
        consts = require(rootPath + "/server/libs/consts");


    describe("assurf actual & predicted energy module", function() {

        /*var getSocket = function(expectObject, done) {
            var socket = new EventEmitter();
            socket.on(consts.WEBSOCKET_EVENTS.ASSURF.Weather, function(msg) {
                expect(expectObject).be.deep.equal(msg);
                done();
            });
            return socket;
        };*/
        var actualPredictedEnergyCalc = require(rootPath + "/server/bl-analyze-solar-surface/core/calculation/actual-predicted-energy");

        describe("actual & predicted energy", function() {
            
            var inputData = {
                "dataPoints": [
                    {
                        "ts": "2015-01-01T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 567718.7
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 543902.3
                            },
                            "Envoy:347894": {
                                "powr": 1611920.5
                            },
                            "Envoy:416036": {
                                "powr": 1616338
                            }
                        }
                    }, 
                    {
                        "ts": "2015-02-01T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 730624.4
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 704940
                            },
                            "Envoy:347894": {
                                "powr": 2633544.4
                            },
                            "Envoy:416036": {
                                "powr": 2494214.7
                            }
                        }
                    },
                    {
                        "ts": "2015-03-01T00:00:00.000Z",
                        "values": {
                            "WR8KU002:2002126708": {
                                "Pac": 1188843
                            },
                            "WR7KU009:2002112342": {
                                "Pac": 1155764
                            },
                            "WR7KU009:2002112282": {
                                "Pac": 1136446
                            }
                        }
                    }
                ],
                "selection": {
                    "devices": {
                        "or": [{
                            "key": "Envoy:347894"
                        }, {
                            "key": "Envoy:416036"
                        }, {
                            "key": "WR8KU002:2002126708"
                        }, {
                            "key": "WR7KU009:2002112342"
                        }]
                    },
                    "sensors": {
                        "or": [{
                            "key": "Pac"
                        }, {
                            "key": "powr"
                        }, {
                            "key": "W"
                        }]
                    }
                }
            };

            var yearDistributions = [5.57, 6.61, 9.04, 9.84, 10.54, 10.22, 10.51, 10.24, 9.07, 7.71, 5.70, 4.95];
            var categories = [ 'Jan 15','Feb 15','Mar 15','Apr 15','May 15','Jun 15','Jul 15','Aug 15','Sep 15','Oct 15','Nov 15','Dec 15' ];
            
            it("should return empty result on wrong input", function() {
                var result = actualPredictedEnergyCalc.transformTempoiqResponse({}, "year", categories, null);
                expect(result).a("object");
                expect(result.series).to.be.empty;
            });

            it("should return answer with necessary fields", function() {
                var result = actualPredictedEnergyCalc.transformTempoiqResponse(inputData, "year", categories, null);
                expect(result).to.exist;
                expect(result).to.have.property("categories");
                expect(result).to.have.property("series").with.length(2);
                expect(result.series[0]).to.have.property("name");
                expect(result.series[0]).to.have.property("data");
            });

            it('should return correct actual & predicted energy from tempoiq response', function () {
                var result = actualPredictedEnergyCalc.transformTempoiqResponse(inputData, "year", categories, null);
                expect(result.series[0].name).to.equal("Actual Energy");
                expect(result.series[0].data[0]).to.equal(4339.8795);
                expect(result.series[1].name).to.equal("Predicted Energy");
                expect(result.series[1].data[0]).to.equal(0);
            });
        });
        
        
        describe("cloudy & sunny days", function() {
            
            var fakeWeatherProvider = {
                getHistoryData: function(geo, date, callback) {
                   var result = [
                    {
                        "time" : moment([2015, 0, 1]).format("X"),
                        "icon" : "cloudy"
                    },
                    {
                        "time" : moment([2015, 0, 2]).format("X"),
                        "icon" : "cloudy"
                    },
                    {
                        "time" : moment([2015, 0, 3]).format("X"),
                        "icon" : "cloudy"
                    },
                    {
                        "time" : moment([2015, 0, 4]).format("X"),
                        "icon" : "cloudy"
                    },
                    {
                        "time" : moment([2015, 0, 5]).format("X"),
                        "icon" : "clear-day"
                    },
                    {
                        "time" : moment([2015, 0, 6]).format("X"),
                        "icon" : "clear-day"
                    },
                    {
                        "time" : moment([2015, 0, 7]).format("X"),
                        "icon" : "clear-day"
                    }
                   ];

                    callback(null, result);     
                }
            };

            var categories = [ 'Jan 15','Feb 15','Mar 15','Apr 15','May 15','Jun 15','Jul 15','Aug 15','Sep 15','Oct 15','Nov 15','Dec 15' ];
            var inputData = [
                    {
                        "time" : moment([2015, 0, 1]).format("X"),
                        "icon" : "cloudy"
                    },
                    {
                        "time" : moment([2015, 0, 2]).format("X"),
                        "icon" : "cloudy"
                    },
                    {
                        "time" : moment([2015, 0, 3]).format("X"),
                        "icon" : "cloudy"
                    },
                    {
                        "time" : moment([2015, 0, 4]).format("X"),
                        "icon" : "cloudy"
                    },
                    {
                        "time" : moment([2015, 0, 5]).format("X"),
                        "icon" : "clear-day"
                    },
                    {
                        "time" : moment([2015, 0, 6]).format("X"),
                        "icon" : "clear-day"
                    },
                    {
                        "time" : moment([2015, 0, 7]).format("X"),
                        "icon" : "clear-day"
                    }
                   ];

            
            it("should return daily forecast data with given date range and location", function() {
                /*actualPredictedEnergyCalc.loadWeatherData({latitude: 1, longitude: 1}, "year", fakeWeatherProvider, function(err, result) {
                    expect(err).to.be(null);
                    expect(result).to.be.an("array");
                    expect(result).to.have.length.above(1);
                    done();
                });*/
            });

            it("should return empty result on wrong input", function() {
                var result = actualPredictedEnergyCalc.transformWeatherResponse({}, "year", categories, null);
                expect(result).an("object");
                expect(result).to.be.empty;
            });

            it("should return correct data for correct location", function() {
                //var socket = getSocket(expectResult, done);
                var result = actualPredictedEnergyCalc.transformWeatherResponse(inputData, "year", categories, null);
                expect(result).to.be.an("object");
                expect(result).to.include.keys("Jan 15");
                //expect(result).to.contain.all.keys(categories);
                expect(result).to.have.property("Jan 15").and.deep.equal({cloudydays: 4, sunnydays: 3});
                //expect(socket.message).deep.equals();
            });

            it("should return empty result on wrong date range", function() {
                var result = actualPredictedEnergyCalc.transformWeatherResponse(inputData, "aa", categories, null);
                expect(result).an("object");
                expect(result).to.be.empty;
            });
        });
        
        describe("cache forecast data", function() {
            var cacheMock = {
                get: function () {},
                setex: function () {}
            };

            var forecastMock = {
                getHistoryData: function(geo, date, callback) {}
            };

            var clientObject = {
                geo: {latitude: 1, longitude: 1}, 
                selectedFacilities: [], 
                selectedScopes: [],
                actualPredictedEnergy: {
                    dateRange: "year",
                    year: null
                },
                socket: null,
                user: {},
                solarTags: [],
            };

            before(function() {

                mockery.enable({
                    warnOnReplace: false,
                    warnOnUnregistered: false,
                    useCleanCache: true
                });

                mockery.registerMock("../../../libs/cache", cacheMock);
                mockery.registerMock("./forecast-provider", forecastMock);
            });

            after(function() {
                mockery.disable();
            });

            afterEach(function() {
                if (!_.isEmpty(cacheMock.get)) {
                    cacheMock.get.restore();
                }

                if (!_.isEmpty(cacheMock.setex)) {
                    cacheMock.setex.restore();
                }
            });

            it("should return cached forecast data if there are already exists in redis", function() {

                // emulate answer from cache
                sinon.stub(cacheMock, "get").callsArgWith(1, null, JSON.stringify({ "weather": "ok"}) );

                // emulate answer from forecast.io
                //sinon.stub(forecastMock, "getHistoryData").callsArgWith(2, null, "data");

                // emulate successful setex
                //sinon.stub(cacheMock, "setex").callsArgWith(3, null);

                var cacheHelper = require(rootPath + "/server/general/core/forecast/forecast-cache-helper");

                // final callback
                var spy = sinon.spy();

                //var mspy = sinon.spy(actualPredictedEnergyCalc, "loadData");
                //actualPredictedEnergyCalc.loadData(clientObject);
                //expect(mspy.called).equals(true);

                cacheHelper.getCachedDailyHistoryData(
                    {latitude: 1, longitude: 1},
                    moment(),
                    null,
                    spy);

                // cache was called
                expect(cacheMock.get.called).equals(true);

                // final callback was called
                expect(spy.called).equals(true);

                // final callback args
                expect(spy.calledWith(null, {"weather": "ok"})).equals(true);
   
            });

        });
    });
})();
