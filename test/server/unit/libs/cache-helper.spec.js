/**
 * Created 26 Mar 2015
 */
"use strict";

var sinon = require("sinon"),
    expect = require("chai").expect;


describe("cacheFunctionWrapper", function() {

    it("should return cached results if there are some", function() {

        var cacheHelper = require("../../../../server/libs/cache-helper");

        var cache = {
            get: sinon.stub().callsArg(1),
            setex: sinon.stub().callsArgWith(3, null)
        };

        var func = sinon.stub().yields(null, 1);
        var spy = sinon.spy();
        cacheHelper.cacheFunctionWrapper(func, cache, "key", 1, spy);

        expect(cache.get.called).equals(true);
        expect(func.called).equals(true);
        expect(cache.setex.called).equal(true);
        expect(spy.calledOnce).equals(true);
        expect(spy.calledWith(null, 1)).equals(true);
    });

});


