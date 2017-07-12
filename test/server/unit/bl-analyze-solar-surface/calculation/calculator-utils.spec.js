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

    describe('assurf calculator-utils test', function () {

        var calcUtils = require(serverRoot + '/bl-analyze-solar-surface/core/calculation/calculator-utils.js');

        beforeEach(function () {
        });

        afterEach(function () {
        });


        var solarTags = {
            "facilities": [
                {
                    "id": "549012531e94a8881e6e8e54",
                    "name": "Enphase Facility",
                    "scopes": [
                        {
                            "id": "54902ef4ba2ca1141e4afd74",
                            "name": "Envoy_4",
                            "potentialPower": 0,
                            "nodes": [
                                {
                                    "scopeName": "Envoy_4",
                                    "nodeId": "Envoy:406326",
                                    "rate": 0,
                                    "deviceOffset": -360,
                                    "powerMetricId": "Pac"
                                }
                            ]
                        }
                    ],
                    "potentialPower": 1
                }
            ],
            "geo": {
                "latitude": 38.53724,
                "longitude": -90.273231
            }
        };

        it('should filter sources tempoiq response', function () {
            var tmp  = calcUtils.getTempoIQParametersByUserSources(false, solarTags.facilities);
            var nodeKeys = Object.keys(tmp.nodeList);
            expect(nodeKeys.length).to.equal(1);
        });


        it("should return the displayName equals to name if not displayName difined", function() {
            var tmp  = calcUtils.getTempoIQParametersByUserSources(false, solarTags.facilities, [], [], []);
            expect(tmp.facilitiesList["Enphase Facility"].name).equals("Enphase Facility");
            expect(tmp.facilitiesList["Enphase Facility"].displayName).equals("Enphase Facility");
            var scopes = tmp.facilitiesList["Enphase Facility"].scopes;
            expect(scopes).has.property("Envoy_4");
            expect(scopes.Envoy_4.name).equals("Envoy_4");
            expect(scopes.Envoy_4.displayName).equals("Envoy_4");
        });


        it("should return given displayName if defined", function() {
            solarTags.facilities[0].displayName = "aaa";
            solarTags.facilities[0].scopes[0].displayName = "bbb";
            var tmp  = calcUtils.getTempoIQParametersByUserSources(false, solarTags.facilities, [], [], []);
            expect(tmp.facilitiesList["Enphase Facility"].displayName).equals("aaa");
            var scopes = tmp.facilitiesList["Enphase Facility"].scopes;
            expect(scopes.Envoy_4.displayName).equals("bbb");
        });
    })
}());
