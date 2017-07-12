/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        mongoose = require('mongoose'),
        consts = require(serverRoot + "/libs/consts");

    chai.use(require('sinon-chai'));

    describe('user-dao test suite', function () {

        var userDao = require(serverRoot + '/general/core/dao/user-dao');

        beforeEach(function () {
        });

        afterEach(function () {
        });

        it('should filter solar nodes', function () {
            var tag = {
                tagType: consts.TAG_TYPE.Facility,
                name: "FacilityA",
                childTags: [{
                    _id: new mongoose.Schema.Types.ObjectId(),
                    tagType: consts.TAG_TYPE.Scope,
                    name: "ScopeA",
                    childTags: [{
                        _id: new mongoose.Schema.Types.ObjectId(),
                        tagType: consts.TAG_TYPE.Node,
                        name: "NodeA",
                        deviceID: "deviceA",
                        nodeType: consts.NODE_TYPE.Solar,
                        childTags: [{
                            tagType: consts.TAG_TYPE.Metric,
                            rate: 0.5,
                            name: consts.METRIC_NAMES.Reimbursement
                        }]
                    }]
                }]

            };

            var facilities = {
                scopes: []
            };
            var geo = {};

            userDao.findSolarNodesByFacility(tag, tag.name, tag.timezone, {}, facilities, null, geo);

            expect(facilities.scopes.length).to.equals(1);
            expect(facilities.scopes[0].nodes[0].nodeId).to.equals("deviceA");
        });
    });
}());
