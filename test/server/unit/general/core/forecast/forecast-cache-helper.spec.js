/**
 * Created 26 Mar 2015
 */
"use strict";

var _ = require("lodash");
var sinon = require("sinon"),
    expect = require("chai").expect,
    moment = require("moment"),
    mockery = require("mockery");


describe("forecast", function() {

    describe("forecast-cache-helper", function() {

        var cacheMock = {
            get: function () {},
            setex: function () {}
        };

        var forecastMock = {
            getHistoryData: function(geo, date, callback) {}
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


        it("should return cached results if there are some", function() {

            // emulate answer from cache
            sinon.stub(cacheMock, "get").callsArgWith(1, null, JSON.stringify({ "weather": "ok"}) );

            var cacheHelper = require("../../../../../../server/general/core/forecast/forecast-cache-helper");

            // final callback
            var spy = sinon.spy();

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


        it("should cache result on successful result", function() {

            // emulate no cache
            sinon.stub(cacheMock, "get").callsArgWith(1, null, null);

            // emulate answer from forecast.io
            sinon.stub(forecastMock, "getHistoryData").callsArgWith(2, null, "data");

            // emulate successful setex
            sinon.stub(cacheMock, "setex").callsArgWith(3, null);

            var cacheHelper = require("../../../../../../server/general/core/forecast/forecast-cache-helper");
            var spy = sinon.spy();

            cacheHelper.getCachedDailyHistoryData(
                {latitude: 1, longitude: 1},
                moment(),
                null,
                spy);

            // we ask for cache
            expect(cacheMock.get.called).equals(true);

            // we run function
            expect(forecastMock.getHistoryData.called).equals(true);

            //// we run setex
            expect(cacheMock.setex.called).equals(true);

            // is final callback was called?
            expect(spy.called).equals(true);

            // final callback args
            expect(spy.calledWith(null, "data")).equals(true);
        });

    });

});

