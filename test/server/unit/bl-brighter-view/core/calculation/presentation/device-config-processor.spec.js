/**
 * Created 10 Apr 2015
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

var deviceConfigProcessor = require(path.join(ROOT_PATH, "/bl-brighter-view/core/calculation/presentation/device-config-processor"));
var deviceDao = require(path.join(ROOT_PATH, "/general/core/dao/present-display-dao"));


describe("present:device-config-processor", function() {

    describe("process", function() {

        var emitter =  {
            emit: function() {

            }
        };


        var fakeData = [
            {
                "_id": "1",
                "data": "some data",
                "version": 1
            },
            {
                "_id": "2",
                "data": "more data",
                "version": 1
            }
        ];


        beforeEach(function() {
            sinon.spy(emitter, "emit");
            sinon.stub(deviceDao, "getDevicesByPresentationIds").callsArgWith(1, null, fakeData);
        });


        afterEach(function() {
            emitter.emit.restore();
            deviceDao.getDevicesByPresentationIds.restore();
        });


        it("should emit nothing on empty presentationId list", function() {
            var spy = emitter.emit;
            deviceConfigProcessor.process([], {}, emitter);
            expect(spy.called).equals(false);
        });


        it("should return all devicesConfigs first time", function() {

            var emitSpy = emitter.emit;
            var getDevSpy = deviceDao.getDevicesByPresentationIds;

            deviceConfigProcessor.process(["id"], {}, emitter);

            expect(getDevSpy.called).equals(true);
            expect(emitSpy.called).equals(true);
            var args = emitSpy.args[0];
            expect(args[0]).equal(consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceConfig);
            var expectedData = new utils.serverAnswer(true, fakeData);
            expect(args[1]).deep.equal(expectedData);
        });

        it('should return only updated devices', function() {

            var emitSpy = emitter.emit;
            var getDevSpy = deviceDao.getDevicesByPresentationIds;

            deviceConfigProcessor.process(["id"], { "1": {"version": 1} }, emitter);

            expect(getDevSpy.called).equals(true);
            expect(emitSpy.called).equals(true);
            var args = emitSpy.args[0];
            expect(args[0]).equal(consts.WEBSOCKET_EVENTS.PRESENTATION.DeviceConfig);
            // we only expect second data
            var expectedData = new utils.serverAnswer(true, [fakeData[1]]);
            expect(args[1]).deep.equal(expectedData);
        });
    });
});
