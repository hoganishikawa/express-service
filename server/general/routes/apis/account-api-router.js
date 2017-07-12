"use strict";

var express = require("express"),
    router = express.Router(),
    log = require("../../../libs/log")(module),
    config = require("../../../config"),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../core/user/check-auth"),
    awsAssetsUtils = require("../../core/aws/assets-utils"),
    accountDAO = require("../../core/dao/account-dao"),
    assetsDAO = require("../../core/dao/asset-dao");

 /**
 * @api {put} /v1/accounts/:accountId Update Account
 * @apiGroup Account
 * @apiName Update Account
 * @apiVersion 1.0.0
 * @apiDescription Edit account data. API can accept only changed fields.
 * However id and sfdcAccountId are mandatory. <br/>
 * Following fields can't be updated: <br/>
 *      awsAssetsKeyPrefix <br/>
 *      appEntities <br/>
 *      sfdcAccountId <br/>
 * @apiParam {Object} account account data
 * @apiExample Example request
 *
 *  account:
 *  {
 *      "name" : "Parkway C-2 School District updated",
 *      "cname" : "parkwayschools",
 *      "tickerSymbol" : null,
 *      "dunsNumber" : null,
 *      "webSite" : "http://parkway.brightergy.com",
 *      "phone" : "1111111111",
 *      "email" : "AdamAdmin@brightergy.com",
 *      "sfdcAccountId" : "001C0000013iMilIAE"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated account object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"54135e074f09ccc06d5be3d2",
 *          "name":"Parkway",
 *          "gDriveAssetsFolderId":"0BwW4a4uizniHTEdpX1cyR1JpakU",
 *          "__v":0,
 *          "shippingStreet":"",
 *          "shippingState":"",
 *          "shippingPostalCode":"",
 *          "shippingCountry":"",
 *          "shippingCity":"",
 *          "shippingAddress":null,
 *          "billingStreet":"",
 *          "billingState":"",
 *          "billingPostalCode":"",
 *          "billingCountry":"",
 *          "billingCity":"",
 *          "billingAddress":null,
 *          "cname":null,
 *          "tickerSymbol":null,
 *          "dunsNumber":null,
 *          "webSite":"https://parkway.brightergy.com/",
 *          "phone":"8168660555",
 *          "email":"AdamAdmin@brightergy.com",
 *          "sfdcAccountId":"001L000000U2ZQIIA3",
 *          "gDriveUserFolderId":"0BwW4a4uizniHbFlOWmlzZzJwaEk",
 *          "awsAssetsFolderName":null,
 *          "sfdcAccountURL":"https://cs15.salesforce.com/001L000000U2ZQIIA3",
 *          "id":"54135e074f09ccc06d5be3d2"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:accountId", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if(findUserErr) {
            return next(findUserErr);
        } else {
            if(currentUser.role ===  consts.USER_ROLES.BP || currentUser.role ===  consts.USER_ROLES.Admin) {
                var accountObj = req.body.account;
                var accountId = req.params.accountId;

                utils.removeMongooseVersionField(accountObj);
                utils.removeMultipleFields(accountObj,
                    [
                        "awsAssetsKeyPrefix"
                    ]
                );

                accountDAO.update(accountObj, accountId, function(err, result) {
                    if(err) {
                        return next(err);
                    } else {
                        return utils.successResponse(result, res, next);
                    }
                });
            } else {
                var error = new Error(consts.CAN_NOT_EDIT_ACCOUNT);
                error.status = 422;
                return next(error);
            }
        }

    });
});

 /**
 * @api {get} /v1/accounts/verifycname/:accountCname Verify Account CNAME
 * @apiGroup Account
 * @apiName Verify Account CNAME
 * @apiVersion 1.0.0
 * @apiDescription Check if the given account CName is vaild
 * @apiExample Example request
 *  accountCname : parkway
 *
 * @apiSuccess success 1
 * @apiSuccess message true(vaild),false(invalid)
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":true
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/verifycname/:cname", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if(findUserErr) {
            return next(findUserErr);
        } else {
            var cname = req.params.cname;

            accountDAO.verifyCNAME(cname, function(err, result) {
                if(err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
        }

    });
});

 /**
 * @api {post} /v1/accounts/createwithsf Create Account With SF
 * @apiGroup Account
 * @apiName Create Account With SF
 * @apiVersion 1.0.0
 * @apiDescription Create account with Salesforce
 * @apiParam {Object} account account data
 * @apiParam {Object} user user data
 * @apiExample Example request
 * account:
 *  {
 *      "name" : "Brightergy Backend",
 *      "shippingStreet" : "1617 Main St",
 *      "shippingState" : "MO",
 *      "shippingPostalCode" : "64108",
 *      "shippingCountry" : "US",
 *      "shippingCity" : "Kansas City",
 *      "billingStreet" : "1617 Main St # Street3",
 *      "billingState" : "MO",
 *      "billingPostalCode" : "64108",
 *      "billingCountry" : "US",
 *      "billingCity" : "Kansas City",
 *      "cname" : "BrightergyBackend",
 *      "tickerSymbol" : null,
 *      "dunsNumber" : null,
 *      "webSite" : null,
 *      "phone" : "8168660567",
 *      "email" : "AdamAdmin@brightergy.com",
 *      "__v" : 0,
 *      "billingAddress" : "1617 Main Street\n3rd Floor\nKansas City, MO 64108",
 *      "shippingAddress" : "1617 Main Street\nKansas City, MO 64108",
 *      "awsAssetsKeyPrefix" : "CzosLKynCRHPHBv80nZP3mpp"
 *  }
 *
 * user:
 *  {
 *      "firstName": "aleksei",
 *      "lastName": "Pylyp",
 *      "email": "aleksei.pylyp@brightergy.com",
 *      "emailUser": "aleksei.pylyp",
 *      "emailDomain": "brightergy.com",
 *      "password": "Brightergy1",
 *      "role": "Admin",
 *      "accounts":["54135e074f09ccc06d5be3d2"],
 *      "profilePictureUrl" : "/components/company-panel/assets/img/icon_SF_large.png"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created account object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"54135e074f09ccc06d5be3d2",
 *          "name":"Parkway",
 *          "gDriveAssetsFolderId":"0BwW4a4uizniHTEdpX1cyR1JpakU",
 *          "__v":0,
 *          "shippingStreet":"",
 *          "shippingState":"",
 *          "shippingPostalCode":"",
 *          "shippingCountry":"",
 *          "shippingCity":"",
 *          "shippingAddress":null,
 *          "billingStreet":"",
 *          "billingState":"",
 *          "billingPostalCode":"",
 *          "billingCountry":"",
 *          "billingCity":"",
 *          "billingAddress":null,
 *          "cname":null,
 *          "tickerSymbol":null,
 *          "dunsNumber":null,
 *          "webSite":"https://parkway.brightergy.com/",
 *          "phone":"8168660555",
 *          "email":"AdamAdmin@brightergy.com",
 *          "sfdcAccountId":"001L000000U2ZQIIA3",
 *          "gDriveUserFolderId":"0BwW4a4uizniHbFlOWmlzZzJwaEk",
 *          "awsAssetsFolderName":null,
 *          "sfdcAccountURL":"https://cs15.salesforce.com/001L000000U2ZQIIA3",
 *          "id":"54135e074f09ccc06d5be3d2"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/createwithsf", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var accountObj = req.body.account;
            var userObj = req.body.user;

            utils.removeMongooseVersionField(accountObj);
            utils.removeMongooseVersionField(userObj);

            if(!accountObj || !userObj) {
                return next(new Error(consts.INCORRECT_CREATE_ACCOUNT_BODY));
            } else if(currentUser.role ===  consts.USER_ROLES.BP) {

                accountDAO.createWithSF(accountObj, userObj, function (err, result) {
                    if(err) {
                        return next(err);
                    } else {
                        return utils.successResponse(result, res, next);
                    }
                });
            } else {
                var error = new Error(consts.CAN_NOT_CREATE_ACCOUNT);
                error.status = 422;
                return next(error);
            }
        }
    });
});

 /**
 * @api {post} /v1/accounts?type=:type Create Account
 * @apiGroup Account
 * @apiName Create Account
 * @apiVersion 1.0.0
 * @apiDescription Create account. If type=self, 
 * registered account and user will require validation from Brightergy Personnel
 * @apiParam {Object} account accout data
 * @apiParam {Object} user user data
 * @apiExample Example request
 * account:
 *  {
 *      "name" : "Brightergy Backend",
 *      "shippingStreet" : "1617 Main St",
 *      "shippingState" : "MO",
 *      "shippingPostalCode" : "64108",
 *      "shippingCountry" : "US",
 *      "shippingCity" : "Kansas City",
 *      "billingStreet" : "1617 Main St # Street3",
 *      "billingState" : "MO",
 *      "billingPostalCode" : "64108",
 *      "billingCountry" : "US",
 *      "billingCity" : "Kansas City",
 *      "cname" : "aleksei1",
 *      "tickerSymbol" : null,
 *      "dunsNumber" : null,
 *      "webSite" : null,
 *      "phone" : "8168660567",
 *      "email" : "AdamAdmin@brightergy.com",
 *      "sfdcAccountId" : "001M000000dhnyWIAQ",
 *      "__v" : 0,
 *      "billingAddress" : "1617 Main Street\n3rd Floor\nKansas City, MO 64108",
 *      "shippingAddress" : "1617 Main Street\nKansas City, MO 64108",
 *      "awsAssetsKeyPrefix" : "CzosLKynCRHPHBv80nZP3mpp"
 *  }
 *
 * user:
 *  {
 *      "firstName": "aleksei",
 *      "lastName": "Pylyp",
 *      "email": "aleksei.pylyp1@brightergy.com",
 *      "emailUser": "aleksei.pylyp",
 *      "emailDomain": "brightergy.com",
 *      "password": "Brightergy1",
 *      "role": "Admin",
 *      "accounts":["54135e074f09ccc06d5be3d2"],
 *      "profilePictureUrl" : "/components/company-panel/assets/img/icon_SF_large.png"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created object data
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"54135e074f09ccc06d5be3d2",
 *          "name":"Parkway",
 *          "gDriveAssetsFolderId":"0BwW4a4uizniHTEdpX1cyR1JpakU",
 *          "__v":0,
 *          "shippingStreet":"",
 *          "shippingState":"",
 *          "shippingPostalCode":"",
 *          "shippingCountry":"",
 *          "shippingCity":"",
 *          "shippingAddress":null,
 *          "billingStreet":"",
 *          "billingState":"",
 *          "billingPostalCode":"",
 *          "billingCountry":"",
 *          "billingCity":"",
 *          "billingAddress":null,
 *          "cname":null,
 *          "tickerSymbol":null,
 *          "dunsNumber":null,
 *          "webSite":"https://parkway.brightergy.com/",
 *          "phone":"8168660555",
 *          "email":"AdamAdmin@brightergy.com",
 *          "sfdcAccountId":"001L000000U2ZQIIA3",
 *          "gDriveUserFolderId":"0BwW4a4uizniHbFlOWmlzZzJwaEk",
 *          "awsAssetsFolderName":null,
 *          "sfdcAccountURL":"https://cs15.salesforce.com/001L000000U2ZQIIA3",
 *          "id":"54135e074f09ccc06d5be3d2"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", function(req, res, next) {

    var accountObj = req.body.account;
    var userObj = req.body.user;

    utils.removeMongooseVersionField(accountObj);
    utils.removeMongooseVersionField(userObj);

    var params = req.query;
    if(!accountObj || !userObj) {
        return next(new Error(consts.INCORRECT_CREATE_ACCOUNT_BODY));
    } else if(params.type === "self") {
        //self registration account with sf Lead record
        accountDAO.createSelf(accountObj, userObj, function (err, result) {
            if(err) {
                return next(err);
            } else {
                return utils.successResponse(result, res, next);
            }
        });
    } else {
        checkAuth(req, res, next, function(findUserErr, currentUser) {
            if (findUserErr) {
                return next(findUserErr);
            } else {
                if(currentUser.role ===  consts.USER_ROLES.BP) {
                    accountDAO.create(accountObj, userObj, function (err, result) {
                        if(err) {
                            return next(err);
                        } else {
                            return utils.successResponse(result, res, next);
                        }
                    });
                } else {
                    var error = new Error(consts.CAN_NOT_CREATE_ACCOUNT);
                    error.status = 422;
                    return next(error);
                }
            }
        });
    }


});

/*router.post("/user/:userId", function(req, res, next) {
    checkAuth(req, res, next, function (findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            if(currentUser.role === consts.USER_ROLES.BP || currentUser.role === consts.USER_ROLES.Admin) {

                var userId = req.params.userId;
                var accountIds = req.body;

                accountDAO.addAccountsToUser(userId, accountIds, function (err, result) {
                    if (err) {
                        return next(err);
                    } else {
                        return utils.successResponse(result, res, next);
                    }
                })
            } else {

                return next(new Error(consts.CAN_NOT_ASSOCIATE_ACCOUNT_WITH_USERS));
            }
        }
    });
});

router.delete("/user/:userId", function(req, res, next) {
    checkAuth(req, res, next, function (findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            if(currentUser.role === consts.USER_ROLES.BP || currentUser.role === consts.USER_ROLES.Admin) {
                var userId = req.params.userId;
                var accountIds = req.body;

                accountDAO.removeAccountsFromUser(userId, accountIds, function (err, result) {
                    if (err) {
                        return next(err);
                    } else {
                        return utils.successResponse(result, res, next);
                    }
                })

            } else {
                return next(new Error(consts.CAN_NOT_REMOVE_USERS_FROM_ACCOUNT));
            }
        }
    });
});
*/

 /**
 * @api {get} /v1/accounts/:accountId/users Get Users by Account Id
 * @apiGroup Account
 * @apiName Get Users by Account Id
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the users by account Id
 * @apiExample Example request
 *  accountId : 54135e074f09ccc06d5be3d2
 *
 * @apiSuccess success 1
 * @apiSuccess message user objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"54135ec74f09ccc06d5be3d6",
 *          "firstName":"Adam",
 *          "lastName":"Admin",
 *          "email":"adam@brightergy.com",
 *          "emailUser":"adam",
 *          "emailDomain":"brightergy.com",
 *          "__v":17,
 *          "accessibleTags":[{
 *              "tagType":"Facility",
 *              "id":"543824bd7174d62c1acad50f"
 *          },{
 *              "tagType":"Facility",
 *              "id":"543824bf7174d62c1acad51d"
 *          }],
 *          "accounts":["54135e074f09ccc06d5be3d2"],
 *          "children":[],
 *          "parents":[],
 *          "profilePictureUrl":null,
 *          "sfdcContactId":"003L000000OUS4VIAX",
 *          "defaultApp":"DataSense",
 *          "apps":["Present"],
 *          "previousEditedDashboardId":null,
 *          "lastEditedDashboardId":null,
 *          "previousEditedPresentation":null,
 *          "lastEditedPresentation":null,
 *          "role":"Admin",
 *          "enphaseUserId":null,
 *          "socialToken":null,
 *          "phone":"1-816-866-0555",
 *          "middleName":"",
 *          "name":"Adam Admin",
 *          "sfdcContactURL":"https://cs15.salesforce.com/003L000000OUS4VIAX",
 *          "id":"54135ec74f09ccc06d5be3d6"
 *      },{
 *          "_id":"5429d0ba89c1849502287d5c",
 *          "firstName":"Emmanuel",
 *          "lastName":"Admin",
 *          "email":"emmanuel.ekochuone@brightergy.com",
 *          "emailUser":"emmanuel.ekochuone",
 *          "emailDomain":"brightergy.com",
 *          "__v":4,
 *          "accessibleTags":[{
 *              "tagType":"Facility",
 *              "id":"543824bd7174d62c1acad50f"
 *          },{
 *              "tagType":"Facility",
 *              "id":"543824bf7174d62c1acad51d"
 *          }],
 *          "accounts":["54135e074f09ccc06d5be3d2"],
 *          "children":[],
 *          "parents":[],
 *          "profilePictureUrl":null,
 *          "sfdcContactId":"003L000000Q65ZBIAZ",
 *          "defaultApp":"DataSense",
 *          "apps":["Present", "Analyze", "Classroom", "Verify", "Respond", "Utilities", "Projects", "Connect"],
 *          "previousEditedDashboardId":null,
 *          "lastEditedDashboardId":null,
 *          "previousEditedPresentation":null,
 *          "lastEditedPresentation":"5429d13f89c1849502287d5d",
 *          "role":"Admin",
 *          "enphaseUserId":"4d7a59344d5445300a",
 *          "socialToken":null,
 *          "phone":"1-800-856-3256",
 *          "middleName":"",
 *          "name":"Emmanuel Admin",
 *          "sfdcContactURL":"https://cs15.salesforce.com/003L000000Q65ZBIAZ",
 *          "id":"5429d0ba89c1849502287d5c"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:accountId/users/:limit?", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var accountId = req.params.accountId;
            var limit = req.params.limit;

            accountDAO.getUsersByAccount(currentUser, accountId, limit, function (err, findUsers) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(findUsers, res, next);
                }
            });
        }
    });
});

 /**
 * @api {get} /v1/accounts?searchKey=:searchKey&limit=:limit Get Accounts
 * @apiGroup Account
 * @apiName Get Accounts
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the account list. when searchKey is all_data, retrieves the all data.
 *
 * @apiSuccess success 1
 * @apiSuccess message Account objects
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":[{
 *          "_id":"54135e074f09ccc06d5be3d2",
 *          "name":"Parkway",
 *          "gDriveAssetsFolderId":"0BwW4a4uizniHTEdpX1cyR1JpakU",
 *          "__v":0,
 *          "shippingStreet":"",
 *          "shippingState":"",
 *          "shippingPostalCode":"",
 *          "shippingCountry":"",
 *          "shippingCity":"",
 *          "shippingAddress":null,
 *          "billingStreet":"",
 *          "billingState":"",
 *          "billingPostalCode":"",
 *          "billingCountry":"",
 *          "billingCity":"",
 *          "billingAddress":null,
 *          "cname":null,
 *          "tickerSymbol":null,
 *          "dunsNumber":null,
 *          "webSite":"https://parkway.brightergy.com/",
 *          "phone":"8168660555",
 *          "email":"AdamAdmin@brightergy.com",
 *          "sfdcAccountId":"001L000000U2ZQIIA3",
 *          "gDriveUserFolderId":"0BwW4a4uizniHbFlOWmlzZzJwaEk",
 *          "awsAssetsFolderName":null,
 *          "sfdcAccountURL":"https://cs15.salesforce.com/001L000000U2ZQIIA3",
 *          "id":"54135e074f09ccc06d5be3d2"
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/?", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var searchKey = req.query.searchKey;

            if(searchKey === consts.ALL) {
                searchKey = null;
            }

            var limit = req.query.limit;

            accountDAO.getAccountsByUser(currentUser,searchKey, limit, function (err, findUsers) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(findUsers, res, next);
                }
            });
        }
    });
});

 /**
 * @api {post} /v1/accounts/:accountId/assets Upload Account Assets
 * @apiGroup Account
 * @apiName Upload Account Assets
 * @apiVersion 1.0.0
 * @apiDescription Upload account asset.
 * @apiParam {String} accountId account Id
 * @apiParam {File Object} assetsFile asset file data
 *
 * @apiSuccess success 1
 * @apiSuccess message uploaded assets data
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/:accountId/assets", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var error;
            if (currentUser.role === consts.USER_ROLES.BP || currentUser.role === consts.USER_ROLES.Admin) {
                var accountId = req.params.accountId;

                accountDAO.getAccountById(accountId, function (findErr, findAccount) {
                    if (findErr) {
                        return next(findErr);
                    } else {
                        if(findAccount.awsAssetsKeyPrefix) {
                            var keyPrefix = config.get("aws:assets:accountAssetsKeyPrefix");
                            keyPrefix = keyPrefix + "/" + findAccount.awsAssetsKeyPrefix;

                            var assetsFiles = req.files.assetsFile;

                            if(!Array.isArray(assetsFiles)) {
                                assetsFiles = [assetsFiles];
                            }

                            awsAssetsUtils.uploadMultiFiles(keyPrefix, assetsFiles, true, 
                                function (uploadErr, uploadedFiles) {
                                if(uploadErr) {
                                    return next(uploadErr);
                                } else {
                                    return utils.successResponse(uploadedFiles, res, next);
                                }
                            });
                        }
                        else {
                            error = new Error(consts.UNKNOWN_AWS_ASSETS_KEY);
                            error.status = 503;
                            return next(error);
                        }
                    }
                });
            } else {
                error = new Error(consts.CAN_NOT_UPLOAD_ACCOUNT_ASSETS);
                error.status = 503;
                return next(error);
            }
        }
    });

});

 /**
 * @api {get} /v1/accounts/:accountId/assets?searchKey=:searchKey&limit=:limit Get Account Assets
 * @apiGroup Account
 * @apiName Get Account Assets
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the All account assets. When the research key is specified, 
 *  it retrieves the associated account assets including search name.
 * @apiExample Example request
 *  accountId : 54135e074f09ccc06d5be3d2
 *  searchKey : spacing
 *
 * @apiSuccess success 1
 * @apiSuccess message list of account assets
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:accountId/assets?", function(req, res, next) {
    var accountId = req.params.accountId;
    var searchKey = req.query.searchKey;
    var limit = req.query.limit;
    var keyPrefix = config.get("aws:assets:accountAssetsKeyPrefix");

    log.info("account assets find " + searchKey);

    accountDAO.getAccountById(accountId, function (findErr, findAccount) {
        if (findErr) {
            return next(findErr);
        } else {
            keyPrefix = keyPrefix + "/" + findAccount.awsAssetsKeyPrefix;
            assetsDAO.findImages(req, res, next, keyPrefix, searchKey, limit);
        }
    });
});

 /**
 * @api {get} /v1/accounts/:accountId/assets/load Load Account Assets From AWS
 * @apiGroup Account
 * @apiName Load Account Assets From AWS
 * @apiVersion 1.0.0
 * @apiDescription Load the account assets from AWS to redis
 * @apiExample Example request
 *  accountId : 54135e074f09ccc06d5be3d2
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:accountId/assets/load", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var accountId = req.params.accountId;

            accountDAO.getAccountById(accountId, function (findErr, findAccount) {
                if (findErr) {
                    return next(findErr);
                } else {
                    if(!findAccount.awsAssetsKeyPrefix) {
                        var error = new Error(consts.UNKNOWN_ASSETS_FOLDER_ID);
                        error.status = 503;
                        return next(error);
                    } else {
                        awsAssetsUtils.storeImagesInCache(findAccount.awsAssetsKeyPrefix);
                        return utils.successResponse(consts.ASSETS_NOT_LOADED, res, next);
                    }
                }
            });
        }
    });
});

 /**
 * @api {delete} /v1/accounts/:accountId/assets/:assetId Delete Account Assets
 * @apiGroup Account
 * @apiName Delete Account Assets
 * @apiVersion 1.0.0
 * @apiDescription Remove account assets by Id
 * @apiExample Example request
 *  accountId : 54135e074f09ccc06d5be3d2
 *  assetId : assets_14163080760412
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:accountId/assets/:assetId", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var error;
            if (currentUser.role === consts.USER_ROLES.BP || currentUser.role === consts.USER_ROLES.Admin) {
                var accountId = req.params.accountId;
                var assetId = req.params.assetId;

                accountDAO.getAccountById(accountId, function (findErr, findAccount) {
                    if (findErr) {
                        return next(findErr);
                    } else {
                        if(findAccount.awsAssetsKeyPrefix) {
                            var keyPrefix = config.get("aws:assets:accountAssetsKeyPrefix");
                            keyPrefix = keyPrefix + "/" + findAccount.awsAssetsKeyPrefix;

                            awsAssetsUtils.deleteFile(keyPrefix, assetId, function (deleteErr, deletedFile) {
                                if (deleteErr) {
                                    return next(deleteErr);
                                } else {
                                    return utils.successResponse(deletedFile, res, next);
                                }
                            });
                        }
                        else {
                            error = new Error(consts.UNKNOWN_AWS_ASSETS_KEY);
                            error.status = 503;
                            return next(error);
                        }
                    }
                });
            } else {
                error = new Error(consts.CAN_NOT_DELETE_ACCOUNT_ASSETS);
                error.status = 503;
                return next(error);
            }
        }
    });
});

/**
 * @api {delete} /v1/accounts/lead/:sfLeadId?apikey=sfapikey Delete Account with matched SF Lead Id
 * @apiGroup Account
 * @apiName Delete Account
 * @apiVersion 1.0.0
 * @apiDescription Remove account with matched SF Lead Id
 * @apiExample Example request
 *  sfLeadId : 00QL000000DTV6VMAX
 *  apikey : 1111111
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/lead/:leadId", function(req, res, next) {

    var apiKey = req.query.apikey;
    var leadId = req.params.leadId;

    if(apiKey === config.get("salesforce:auth:apikey")) {
        accountDAO.deleteAccountByLeadId(leadId, function(err, result) {
            if(err) {
                return next(err);
            } else {
                return utils.successResponse(result, res, next);
            }

        });
    } else {
        var error = new Error("Incorrect api key");
        error.status = 403;
        return next(error);
    }
});

/**
 * @api {post} /v1/accounts/lead/:sfLeadId?apikey=sfapikey Set Account and User sfdc Id by lead Id
 * @apiGroup Account
 * @apiName Set Account and User sfdc Id by lead Id
 * @apiVersion 1.0.0
 * @apiDescription Remove account with matched SF Lead Id
 * @apiExample Example request
 *  sfLeadId : 00QL000000DTV6VMAX
 *  apikey : 1111111
 *  accountId: 111
 *  contactId: 222
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/lead/:leadId", function(req, res, next) {

    var apiKey = req.query.apikey;
    var leadId = req.params.leadId;

    var body = req.body;

    var error = null;

    if(!body.accountId || !body.contactId) {
        error = new Error("Incorrect api key");
        error.status = 422;
        return next(error);
    } else if(apiKey === config.get("salesforce:auth:apikey")) {
        accountDAO.setCorrectSFDCIdByLead(leadId, body.accountId, body.contactId, function(err, result) {
            if(err) {
                return next(err);
            } else {
                return utils.successResponse(result, res, next);
            }

        });
    } else {
        error = new Error("Incorrect api key");
        error.status = 403;
        return next(error);
    }
});

module.exports = router;