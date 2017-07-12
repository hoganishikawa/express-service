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

    describe('tag-dao test suite', function () {
        require(serverRoot + "/general/models");

        var TagModel = mongoose.model("tag"),
            TagDao = require(serverRoot + '/general/core/dao/tag-dao');

        beforeEach(function () {
            sinon.stub(mongoose, 'connect');
            sinon.stub(mongoose.Types, 'ObjectId', function (val) {
                return val;
            });
            sinon.stub(TagModel.prototype, 'save', function (callback) {
                callback(null, {
                    _id: new mongoose.Types.ObjectId()
                });
            });
            sinon.stub(TagModel, 'findById');

        });

        afterEach(function () {
            mongoose.connect.restore();
            mongoose.Types.ObjectId.restore();
            TagModel.prototype.save.restore();
            TagModel.findById.restore();
        });

        it('should call model.findById when getTagById is called with an objectId', function () {
            var id = new mongoose.Types.ObjectId();
            TagDao.getTagById(id);

            expect(TagModel.findById).to.have.been.calledOnce;
            expect(TagModel.findById).to.have.been.calledWith(id);
        });

        describe('tag create', function () {
            beforeEach(function () {
            });
            afterEach(function () {
            });
            it('should say error when current user is BP or Admin', function () {
                var nonAdminUser = {
                    role: 'TM'
                };
                TagDao.createTag({}, nonAdminUser, function (error) {
                    expect(error).not.to.be.null;
                    expect(error).to.be.instanceOf(Error);
                    expect(error.status).to.equal(422);
                });
            });
            it('should say error when tag type is invalid type', function () {
                var adminUser = {
                    role: 'Admin'
                };
                var newTag = {
                    tagType: 'invalid tag type'
                };
                TagDao.createTag(newTag, adminUser, function (error) {
                    expect(error).to.equal(consts.INVALID_TAG_TYPE);
                });
            });
            it('should create a new tag', function () {
                var adminUser = {
                    _id: new mongoose.Types.ObjectId(),
                    role: 'Admin'
                };
                var newTag = {
                    tagType: 'Scope'
                };
                TagDao.createTag(newTag, adminUser, function (error, createdTag) {
                    expect(error).to.be.null;
                    expect(createdTag).to.include.keys('_id');
                    expect(TagModel.save).to.have.been.calledOnce;
                });
            });
        });

        describe('shuld build tag tree', function () {
            beforeEach(function () {
            });
            afterEach(function () {
            });

            it('should create a new tag', function () {
                var tags = [
                    {
                        "_id": "54906a0381cda6082365763d",
                        "name": "Energy (kWh)",
                        "tagType": "Metric",
                        "creatorRole": "BP",
                        "creator": "54621cd2349cc84500dee9ea",
                        "__v": 0,
                        "potentialPower": null,
                        "nodeType": null,
                        "bpLock": false,
                        "usersWithAccess": [],
                        "appEntities": [],
                        "children": [],
                        "parents": [
                            {
                                "id": "5490307bba2ca1141e4afd75",
                                "tagType": "Node"
                            }
                        ],
                        "summaryMethod": "Total",
                        "formula": null,
                        "metricID": "enwh",
                        "metricType": "Datafeed",
                        "metric": "Standard",
                        "rate": null,
                        "sensorTarget": null,
                        "password": null,
                        "username": null,
                        "dateTimeFormat": null,
                        "timezone": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "address": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    },
                    {
                        "_id": "5490307bba2ca1141e4afd75",
                        "name": "Envoy sensor1",
                        "tagType": "Node",
                        "creatorRole": "BP",
                        "creator": "54621cd2349cc84500dee9ea",
                        "__v": 0,
                        "potentialPower": null,
                        "nodeType": "Solar",
                        "bpLock": false,
                        "usersWithAccess": [],
                        "appEntities": [],
                        "children": [
                            {
                                "tagType": "Metric",
                                "id": "54906a0381cda6082365763d"
                            }
                        ],
                        "parents": [
                            {
                                "id": "549012d1c15488681a64b6ab",
                                "tagType": "Scope"
                            }
                        ],
                        "summaryMethod": null,
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "rate": null,
                        "sensorTarget": "ff",
                        "password": null,
                        "username": null,
                        "dateTimeFormat": null,
                        "timezone": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": "--Use NOAA--",
                        "longitude": 1,
                        "latitude": 1,
                        "webAddress": null,
                        "interval": "Daily",
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": "Envoy:415544",
                        "device": "Envoy",
                        "manufacturer": "Enphase",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "address": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    },
                    {
                        "_id": "549012d1c15488681a64b6ab",
                        "name": "Envoy_1",
                        "tagType": "Scope",
                        "creatorRole": "BP",
                        "creator": "54621cd2349cc84500dee9ea",
                        "__v": 0,
                        "potentialPower": null,
                        "nodeType": null,
                        "bpLock": false,
                        "usersWithAccess": [],
                        "appEntities": [
                            {
                                "appName": "Dashboard",
                                "id": "5461fee651d2f9150018745f"
                            }
                        ],
                        "children": [
                            {
                                "tagType": "Node",
                                "id": "5490307bba2ca1141e4afd75"
                            }
                        ],
                        "parents": [
                            {
                                "id": "549012531e94a8881e6e8e54",
                                "tagType": "Facility"
                            }
                        ],
                        "summaryMethod": null,
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "rate": null,
                        "sensorTarget": null,
                        "password": null,
                        "username": null,
                        "dateTimeFormat": null,
                        "timezone": "Central Daylight Time",
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "endDate": "2014-12-16T11:05:00.000Z",
                        "weatherStation": "1",
                        "longitude": 1,
                        "latitude": 1,
                        "webAddress": null,
                        "interval": "Hourly",
                        "destination": null,
                        "accessMethod": "Push to FTP",
                        "deviceID": "415544",
                        "device": "Envoy",
                        "manufacturer": "Enphase",
                        "utilityAccounts": [],
                        "utilityProvider": null,
                        "nonProfit": null,
                        "taxID": null,
                        "address": null,
                        "street": null,
                        "state": null,
                        "postalCode": null,
                        "country": null,
                        "city": null
                    },
                    {
                        "_id": "549012531e94a8881e6e8e54",
                        "name": "Enphase Facility",
                        "tagType": "Facility",
                        "creatorRole": "BP",
                        "creator": "54621cd2349cc84500dee9ea",
                        "__v": 0,
                        "potentialPower": null,
                        "nodeType": null,
                        "bpLock": false,
                        "usersWithAccess": [],
                        "appEntities": [],
                        "children": [
                            {
                                "tagType": "Scope",
                                "id": "549012d1c15488681a64b6ab"
                            }
                        ],
                        "parents": [],
                        "summaryMethod": null,
                        "formula": null,
                        "metricID": null,
                        "metricType": null,
                        "metric": null,
                        "rate": null,
                        "sensorTarget": null,
                        "password": null,
                        "username": null,
                        "dateTimeFormat": null,
                        "timezone": null,
                        "enphaseUserId": null,
                        "endDate": null,
                        "weatherStation": null,
                        "longitude": null,
                        "latitude": null,
                        "webAddress": null,
                        "interval": null,
                        "destination": null,
                        "accessMethod": null,
                        "deviceID": null,
                        "device": null,
                        "manufacturer": null,
                        "utilityAccounts": [
                            ""
                        ],
                        "utilityProvider": "",
                        "nonProfit": false,
                        "taxID": "",
                        "address": "",
                        "street": "",
                        "state": "",
                        "postalCode": "",
                        "country": "",
                        "city": ""
                    }
                ];

                var tree = TagDao.buildTagsTree(tags, ["549012531e94a8881e6e8e54"]);
                expect(tree.length).to.equal(1);
                expect(tree[0].name).to.equal("Enphase Facility");
                expect(tree[0].childTags.length).to.equal(1);//scope
                expect(tree[0].childTags[0].name).to.equal("Envoy_1");
                expect(tree[0].childTags[0].tagType).to.equal(consts.TAG_TYPE.Scope);
                expect(tree[0].childTags[0].childTags.length).to.equal(1);//node
            });
        });
    });
}());
