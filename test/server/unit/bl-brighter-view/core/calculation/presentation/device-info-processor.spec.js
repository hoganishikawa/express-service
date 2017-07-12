/**
 * Created 17 Apr 2015
 */
"use strict";

var _ = require("lodash"),
    chai = require("chai"),
    expect = chai.expect,
    sinon = require("sinon"),
    path = require("path"),
    ROOT_PATH = "../../../../../../../server";

var consts = require(path.join(ROOT_PATH, "libs/consts")),
    utils =  require(path.join(ROOT_PATH, "libs/utils"));

require(ROOT_PATH + "/general/models");

var deviceInfoProcessor = require(path.join(ROOT_PATH, "/bl-brighter-view/core/calculation/presentation/device-info-processor"));
var deviceDao = require(path.join(ROOT_PATH, "/general/core/dao/present-display-dao"));


describe("present:device-info-processor", function() {

    describe("process", function() {

        var emitter =  {
            emit: function() {}
        };

        var fakeDevices = [
            {
                "_id": "1",
                "data": "some data",
                "deviceId": 1
            }
        ];

        var fakeLog = {
            _id: "l1",
            "data": "some log data",
            "deviceId": 1
        };


        beforeEach(function() {
            sinon.spy(emitter, "emit");
            sinon.stub(deviceDao, "getDevicesByPresentationIds").callsArgWith(1, null, fakeDevices);
            sinon.stub(deviceDao, "getLatestLogForDevice").callsArgWith(1, null, fakeLog);
        });


        afterEach(function() {
            emitter.emit.restore();
            deviceDao.getDevicesByPresentationIds.restore();
            deviceDao.getLatestLogForDevice.restore();
        });

        it("should be ok", function() {
            expect(true).equals(true);
        });

        it("should emit nothing on empty presentationId list", function() {
            var spy = emitter.emit;
            var deviceInfo = {
                presentations: []
            };

            deviceInfoProcessor.process(deviceInfo, emitter);
            expect(spy.called).equals(false);
        });

        it("should return all devicesConfigs for the first time", function() {

            var emitSpy = emitter.emit;
            var getDevSpy = deviceDao.getDevicesByPresentationIds;

            var deviceInfo = {
                presentations: ["id"]
            };

            deviceInfoProcessor.process(deviceInfo, emitter);

            expect(getDevSpy.called).equals(true);
            expect(emitSpy.called).equals(true);
            expect(deviceDao.getLatestLogForDevice.called).equals(true);

            var args = emitSpy.args[0];
            expect(args[0]).equal(consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceInfo);
            var expectedData = new utils.serverAnswer(true, [{deviceConfig: fakeDevices[0], deviceLog: fakeLog}] );
            expect(args[1]).deep.equal(expectedData);
        });

        it("should return empty object if we have simular savedData", function() {

            var emitSpy = emitter.emit;
            var getDevSpy = deviceDao.getDevicesByPresentationIds;

            var savedData = [{deviceConfig: fakeDevices[0], deviceLog: fakeLog}];

            var deviceInfo = {
                presentations: ["id"],
                "1": savedData[0]
            };
            deviceInfoProcessor.process(deviceInfo, emitter);

            var args = emitSpy.args[0];
            expect(args[0]).equal(consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceInfo);
            var expectedData = new utils.serverAnswer(true, [{}]);
            expect(args[1]).deep.equal(expectedData);
        });

    });

});

