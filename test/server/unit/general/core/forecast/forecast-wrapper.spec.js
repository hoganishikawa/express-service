/**
 * Created 03 Apr 2015
 */
"use strict";

"use strict";

var _ = require("lodash");
var sinon = require("sinon"),
    expect = require("chai").expect,
    moment = require("moment"),
    mockery = require("mockery");

var forecastAnswer = {
    "latitude": 39.083672,
    "longitude": -94.589407,
    "timezone": "America/Chicago",
    "offset": -6,
    "hourly": {
        "summary": "Clear throughout the day.",
        "icon": "clear-day",
        "data": [
            {
                "time": 1388469600,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 25.12,
                "apparentTemperature": 20.83,
                "dewPoint": 14.3,
                "humidity": 0.63,
                "windSpeed": 3.47,
                "windBearing": 282,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1026.42
            },
            {
                "time": 1388473200,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 24.75,
                "apparentTemperature": 18.12,
                "dewPoint": 15.56,
                "humidity": 0.68,
                "windSpeed": 5.45,
                "windBearing": 283,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1026.81
            },
            {
                "time": 1388476800,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 23.1,
                "apparentTemperature": 17.4,
                "dewPoint": 15.78,
                "humidity": 0.73,
                "windSpeed": 4.32,
                "windBearing": 239,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1027.27
            },
            {
                "time": 1388480400,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 23.18,
                "apparentTemperature": 14.09,
                "dewPoint": 16.42,
                "humidity": 0.75,
                "windSpeed": 8.03,
                "windBearing": 237,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1027.74
            },
            {
                "time": 1388484000,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 21.83,
                "apparentTemperature": 16.94,
                "dewPoint": 15.63,
                "humidity": 0.77,
                "windSpeed": 3.55,
                "windBearing": 228,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1027.15
            },
            {
                "time": 1388487600,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 20.04,
                "apparentTemperature": 20.04,
                "dewPoint": 14.68,
                "humidity": 0.79,
                "windSpeed": 1.87,
                "windBearing": 198,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1026.71
            },
            {
                "time": 1388491200,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 19.46,
                "apparentTemperature": 14.94,
                "dewPoint": 14.69,
                "humidity": 0.81,
                "windSpeed": 3.12,
                "windBearing": 138,
                "visibility": 9.43,
                "cloudCover": 0,
                "pressure": 1026.39
            },
            {
                "time": 1388494800,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 19.52,
                "apparentTemperature": 12.74,
                "dewPoint": 14.78,
                "humidity": 0.81,
                "windSpeed": 4.72,
                "windBearing": 89,
                "visibility": 8.74,
                "cloudCover": 0,
                "pressure": 1026.43
            },
            {
                "time": 1388498400,
                "summary": "Clear",
                "icon": "clear-day",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 19.55,
                "apparentTemperature": 10.58,
                "dewPoint": 15.44,
                "humidity": 0.84,
                "windSpeed": 6.89,
                "windBearing": 125,
                "visibility": 7.49,
                "cloudCover": 0,
                "pressure": 1026.39
            },
            {
                "time": 1388502000,
                "summary": "Clear",
                "icon": "clear-day",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 24.14,
                "apparentTemperature": 15.63,
                "dewPoint": 17.65,
                "humidity": 0.76,
                "windSpeed": 7.52,
                "windBearing": 135,
                "visibility": 8.74,
                "cloudCover": 0.07,
                "pressure": 1026.12
            },
            {
                "time": 1388505600,
                "summary": "Clear",
                "icon": "clear-day",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 29.26,
                "apparentTemperature": 21.45,
                "dewPoint": 19.8,
                "humidity": 0.67,
                "windSpeed": 8.09,
                "windBearing": 137,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1025.53
            },
            {
                "time": 1388509200,
                "summary": "Clear",
                "icon": "clear-day",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 35.77,
                "apparentTemperature": 28.92,
                "dewPoint": 21.43,
                "humidity": 0.56,
                "windSpeed": 8.95,
                "windBearing": 190,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1024.69
            },
            {
                "time": 1388512800,
                "summary": "Clear",
                "icon": "clear-day",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 43.63,
                "apparentTemperature": 38.09,
                "dewPoint": 23.32,
                "humidity": 0.44,
                "windSpeed": 10.14,
                "windBearing": 194,
                "visibility": 10,
                "cloudCover": 0.07,
                "pressure": 1022.83
            },
            {
                "time": 1388516400,
                "summary": "Clear",
                "icon": "clear-day",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 49.45,
                "apparentTemperature": 44.14,
                "dewPoint": 24.58,
                "humidity": 0.37,
                "windSpeed": 14.18,
                "windBearing": 214,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1020.56
            },
            {
                "time": 1388520000,
                "summary": "Breezy",
                "icon": "wind",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 51.22,
                "apparentTemperature": 51.22,
                "dewPoint": 23.5,
                "humidity": 0.34,
                "windSpeed": 20.01,
                "windBearing": 216,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1019.31
            },
            {
                "time": 1388523600,
                "summary": "Clear",
                "icon": "clear-day",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 51,
                "apparentTemperature": 51,
                "dewPoint": 23.41,
                "humidity": 0.34,
                "windSpeed": 18.25,
                "windBearing": 202,
                "visibility": 10,
                "cloudCover": 0.07,
                "pressure": 1018.52
            },
            {
                "time": 1388527200,
                "summary": "Clear",
                "icon": "clear-day",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 49.41,
                "apparentTemperature": 43.11,
                "dewPoint": 23.18,
                "humidity": 0.35,
                "windSpeed": 18.53,
                "windBearing": 200,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1018.18
            },
            {
                "time": 1388530800,
                "summary": "Clear",
                "icon": "clear-day",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 47.12,
                "apparentTemperature": 41.85,
                "dewPoint": 23.23,
                "humidity": 0.39,
                "windSpeed": 11.83,
                "windBearing": 204,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1018.45
            },
            {
                "time": 1388534400,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 22.66,
                "apparentTemperature": 12.72,
                "dewPoint": 1.15,
                "humidity": 0.38,
                "windSpeed": 9.1,
                "windBearing": 223,
                "visibility": 10,
                "cloudCover": 0.03,
                "pressure": 1030.5
            },
            {
                "time": 1388538000,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 42.83,
                "apparentTemperature": 36.73,
                "dewPoint": 23,
                "humidity": 0.45,
                "windSpeed": 11.09,
                "windBearing": 198,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1019.09
            },
            {
                "time": 1388541600,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 41.68,
                "apparentTemperature": 34.92,
                "dewPoint": 22.27,
                "humidity": 0.46,
                "windSpeed": 12.11,
                "windBearing": 199,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1019.68
            },
            {
                "time": 1388545200,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 40.8,
                "apparentTemperature": 34.27,
                "dewPoint": 22.25,
                "humidity": 0.47,
                "windSpeed": 10.89,
                "windBearing": 199,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1019.35
            },
            {
                "time": 1388548800,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 40,
                "apparentTemperature": 32.72,
                "dewPoint": 21.84,
                "humidity": 0.48,
                "windSpeed": 12.34,
                "windBearing": 199,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1018.76
            },
            {
                "time": 1388552400,
                "summary": "Clear",
                "icon": "clear-night",
                "precipIntensity": 0,
                "precipProbability": 0,
                "temperature": 39.89,
                "apparentTemperature": 33.02,
                "dewPoint": 21.13,
                "humidity": 0.47,
                "windSpeed": 11.17,
                "windBearing": 201,
                "visibility": 10,
                "cloudCover": 0,
                "pressure": 1018.4
            }
        ]
    },
    "daily": {
        "data": [
            {
                "time": 1388469600,
                "summary": "Clear throughout the day.",
                "icon": "clear-day",
                "sunriseTime": 1388497119,
                "sunsetTime": 1388531201,
                "moonPhase": 0.97,
                "precipIntensity": 0,
                "precipIntensityMax": 0,
                "precipProbability": 0,
                "temperatureMin": 19.46,
                "temperatureMinTime": 1388491200,
                "temperatureMax": 51.22,
                "temperatureMaxTime": 1388520000,
                "apparentTemperatureMin": 10.58,
                "apparentTemperatureMinTime": 1388498400,
                "apparentTemperatureMax": 51.22,
                "apparentTemperatureMaxTime": 1388520000,
                "dewPoint": 18.71,
                "humidity": 0.57,
                "windSpeed": 7.95,
                "windBearing": 200,
                "visibility": 9.77,
                "cloudCover": 0.01,
                "pressure": 1023.39
            }
        ]
    }
};



describe("forecast", function() {

    describe("forecast-wrapper", function () {

        describe("processForecastAnswer", function () {

            var tempoiqMock = {
                createDevice: function() {},
                writeMultiDataPoints: function() {}
            };

            before(function () {

                mockery.enable({
                    warnOnReplace: false,
                    warnOnUnregistered: false,
                    useCleanCache: true
                });

                mockery.registerMock("../tempoiq/tempoiq-wrapper", tempoiqMock);
            });

            after(function () {
                mockery.disable();
            });

            afterEach(function() {
                if (!_.isEmpty(tempoiqMock.createDevice)) {
                    tempoiqMock.createDevice.restore();
                }
                if (!_.isEmpty(tempoiqMock.writeMultiDataPoints)) {
                    tempoiqMock.writeMultiDataPoints.restore();
                }
            });

            it("should call tempoiq functions with correct tempoiq structure", function () {
                require("../../../../../../server/general/models");
                var forecast = require("../../../../../../server/general/core/forecast/forecast-wrapper");
                var location = {
                    latitude: 39.083672,
                    longitude: -94.589407
                };

                var spy = sinon.spy();
                sinon.stub(tempoiqMock, "createDevice").callsArgWith(2, null, 1);
                sinon.stub(tempoiqMock, "writeMultiDataPoints").callsArg(1);

                forecast._processForecastAnswer(location, forecastAnswer, spy);
                expect(spy.calledOnce).equals(true);
                expect(tempoiqMock.createDevice.called).equals(true);
                expect(tempoiqMock.writeMultiDataPoints.called).equals(true);

                var tempoIqData = tempoiqMock.writeMultiDataPoints.args[0][0];
                expect(tempoIqData).has.property("Forecast.Latitude:39.083672.Longitude:-94.589407");

                var data = tempoIqData["Forecast.Latitude:39.083672.Longitude:-94.589407"];

                var checkData = function(name) {
                    expect(data).has.property(name);
                    expect(data[name]).has.length(24); // 24 hours
                };

                checkData("PrecipIntensity");
                checkData("PrecipProbability");
                checkData("Temperature");
                checkData("ApparentTemperature");
                checkData("DewPoint");
                checkData("Humidity");
                checkData("WindSpeed");
                checkData("WindBearing");
                checkData("Visibility");
                checkData("CloudCover");
                checkData("Pressure");

                //// there is no ozon in input data
                //checkData("Ozon");

                checkData("Icon");

                //// there is no precipType in input data
                //checkData("PrecipType");

            })

        });
    });
});
