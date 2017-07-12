/**
 * Created 15 Mar 2015
 */
(function() {
    "use strict";
    var chai = require("chai"),
        expect = chai.expect,
        EventEmitter = require('events').EventEmitter;

    var rootPath = "../../../../..";
    var weather = require(rootPath + "/server/bl-analyze-solar-surface/core/calculation/weather"),
        consts = require(rootPath + "/server/libs/consts");


    describe("assurf weather module", function() {

        var getSocket = function(expectObject, done) {
            var socket = new EventEmitter();
            socket.on(consts.WEBSOCKET_EVENTS.ASSURF.Weather, function(msg) {
                expect(expectObject).be.deep.equal(msg);
                done();
            });
            return socket;
        };

        var fakeWeatherProvider = {
            getForecastData: function(location, callback) {
                var result = {
                    current: 1,
                    forecast:[
                        {
                            day: 5
                        }
                    ]
                };

                callback(null, result);
            },
            getHistoryDataForPrevWeek: function(location, callback) {
                callback(null, [{day: 1}, {day: 2}]);
            }
        };

        it("should return error on wrong location", function(done) {
            var socket = getSocket({"success":0,"message":"Incorrect location parameters"}, done);
            weather.getWeather({}, fakeWeatherProvider, socket);
        });

        it("should return correct data for correct location", function(done) {
            var expectResult = {
                success: 1,
                message: {
                    current: 1,
                    forecast: [
                        { day: 5 }
                    ],
                    history: [
                        { day: 1 },
                        { day: 2 }
                    ]
                }
            };
            var socket = getSocket(expectResult, done);
            weather.getWeather({latitude: 1, longitude: 1}, fakeWeatherProvider, socket);
            expect(socket.message).deep.equals();
        });


        describe("getWeatherHistory", function() {

            var getSocketHistory = function(expectObject, done) {
                var socket = new EventEmitter();
                socket.on(consts.WEBSOCKET_EVENTS.ASSURF.WeatherHistory, function(msg) {
                    expect(expectObject).be.deep.equal(msg);
                    done();
                });
                return socket;
            };

            var expectErrResult = {
                "success": 0,
                "message": "Incorrect location parameters"
            };

            it("should emit error on wrong location", function(done) {
                var socket = getSocketHistory(expectErrResult, done);
                weather.getWeatherHistory({}, {}, fakeWeatherProvider, socket);

            });

            it("should emit error on empty dateRange", function(done) {
                var socket = getSocketHistory(expectErrResult, done);
                weather.getWeatherHistory({latitude: 1, longitude: 1}, {}, fakeWeatherProvider, socket);
            });

            it("should emit error on wrong dateRange", function(done) {
                var socket = getSocketHistory(expectErrResult, done);
                weather.getWeatherHistory({latitude: 1, longitude: 1}, { to: "aa", from: "bbb"}, fakeWeatherProvider, socket);
            });


        });

    });
})();
