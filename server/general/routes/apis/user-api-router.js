"use strict";

var express = require("express"),
    router = express.Router(),
    utils = require("../../../libs/utils"),
    consts = require("../../../libs/consts"),
    checkAuth = require("../../core/user/check-auth"),
    userDAO = require("../../core/dao/user-dao"),
    sfContactUtils = require("../../core/salesforce/contact-utils"),
    config = require("../../../config"),
    awsAssetsUtils = require("../../core/aws/assets-utils"),
    accountDAO = require("../../core/dao/account-dao"),
    tagDAO = require("../../core/dao/tag-dao"),
    cryptoJS = require("crypto-js");

 /**
 * @api {get} /v1/users/applications Get App configuration
 * @apiGroup User
 * @apiName Get App configuration
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the App configuration values.
 *
 * @apiSuccess success 1
 * @apiSuccess message App configuration values in sever/config/config.json
 * @apiSuccessExample Success example
 * {
        "success":1,
        "message":{
            "Classroom": "/brightersavings",
            "Present": "/management",
            "Verify": "/verifiedsavings",
            "Respond": "/loadresponse",
            "Analyze": "/datasense",
            "Utilities": "/utilitymanager",
            "Projects": "/programsandprojects",
            "Connect": "/energystar"
        }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/applications", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            userDAO.getApplications(currentUser, function(err, result) {
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
 * @api {put} /v1/users/:userId Update User
 * @apiGroup User
 * @apiName Update User
 * @apiVersion 1.0.0
 * @apiDescription Edit user informations and retrieves the updated one. 
 * API can accepts the only changed fields. However id is mandatory. <br/>
 * Following fields can't be updated: <br/>
 *      role <br/>
 *      password <br/>
 *      socialToken <br/>
 *      enphaseUserId <br/>
 *      tokens <br/>
 *      sfdcContactId <br/>
 *      profilePictureUrl <br/>
 *      accessibleTags <br/>
 * @apiParam {Object} user user data
 * @apiExample Example request
 *  userId : 5416f4647fd9bfec17c6253d
 *  user
 *  {
 *      "_id" : "5416f4647fd9bfec17c6253d",
 *      "firstName" : "Emmanuel",
 *      "lastName" : "Ekochu"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated user data
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
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:userId", function(req, res, next) {

    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var userObj = req.body.user;
            var userId = req.params.userId;

            utils.removeMongooseVersionField(userObj);
            utils.removeMultipleFields(userObj,
                [
                    "password",
                    "socialToken",
                    "enphaseUserId",
                    "tokens",
                    "sfdcContactId",
                    "profilePictureUrl",
                    "accessibleTags"
                ]
            );

            if(userObj && userObj.role && userObj.role ===  consts.USER_ROLES.BP) {
                userObj.accounts = []; //remove other accounts
            }
            userDAO.editUser(currentUser, userObj, userId, function (err, savedUser) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(savedUser, res, next);
                }
            });
        }
    });
});

 /**
 * @api {post} /v1/users Create User
 * @apiGroup User
 * @apiName Create User
 * @apiVersion 1.0.0
 * @apiDescription Create new user
 * @apiParam {Object} user user data
 * @apiParam {String} sfdcAccountId salesforce account Id
 * @apiExample Example request
 *  sfdcAccountId : 001C0000013iMilIAE
 *  user
 *  {
 *      "firstName" : "user",
 *      "lastName" : "test",
 *      "email" : "testuser@brightergy.com",
 *      "emailUser" : "testuser",
 *      "emailDomain" : "brightergy.com",
 *      "password" : "Brightergy1",
 *      "role" : "Admin",
 *      "accounts" : ["54135e074f09ccc06d5be3d2"],
 *      "profilePictureUrl" : "https://docs.google.com/a/brightergy.com/uc?id=0BwW4a4uizniHTUJscjVTUTJhMEE",
 *      "accessibleTags" : [
 *          {
 *              "tagType" : "Facility",
 *              "id" : "543824bd7174d62c1acad50f"
 *          },{
 *              "tagType" : "Facility",
 *              "id" : "543824bf7174d62c1acad51d"
 *          }
 *      ]
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Created user data
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
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/", function(req, res, next) {

    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            var sfdcAccountId = req.body.sfdcAccountId;
            var userObj = req.body.user;
            var error;

            utils.removeMongooseVersionField(userObj);

            if(userObj.role && userObj.role ===  consts.USER_ROLES.BP) {
                if(currentUser.role ===  consts.USER_ROLES.BP) {
                    userObj.accounts = []; //remove other accounts
                    userDAO.validate(userObj, function (validateErr, status) {
                        if (validateErr) {
                            return next(validateErr);
                        } else {
                            userDAO.createBP(userObj, function (err, savedUser) {
                                if (err) {
                                    return next(err);
                                } else {
                                    return utils.successResponse(savedUser, res, next);
                                }
                            });
                        }
                    });
                }
                else {
                    error = new Error(consts.CAN_NOT_REGISTER_BP_USERS);
                    error.status = 422;
                    return next(error);
                }
            }
            else if(currentUser.role ===  consts.USER_ROLES.BP || currentUser.role ===  consts.USER_ROLES.Admin) {
           
                var startContactApproval = currentUser.role !== consts.USER_ROLES.BP;

                userDAO.validate(userObj, function (validateErr, status) {
                    if (validateErr) {
                        return next(validateErr);
                    } else {
                        if(userObj.sfdcContactId) {
                            error = new Error(consts.CAN_NOT_USE_EXISTING_SF_CONTACT);
                            error.status = 422;
                            return next(error);
                        } else if (!userObj.accessibleTags || !userObj.accessibleTags.length) {
                            error = new Error(consts.REQUIRE_ACCESSIBLE_TAGS_FOR_USER);
                            error.status = 422;
                            return next(error);
                        } else {
                            userDAO.createUser(userObj, true, sfdcAccountId,
                                startContactApproval, function (err, savedUser) {
                                if (err) {
                                    return next(err);
                                } else {
                                    return utils.successResponse(savedUser, res, next);
                                }
                            });
                        }
                    }
                });
            } else {
                error = new Error(consts.CAN_NOT_REGISTER_USERS);
                error.status = 422;
                return next(error);
            }
        }
    });
});

 /**
 * @api {get} /v1/users/accounts?searchKey=:searchKey&limit=:limit Get All Account For User
 * @apiGroup User
 * @apiName Get All Account For User
 * @apiVersion 1.0.0
 * @apiDescription Retrieves all accounts of currently logged in user. 
 *  when searchKey is all_data, it retrieves the all accounts.
 *
 * @apiSuccess success 1
 * @apiSuccess message Account objects
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
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/accounts?", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var searchKey = req.query.searchKey;
            var limit = req.query.limit;

            if(searchKey === consts.ALL) {
                searchKey = null;
            }

            accountDAO.getUsersByAllAccounts(currentUser, searchKey, limit, function (err, findUsers) {
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
 * @api {get} /v1/users/admin Get All Admins
 * @apiGroup User
 * @apiName Get All Admins
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the all admin users.
 *
 * @apiSuccess success 1
 * @apiSuccess message admin objects.
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
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/admin/:limit?", function(req, res, next) {

    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var limit = req.params.limit;

            userDAO.getAdmins(currentUser, limit, function (err, findUsers) {
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
 * @api {get} /v1/users/:userId Get User By Id
 * @apiGroup User
 * @apiName Get User By Id
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the user data by userId
 * @apiExample Example request
 *  userId : 5416f4647fd9bfec17c6253d
 *
 * @apiSuccess success 1
 * @apiSuccess message user data object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "_id":"54133e8fd361774c1696f265",
 *          "firstName":"test",
 *          "lastName":"testov",
 *          "email":"test@example.com",
 *          "emailUser":"test",
 *          "emailDomain":"example.com",
 *          "__v":1,
 *          "accessibleTags":[],
 *          "accounts":[],
 *          "children":[],
 *          "parents":[],
 *          "profilePictureUrl":"/components/company-panel/assets/img/mm-picture.png",
 *          "sfdcContactId":null,
 *          "defaultApp":null,
 *          "apps":[],
 *          "previousEditedDashboardId":"54244c408352a9701b73297d",
 *          "lastEditedDashboardId":"54244c408352a9701b73297d",
 *          "previousEditedPresentation":"5413af68b1c838ea73500109",
 *          "lastEditedPresentation":"5422debd68f461c84a8eb76f",
 *          "role":"BP",
 *          "enphaseUserId":"4d7a59344d446b790a",
 *          "socialToken":null,
 *          "phone":null,
 *          "middleName":"",
 *          "name":"test testov",
 *          "sfdcContactURL":null,
 *          "id":"54133e8fd361774c1696f265"
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:userId", function(req, res, next) {

    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var userId = req.params.userId;
            console.log("userId.................");
            console.log(userId);

            userDAO.getUserByIdWithoutPopulatedData(userId, function (err, findUsers) {
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
 * @api {get} /v1/users?searchKey=:searchKey&limit=:limit Search Users
 * @apiGroup User
 * @apiName Search Users
 * @apiVersion 1.0.0
 * @apiDescription Retrieves the users that have the searchKey in Name.
 * @apiExample Example request
 *  searchKey : Emmanuel
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

            userDAO.getUsersByName(currentUser, searchKey, limit, function (err, findUsers) {
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
 * @api {delete} /v1/users/:deleteUserId Delete User
 * @apiGroup User
 * @apiName Delete User
 * @apiVersion 1.0.0
 * @apiDescription Delete user by user Id.
 * @apiExample
    deleteUserId : 5416f3fae40151081cefb60e
 *
 * @apiSuccess success 1
 * @apiSuccess message Success code
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:deleteUserId", function(req, res, next) {

    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            var deleteUserId = req.params.deleteUserId;

            userDAO.deleteUserById(currentUser, deleteUserId, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(result, res, next);
                }
            });
        }
    });
});

 /**
 * @api {post} /v1/users/:userId/tags Add User Accessible Tag
 * @apiGroup User
 * @apiName Add Accessible Tag
 * @apiVersion 1.0.0
 * @apiDescription Add accessible tag to user.
 * @apiParam {Object} accessibleTag Accessible tag data
 * @apiExample Example request
 *  userId : 5416f4647fd9bfec17c6253d
 *  accessibleTag
 *  {
 *      "id" : "543824bf7174d62c1acad51b",
 *      "tagType" : "DataLogger"
 *  }
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated user data object
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message":{
 *          "_id" : "54135ec74f09ccc06d5be3d6",
 *          "firstName" : "Adam",
 *          "lastName" : "Admin",
 *          "email" : "adam@brightergy.com",
 *          "emailUser" : "adam",
 *          "emailDomain" : "brightergy.com",
 *          "accounts" : ["54135e074f09ccc06d5be3d2"],
 *          "profilePictureUrl" : null,
 *          "sfdcContactId" : "003L000000OUS4VIAX",
 *          "defaultApp" : "DataSense",
 *          "apps" : ["Present"],
 *          "previousPasswords" : [],
 *          "previousEditedPresentation" : null,
 *          "lastEditedPresentation" : null,
 *          "role" : "Admin",
 *          "enphaseUserId" : null,
 *          "socialToken" : null,
 *          "password" : null,
 *          "phone" : "1-816-866-0555",
 *          "middleName" : "",
 *          "__v" : 17,
 *          "accessibleTags" : [{
 *              "id" : "543824bd7174d62c1acad50f",
 *              "tagType" : "Facility"
 *          },
 *          {
 *              "id" : "543824bf7174d62c1acad51d",
 *              "tagType" : "Facility"
 *          }]
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/:userId/tags", function(req, res, next) {
    var userId = req.params.userId;
    var tagObj = req.body.accessibleTag;

    checkAuth(req, res, next, function (findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            userDAO.getUserById(userId, function (findErr, foundUser) {
                if (findErr) {
                    return next(findErr);
                } else {
                    userDAO.addTag(currentUser, foundUser, tagObj, function (error, savedUser) {
                        if (error) {
                            return next(error);
                        } else {
                            return utils.successResponse(savedUser, res, next);
                        }
                    });
                }
            });
        }
    });
});

 /**
 * @api {put} /v1/users/:userId/tags Update User Accessible Tags
 * @apiGroup Tags
 * @apiName Update User Tags
 * @apiVersion 1.0.0
 * @apiDescription Add/Update accessible tags to user.
 * @apiParam {Object} accessibleTags tagBind data
 * @apiExample Example request
 *  accessibleTags
 * [{
 *      "id" : "5463d8f82fae661700f2896d",
 *      "tagType" : "Facility"
 * }]
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated user object
 * @apiSuccessExample Success example
 * {
 *      "success":1,
 *      "message":{
 *          "_id" : ObjectId("54135ec74f09ccc06d5be3d6"),
 *          "firstName" : "Adam",
 *          "lastName" : "Admin",
 *          "email" : "adam@brightergy.com",
 *          "emailUser" : "adam",
 *          "emailDomain" : "brightergy.com",
 *          "accounts" : [ 
 *              ObjectId("54135e074f09ccc06d5be3d2")
 *          ],
 *          "profilePictureUrl" : null,
 *          "sfdcContactId" : "003C000001lrjGy",
 *          "defaultApp" : "DataSense",
 *          "apps" : [ 
 *              "Present"
 *          ],
 *          "previousPasswords" : [],
 *          "previousEditedPresentation" : null,
 *          "lastEditedPresentation" : null,
 *          "role" : "Admin",
 *          "enphaseUserId" : null,
 *          "socialToken" : null,
 *          "password" : null,
 *          "phone" : "1-816-866-0555",
 *          "middleName" : "",
 *          "__v" : 18,
 *          "accessibleTags" : [
 *              {
 *                  "id" : ObjectId("542f76af2946473bc194b64e"),
 *                  "tagType" : "Facility"
 *              },
 *              {
 *                  "id" : ObjectId("542f76b32946473bc194b65c"),
 *                  "tagType" : "Facility"
 *              },
 *              {
 *                  "id" : ObjectId("543824bf7174d62c1acad51b"),
 *                  "tagType" : "DataLogger"
 *              }
 *          ]
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.put("/:userId/tags", function(req, res, next) {
    var userId = req.params.userId;
    var accessibleTags = req.body.accessibleTags;

    checkAuth(req, res, next, function (findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            userDAO.getUserById(userId, function (findErr, foundUser) {
                if (findErr) {
                    return next(findErr);
                } else {
                    if(foundUser.accessibleTags && foundUser.accessibleTags.length > 0) {
                        userDAO.removeTagsAll(currentUser, foundUser, function (error, removedUser) {
                            if (error) {
                                return next(error);
                            } else {
                                userDAO.addTags(currentUser, removedUser, accessibleTags, function (error, savedUser) {
                                    if (error) {
                                        return next(error);
                                    } else {
                                        return utils.successResponse(savedUser, res, next);
                                    }
                                });   
                            }
                        });    
                    }
                    else {
                        userDAO.addTags(currentUser, foundUser, accessibleTags, function (error, savedUser) {
                            if (error) {
                                return next(error);
                            } else {
                                return utils.successResponse(savedUser, res, next);
                            }
                        });
                    }
                }
            });
        }
    });
});

 /**
 * @api {get} /v1/users/:userId/tags Get User Accessible Tags
 * @apiGroup User
 * @apiName Get User Tags
 * @apiVersion 1.0.0
 * @apiDescription Get tags list of user
 * @apiExample Example request
 *  userId : 5416f4647fd9bfec17c6253d
 *
 * @apiSuccess success 1
 * @apiSuccess message Tags list
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message":[{
 *            "_id": "543824bf7174d62c1acad51d",
 *            "tagType": "Facility",
 *            "name": "Northlands Limited",
 *            "creatorRole": "BP",
 *            "creator": "54133e8fd361774c1696f265",
 *            "__v": 0,
 *            "usersWithAccess": [
 *                {
 *                    "id": "54133e8fd361774c1696f265"
 *                }
 *           ],
 *           "appEntities": [
 *               {
 *                   "id": "54244c408352a9701b73297d",
 *                   "appName": "Dashboard"
 *               }
 *           ],
 *           "children": [
 *               {
 *                   "id": "543824bf7174d62c1acad51e",
 *                   "tagType": "DataLogger"
 *               }
 *           ],
 *           "parents": [],
 *           "formula": null,
 *           "metricID": null,
 *           "metricType": null,
 *           "metric": null,
 *           "sensorTarget": null,
 *           "enphaseUserId": null,
 *           "endDate": null,
 *           "weatherStation": null,
 *           "longitude": null,
 *           "latitude": null,
 *           "webAddress": null,
 *           "interval": null,
 *           "destination": null,
 *           "accessMethod": null,
 *           "deviceID": null,
 *           "device": null,
 *           "manufacturer": null,
 *           "utilityAccounts": [
 *               "852"
 *           ],
 *           "utilityProvider": "Fuel-Powered Energy Production",
 *           "nonProfit": true,
 *           "taxID": "7451",
 *           "street": "",
 *           "state": "",
 *           "postalCode": "",
 *           "country": "",
 *           "city": "",
 *            "childTags": [
 *                {
 *                    "_id": "543824c07174d62c1acad525",
 *                    "tagType": "DataLogger",
 *                    "name": "Enphase DataLoggerII",
 *                    "creatorRole": "Admin",
 *                    "creator": "54133e8fd361774c1696f265",
 *                    "__v": 0,
 *                    "usersWithAccess": [
 *                        {
 *                            "id": "54133e8fd361774c1696f265"
 *                        }
 *                    ],
 *                    "appEntities": [
 *                        {
 *                            "id": "5429d13f89c1849502287d5d",
 *                            "appName": "Presentation"
 *                        }
 *                    ],
 *                    "children": [],
 *                    "parents": [
 *                        {
 *                            "id": "543824bf7174d62c1acad51d",
 *                            "tagType": "Facility"
 *                        }
 *                    ],
 *                    "formula": null,
 *                    "metricID": null,
 *                    "metricType": null,
 *                    "metric": null,
 *                    "sensorTarget": null,
 *                    "enphaseUserId": "4d7a59344d5445300a",
 *                    "endDate": null,
 *                    "weatherStation": "--Use NOAA--",
 *                    "longitude": -90.4724,
 *                    "latitude": 38.5763,
 *                   "webAddress": null,
 *                    "interval": "Hourly",
 *                    "destination": "Test",
 *                    "accessMethod": "Push to FTP",
 *                    "deviceID": "121006088373",
 *                    "device": "Envoy",
 *                    "manufacturer": "Enphase",
 *                    "utilityAccounts": [],
 *                    "utilityProvider": null,
 *                    "nonProfit": null,
 *                    "taxID": null,
 *                    "street": null,
 *                    "state": null,
 *                    "postalCode": null,
 *                    "country": null,
 *                    "city": null,
 *                    "childTags": []
 *                }
 *           ]
 *       },
 *       {
 *           "_id": "543824bd7174d62c1acad50f",
 *           "tagType": "Facility",
 *           "name": "Barretts Elementary",
 *           "creatorRole": "BP",
 *           "creator": "54133e8fd361774c1696f265",
 *           "__v": 0,
 *           "usersWithAccess": [
 *               {
 *                   "id": "54133e8fd361774c1696f265"
 *               },
 *               {
 *                   "id": "54135ec74f09ccc06d5be3d6"
 *               },
 *               {
 *                   "id": "5429d0ba89c1849502287d5c"
 *               }
 *           ],
 *           "appEntities": [
 *               {
 *                   "id": "5413af68b1c838ea73500109",
 *                   "appName": "Presentation"
 *               },
 *               {
 *                   "id": "54135ec74f09ccc06d5be3d6",
 *                   "appName": "User"
 *               },
 *               {
 *                   "id": "541ae4c3a90e8de146a10c05",
 *                   "appName": "Presentation"
 *               },
 *               {
 *                   "id": "5422debd68f461c84a8eb76f",
 *                   "appName": "Presentation"
 *               },
 *               {
 *                   "id": "541d389740b3129866c5dbec",
 *                   "appName": "Dashboard"
 *               },
 *               {
 *                   "id": "54244c408352a9701b73297d",
 *                   "appName": "Dashboard"
 *               },
 *               {
 *                   "id": "5413a795b1c838ea735000ff",
 *                   "appName": "Dashboard"
 *               },
 *               {
 *                   "id": "541c7ec3a90e8de146a10c14",
 *                   "appName": "Dashboard"
 *               }
 *           ],
 *           "children": [
 *               {
 *                   "id": "543824bd7174d62c1acad510",
 *                   "tagType": "DataLogger"
 *               },
 *               {
 *                   "id": "543824be7174d62c1acad517",
 *                   "tagType": "DataLogger"
 *               },
 *               {
 *                   "id": "543824bf7174d62c1acad51b",
 *                   "tagType": "DataLogger"
 *               }
 *           ],
 *           "parents": [],
 *           "formula": null,
 *           "metricID": null,
 *           "metricType": null,
 *           "metric": null,
 *           "sensorTarget": null,
 *           "enphaseUserId": null,
 *           "endDate": null,
 *           "weatherStation": null,
 *           "longitude": null,
 *           "latitude": null,
 *           "webAddress": null,
 *           "interval": null,
 *           "destination": null,
 *           "accessMethod": null,
 *           "deviceID": null,
 *           "device": null,
 *           "manufacturer": null,
 *           "utilityAccounts": [
 *               "6655"
 *           ],
 *           "utilityProvider": "Ameren",
 *           "nonProfit": true,
 *           "taxID": "78",
 *           "street": "",
 *           "state": "",
 *           "postalCode": "",
 *           "country": "",
 *           "city": "",
 *           "childTags": [
 *               {
 *                   "_id": "543824bf7174d62c1acad51b",
 *                   "tagType": "DataLogger",
 *                   "name": "Enphase DataLoggerII",
 *                   "creatorRole": "Admin",
 *                   "creator": "54133e8fd361774c1696f265",
 *                   "__v": 0,
 *                   "usersWithAccess": [
 *                       {
 *                           "id": "54133e8fd361774c1696f265"
 *                       }
 *                   ],
 *                   "appEntities": [
 *                       {
 *                           "id": "5413612ad37f4ab56f1fb175",
 *                           "appName": "Dashboard"
 *                       }
 *                   ],
 *                   "children": [],
 *                   "parents": [
 *                       {
 *                           "id": "543824bd7174d62c1acad50f",
 *                           "tagType": "Facility"
 *                       }
 *                   ],
 *                   "formula": null,
 *                   "metricID": null,
 *                   "metricType": null,
 *                   "metric": null,
 *                   "sensorTarget": null,
 *                   "enphaseUserId": "4d7a59344d5445300a",
 *                   "endDate": null,
 *                   "weatherStation": "--Use NOAA--",
 *                   "longitude": -90.4724,
 *                   "latitude": 38.5763,
 *                   "username": "tester",
 *                   "password": "123456",
 *                   "webAddress": null,
 *                   "interval": "Hourly",
 *                   "destination": "Test",
 *                   "accessMethod": "Push to FTP",
 *                   "deviceID": "121006088373",
 *                   "device": "Envoy",
 *                   "manufacturer": "Enphase",
 *                   "utilityAccounts": [],
 *                   "utilityProvider": null,
 *                   "nonProfit": null,
 *                   "taxID": null,
 *                   "street": null,
 *                   "state": null,
 *                   "postalCode": null,
 *                   "country": null,
 *                   "city": null,
 *                   "childTags": []
 *               }
 *           ]
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.get("/:userId/tags", function(req, res, next) {
    var userId = req.params.userId;
    
    checkAuth(req, res, next, function (findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            userDAO.getUserById(userId, function (findErr, foundUser) {
                if (findErr) {
                    return next(findErr);
                } else {
                    userDAO.getUserTagsFullHierarchy(foundUser, function (err, tags) {
                        if (err) {
                            return next(err);
                        } else {
                            if(tags[userId]) {
                                var result = tags[userId];
                                var scopeCryptoKey = config.get("scopeCryptoKey");
                                var i,j, pwd, decrypted;
                                for(i=0; i<result.length; i++){
                                    if(result[i].childTags.length > 0){
                                        for(j=0; j<result[i].childTags.length; j++){
                                            if(result[i].childTags[j].tagType === "Scope"){
                                                if(typeof result[i].childTags[j].password !== "undefined"){
                                                    if(result[i].childTags[j].password !== null){
                                                        pwd = result[i].childTags[j].password;
                                                        decrypted = cryptoJS.AES.decrypt(pwd, scopeCryptoKey);
                                                        decrypted = decrypted.toString(cryptoJS.enc.Utf8);
                                                        result[i].childTags[j].password = decrypted;
                                                    }
                                                 }
                                            }
                                        }
                                    }
                                }
                                tags[userId] = result;
                                return utils.successResponse(tags[userId], res, next);
                            } else {
                                var error = new Error(consts.USER_TAGS_NOT_FOUND);
                                error.status = 422;
                                return next(error);
                            }
                        }
                    });
                }
            });
        }
    });
});

 /**
 * @api {delete} /v1/users/:userId/tags/:tagId Remove User Accessible Tag
 * @apiGroup User
 * @apiName Remove Accessible Tag
 * @apiVersion 1.0.0
 * @apiDescription Remove accessible tag from user data.
 * @apiExample Example request
 *  tagId : 5458af3ffe540a120074c20a
 *  userId : 5416f4647fd9bfec17c6253d
 *
 * @apiSuccess success 1
 * @apiSuccess message Updated user data
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message":{
 *          "_id" : "54135ec74f09ccc06d5be3d6",
 *          "firstName" : "Adam",
 *          "lastName" : "Admin",
 *          "email" : "adam@brightergy.com",
 *          "emailUser" : "adam",
 *          "emailDomain" : "brightergy.com",
 *          "accounts" : ["54135e074f09ccc06d5be3d2"],
 *          "profilePictureUrl" : null,
 *          "sfdcContactId" : "003L000000OUS4VIAX",
 *          "defaultApp" : "DataSense",
 *          "apps" : ["Present"],
 *          "previousPasswords" : [],
 *          "previousEditedPresentation" : null,
 *          "lastEditedPresentation" : null,
 *          "role" : "Admin",
 *          "enphaseUserId" : null,
 *          "socialToken" : null,
 *          "password" : null,
 *          "phone" : "1-816-866-0555",
 *          "middleName" : "",
 *          "__v" : 17,
 *          "accessibleTags" : [{
 *              "id" : "543824bd7174d62c1acad50f",
 *              "tagType" : "Facility"
 *          }]
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.delete("/:userId/tags/:tagId", function(req, res, next) {
    var userId = req.params.userId;
    var tagId = req.params.tagId;

    checkAuth(req, res, next, function (findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {
            userDAO.getUserById(userId, function (findErr, foundUser) {
                if (findErr) {
                    return next(findErr);
                } else {
                    tagDAO.getTagById(tagId, currentUser, function (findTagErr, tag) {
                        if(findTagErr) {
                            return next(findTagErr);
                        } else {
                            userDAO.removeTag(currentUser, foundUser, tagId, function (error, savedUser) {
                                if (error) {
                                    return next(error);
                                } else {
                                    return utils.successResponse(savedUser, res, next);
                                }
                            });    
                        }
                    });
                    
                }
            });
        }
    });
});

 /**
 * @api {post} /v1/users/assets/userprofile Upload User Picture
 * @apiGroup User
 * @apiName Upload User Picture
 * @apiVersion 1.0.0
 * @apiDescription Upload user profile picture
 * @apiParam {File} assetsFile user profile picture data, null if picture is cropped binary data
 * @apiParam {String} hasCropped "true" if picture is cropped binary data, or null 
 * @apiParam {Binary} imageBinary set if picture is cropped binary data 
 *
 * @apiSuccess success 1
 * @apiSuccess message updated user data
 * @apiSuccessExample Success example
 * {
 *      "success": 1,
 *      "message": {
 *          "_id" : "54133e8fd361774c1696f265",
 *          "firstName" : "test",
 *          "lastName" : "testov",
 *          "email" : "test@example.com",
 *          "emailUser" : "test",
 *          "emailDomain" : "example.com",
 *          "accounts" : [],
 *          "profilePictureUrl" : "/components/company-panel/assets/img/mm-picture.png",
 *          "sfdcContactId" : null,
 *          "defaultApp" : null,
 *          "apps" : [],
 *          "previousPasswords" : [ 
 *              "$2a$10$WnFyOP/QAvsS3hvIoWOOmue5MYbUpwd0ScE5X.RmVGLzao7tdrnsS"
 *          ],
 *          "previousEditedPresentation" : "5413af68b1c838ea73500109",
 *          "lastEditedPresentation" : "5422debd68f461c84a8eb76f",
 *          "role" : "BP",
 *          "enphaseUserId" : "4d7a59344d446b790a",
 *          "socialToken" : null,
 *          "password" : "$2a$10$WnFyOP/QAvsS3hvIoWOOmue5MYbUpwd0ScE5X.RmVGLzao7tdrnsS",
 *          "phone" : null,
 *          "middleName" : "",
 *          "__v" : 1,
 *          "accessibleTags" : [],
 *          "lastEditedDashboardId" : "54244c408352a9701b73297d",
 *          "previousEditedDashboardId" : "54244c408352a9701b73297d"
 *      }
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/assets/userprofile", function(req, res, next) {
    var isBP = false;

    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if (findUserErr) {
            return next(findUserErr);
        } else {

            if (currentUser.role === "BP") {
                isBP = true;
            }

            if(currentUser.accounts.length === 0 && !isBP) {

                var error = new Error(consts.ACCOUNT_REQUIRED_FOR_UPLOADING_USER_PICTURE);
                error.status = 422;
                return next(error);
            } else {
                accountDAO.getAccountById(currentUser.accounts[0], function(findAccountErr, findAccount) {
                    if(findAccountErr && !isBP) {
                        return next(findAccountErr);
                    } else {

                        if (isBP) {
                            findAccount = {awsAssetsKeyPrefix: consts.BP_ASSET_URL};
                        }

                        if(findAccount.awsAssetsKeyPrefix) {

                            var uploadReturn = function (uploadErr, uploadedFile) {

                                if (uploadErr) {
                                    return next(uploadErr);
                                } else {
                                    currentUser.profilePictureUrl = uploadedFile.sourceCDNURL;

                                    userDAO.saveUser(currentUser, function(saveUserErr, savedUser) {
                                        if(saveUserErr) {
                                            return next(saveUserErr);
                                        } else {
                                            return utils.successResponse(savedUser, res, next);
                                        }
                                    });
                                }
                            };

                            var keyPrefix = config.get("aws:assets:userProfileAssetsKeyPrefix");
                            keyPrefix = keyPrefix + "/" + findAccount.awsAssetsKeyPrefix;

                            if(req.body.hasCropped === "true") {
                                awsAssetsUtils.uploadFileFromBase64(keyPrefix, 
                                    req.body.imageBinary, false, uploadReturn);
                            }
                            else {
                                awsAssetsUtils.uploadFile(keyPrefix, req.files.assetsFile, false, uploadReturn);
                            }
                        }
                        else {
                            var error = new Error(consts.UNKNOWN_AWS_ASSETS_KEY);
                            error.status = 422;
                            return next(error);
                        }

                    }
                });
            }
        }
    });

});

/**
 * API: Get Users by types and Apps
 *
 * @url         /users/all_users
 * @method      GET
 * @request     roles: array of user Role
 * @request     apps: array of apps
 * @request sample {roles:["Admin", "TM"], apps:["Present", "Analyze", "Classroom", "Verify", "Respond", "Utilities",
 * "Projects", "Connect"]}
 * @response    array of users
 * @description Retrieves the users with specified type and app entities. 
 * when the roles or apps are empty, it will retrieves the all.
 */

router.post("/all_users", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if(findUserErr) {
            return next(findUserErr);
        } else {
            var roles = req.body.roles;
            var apps = req.body.apps;
            var query = {};
            if (roles && roles.length > 0) {
                query.role = {$in: roles};
            }
            if (apps && apps.length > 0) {
                query.apps = {$all: apps};
            }
            userDAO.getUsersByParams(query, function (err, users) {
                if (err) {
                    return next(err);
                } else {
                    return utils.successResponse(users, res, next);
                }
            });
        }
    });
});

/**
 * @api {post} /userapi/connectbptosfdc/:userId Connect BP user to SFDC User
 * @apiGroup User
 * @apiName Connect BP user to SFDC User
 * @apiVersion 0.0.1
 * @apiDescription Connect BP user to SFDC User with the same email
 * @apiParam {String} BP user Id
 *
 * @apiSuccess success 1
 * @apiSuccess message Edited user data
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
 *      }]
 * }
 *
 * @apiError success 0
 * @apiError message Error code
 */
router.post("/connectbptosfdc/:userId", function(req, res, next) {
    checkAuth(req, res, next, function(findUserErr, currentUser) {
        if(findUserErr) {
            return next(findUserErr);
        } else {
            if(currentUser.role === consts.USER_ROLES.BP) {
                var userId = req.params.userId;
                userDAO.getUserById(userId, function (findErr, foundUser) {
                    if (findErr) {
                        return next(findErr);
                    } else {
                        sfContactUtils.connecteBPUserTOSFDC(foundUser, true, function (connectErr, result) {
                            if (connectErr) {
                                return next(connectErr);
                            } else {
                                return utils.successResponse(result, res, next);
                            }
                        });
                    }
                });
            } else {
                var error = new Error(consts.CAN_NOT_EDIT_BP);
                error.status = 422;
                return next(error);
            }
        }
    });
});

module.exports = router;