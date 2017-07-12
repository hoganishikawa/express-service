"use strict";

var mongoose = require("mongoose"),
    User = mongoose.model("user"),
    //Account = mongoose.model("account"),
    //presentationDAO = require("../../../bl-brighter-view/core/dao/presentation-dao"),
    accountDAO = require("./account-dao"),
    passwordUtils = require("../user/password-utils"),
    ObjectId = mongoose.Types.ObjectId,
    _ = require("lodash"),
    config = require("../../../config"),
    log = require("../../../libs/log")(module),
    utils = require("../../../libs/utils"),
    async = require("async"),
    consts = require("../../../libs/consts"),
    //dataSourceUtils = require("../../../libs/data-source-utils"),
    tagDAO = require("./tag-dao"),
    tagBindingUtils = require("../../../libs/tag-binding-utils"),
    sfdcContactUtils = require("../salesforce/contact-utils");

/**
 * Get User By email
 *
 * @param     String, findEmail
 * @return    Object, User object or error
 */
function getUserByEmail(findEmail, callback) {

    if(findEmail) {
        findEmail = findEmail.toLowerCase();
    }

    User.findOne({email : findEmail}, "+password +previousPasswords +tokens", function (err, findUser) {
        if(err) {
            callback(err, null);
        } else {
            if(findUser) {
                callback(null, findUser);
            } else {
                var userErr = new Error(consts.INCORRECT_EMAIL);
                userErr.status = 403;
                callback(userErr, null);
            }
        }
    });
}

/**
 * Get User By token
 *
 * @param     String, token type
 * @param     String, token
 * @return    Object, User object or error
 */
function getUserByToken(tokenType, token, callback) {
    User.findOne({"tokens.type":tokenType, "tokens.token":token}, "+password +previousPasswords +tokens",
        function (err, findUser) {
            if(err) {
                callback(err, null);
            } else {
                if(findUser) {
                    callback(null, findUser);
                } else {
                    var userErr = new Error(consts.INCORRECT_OR_EXPIRED_TOKEN);
                    userErr.status = 403;
                    callback(userErr, null);
                }
            }
        });
}

function getUserBySocialToken(socialToken, callback) {
    User.findOne({"socialToken":socialToken}, "+password +previousPasswords +tokens", function (err, findUser) {
        if(err) {
            callback(err, null);
        } else {
            if(findUser) {
                callback(null, findUser);
            } else {
                var error = new Error(consts.NOT_LINKED_SOCIAL_NETWORK);
                error.status = 422;
                callback(error, null);
            }
        }
    });
}

/**
 * Validate user model
 *
 * @param     Object, User object
 * @return    Object, OK or error
 */
function validate(userObj, callback) {
    var user = new User(userObj);
    user.validate(function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, consts.OK);
        }
    });
}

/**
 * Validate App names
 *
 * @param     Object, User object
 * @return    Array, errors array
 */
function userAppsValidator(user) {
    var errors = [];

    for(var i=0; i < user.apps.length; i++) {
        if(consts.ALLOWED_APPS.indexOf(user.apps[i]) < 0) {
            errors.push(consts.NOT_ALLOWED_APP);
            break;
        }
    }

    var uniqApps = _.uniq(user.apps);
    if(user.apps.length !== uniqApps.length) {
        errors.push(consts.NOT_UNIQUE_APPS);
    }

    return errors;
}

/**
 * Get User by Id
 *
 * @param     String, User Id
 * @return    Object, User object or error
 */
function getUserById(userId, callback) {
    User.findById(userId)
        .exec(function (err, findUser) {
            if(err) {
                callback(err, null);
            } else {
                if(findUser) {
                    callback(null, findUser);
                } else {
                    var error = new Error(consts.USER_NOT_EXISTS);
                    error.status = 422;
                    callback(error, null);
                }
            }
        });
}

/**
 * Create new User
 *
 * @param     Object, User object
 * @param     Boolean, createSFContact
 * @param     String, Account Id in salesforce
 * @param     Boolean, Status of approval in salesforce
 * @return    Object, User object or error
 */
function createUser(userObj, createSFContact, sfdcAccountId, startContactApproval, finalCallback) {
    //log.info("User Insert");

    delete userObj.password;//we will send set password email
    console.log("before USER");
    var user = new User(userObj);
    console.log("after USER");

    var errors = userAppsValidator(user);
    var error;

    if(errors.length > 0) {
        error = new Error(errors.join(", "));
        error.status = 422;
        finalCallback(error);
    } else if(user.role === consts.USER_ROLES.BP) {
        error = new Error(consts.CAN_NOT_REGISTER_BP);
        error.status = 422;
        finalCallback(error, null);
    } else if(user.accounts.length === 0) {
        error = new Error(consts.INCORRECT_ACCOUNTS_IDS);
        error.status = 422;
        finalCallback(error, null);
    } else if (createSFContact && !sfdcAccountId) {
        error = new Error(consts.UNKNOWN_SF_ACCOUNT);
        error.status = 422;
        finalCallback(error, null);
    } else {
        async.waterfall([
            function (callback) {
                if(createSFContact) {
                    if (!user.sfdcContactId) {
                        //create new SFDC Contact
                        sfdcContactUtils.createSFDCContact(user, sfdcAccountId, startContactApproval, callback);
                    } else {
                        sfdcContactUtils.checkSFContact(sfdcAccountId, user.sfdcContactId, callback);
                    }
                } else {
                    callback(null, user.sfdcContactId);
                }
            },
            function (sfdcContactId, callback) {
                user.sfdcContactId = sfdcContactId;
                passwordUtils.sendSetPasswordLink(user, callback);
            },
            function (userWithToken, callback) {
                userWithToken.save(callback);
            },
            function (savedUser, nEffected, callback) {
                tagBindingUtils.bindTags("User", savedUser._id, {"accessibleTags": savedUser.accessibleTags},
                    function (err) {
                        if (err) {
                            User.remove({_id: savedUser._id}, function (deleteErr) {
                                if (deleteErr) { utils.logError(deleteErr); }
                                callback(err);
                            });
                        } else {
                            callback(null, savedUser);
                        }
                    }
                );
            }
        ], function (err, savedUser) {
            if (err) {
                finalCallback(err, null);
            } else {
                getUserById(savedUser._id, finalCallback);
            }
        });
    }
}

/**
 * Create new BP User
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function createBP(userObj, finalCallback) {

    delete userObj.password;//we will send set password email
    var user = new User(userObj);

    var errors = userAppsValidator(user);
    var error;

    if(errors.length > 0) {
        error = new Error(errors.join(", "));
        error.status = 422;
        finalCallback(error);
    } else if(user.role !== consts.USER_ROLES.BP) {
        error = new Error(consts.REQUIRED_BP_ROLE);
        error.status = 422;
        finalCallback(error, null);
    } else {
        async.waterfall([
            function (callback) {
                passwordUtils.sendSetPasswordLink(user, callback);
            },
            function (userWithToken, callback) {
                //userWithToken.save(callback);
                //set BP account
                accountDAO.findBPAccount(function (findBPAccountErr, foundBPAccount) {
                    if(findBPAccountErr) {
                        callback(findBPAccountErr);
                    }
                    else {
                        userWithToken.accounts = [];

                        if(foundBPAccount) {
                            userWithToken.accounts.push(foundBPAccount._id.toString());
                            //savedUser.save(finalCallback);
                            callback(null, userWithToken);
                        }
                        else {
                            accountDAO.createBPAccount(function (createBPAccountErr, createdBPAccount) {
                                userWithToken.accounts.push(new ObjectId(createdBPAccount._id));
                                callback(null, userWithToken);
                            });
                        }
                    }
                });
            },
            function(userWithAccount, callback) {
                sfdcContactUtils.connecteBPUserTOSFDC(userWithAccount, false, callback);
            },
            function (userWithAccount, callback) {
                userWithAccount.save(callback);
            }
        ], function (err, savedUser) {
            if(err) {
                finalCallback(err);
            }
            else {
                getUserById(savedUser._id, finalCallback);
            }
        });
    }
}

/**
 * Add user account
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function addUserAccount(user, account, callback) {
    User.update ({_id:user._id}, { $push: {accounts : account._id.toString()} }, function (updateErr, UpdateSuccess) {
        if(updateErr) {
            callback(updateErr);
        }
        else {
            getUserById(user._id, callback);
        }
    });
}

/**
 * Save user into User model
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function saveUser(userModelInstance, callback) {
    userModelInstance.save(function (saveUserErr, savedUser) {
        if (saveUserErr) {
            callback(saveUserErr, null);
        } else {
            callback(null, savedUser);
        }
    });
}

/**
 * Update User
 *
 * @param     Object, Current User object
 * @param     Object, User object
 * @return    Object, User object or error
 */
function editUser(currentUser, userObj, userId, finalCallback) {
    log.info("Update user");

    delete userObj.children;//don"t update  relationships
    delete userObj.parents;
    var error;

    //update and validate existing
    User.findById(userId, "+password +previousPasswords +tokens", function (findErr, findUser) {
        if (findErr) {
            finalCallback(findErr, null);
        } else {
            if(!findUser) {
                error = new Error(consts.USER_NOT_EXISTS);
                error.status = 422;
                finalCallback(error, null);
            } else {

                if(findUser.role === consts.USER_ROLES.BP && currentUser && currentUser.role !== consts.USER_ROLES.BP) {
                    error = new Error(consts.CAN_NOT_EDIT_BP);
                    error.status = 403;
                    finalCallback(error, null);
                } else {
                    var paramsToChange = null;
                    var errors = null;

                    if(findUser.role === consts.USER_ROLES.BP) {

                        var isEmailChanged = userObj.email && findUser.email !== userObj.email;

                        paramsToChange = Object.keys(userObj);

                        paramsToChange.forEach(function (param) {
                            findUser[param] = userObj[param];
                        });

                        errors = userAppsValidator(findUser);

                        if(errors.length > 0) {
                            error = new Error(errors.join(", "));
                            error.status = 422;
                            finalCallback(error);
                        } else {
                            findUser.accounts = [];

                            async.waterfall([
                                function(callback) {
                                    if(isEmailChanged) {
                                        sfdcContactUtils.connecteBPUserTOSFDC(findUser, false, callback);
                                    } else {
                                        callback(null, findUser);
                                    }
                                },
                                function (userToSave, callback) {
                                    saveUser(userToSave, callback);
                                },
                                function (savedUser, callback) {
                                    //set BP account
                                    accountDAO.findBPAccount(function (findBPAccountErr, foundBPAccount) {
                                        if(findBPAccountErr) {
                                            callback(findBPAccountErr);
                                        }
                                        else {
                                            savedUser.accounts = [];

                                            if(foundBPAccount) {
                                                callback(null, savedUser, foundBPAccount);
                                            }
                                            else {
                                                accountDAO.createBPAccount(
                                                    function (createBPAccountErr, createdBPAccount) {
                                                        callback(null, savedUser, createdBPAccount);
                                                    });
                                            }
                                        }
                                    });
                                },
                                function (BPUser, BPAccount, callback) {
                                    addUserAccount(BPUser, BPAccount, callback);
                                }
                            ], function (err, userWithAccount) {
                                if(err) {
                                    finalCallback(err);
                                }
                                else {
                                    finalCallback(null, userWithAccount);
                                }
                            });
                        }
                    }
                    else {
                        var newApps = userObj.apps;
                        var oldApps = findUser.apps;

                        paramsToChange = Object.keys(userObj);

                        paramsToChange.forEach(function (param) {
                            findUser[param] = userObj[param];
                        });

                        var diff1Length = _.difference(newApps, oldApps).length;
                        var diff2Length = _.difference(oldApps, newApps).length;

                        if(currentUser.role === consts.USER_ROLES.TM && (diff1Length > 0 || diff2Length > 0) ) {
                            error = new Error(consts.CAN_NOT_EDIT_ACCESSIBLE_APPLICATIONS);
                            error.status = 422;
                            finalCallback(error, null);
                        } else {

                            errors = userAppsValidator(findUser);

                            if(errors.length > 0) {
                                error = new Error(errors.join(", "));
                                error.status = 422;
                                finalCallback(error);
                            } else {
                                saveUser(findUser, function (saveErr, savedUser) {
                                    if (saveErr) {
                                        finalCallback(saveErr, null);
                                    } else {
                                        getUserById(savedUser._id, finalCallback);
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });
}

/**
 * Add user account
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function addUserAccount(user, account, callback) {
    User.update ({_id:user._id}, { $push: {accounts : account._id.toString()} }, function (updateErr, UpdateSuccess) {
        if(updateErr) {
            callback(updateErr);
        }
        else {
            getUserById(user._id, callback);
        }
    });
}

/**
 * Save user into User model
 *
 * @param     Object, User object
 * @return    Object, User object or error
 */
function saveUser(userModelInstance, callback) {
    userModelInstance.save(function (saveUserErr, savedUser) {
        if (saveUserErr) {
            callback(saveUserErr, null);
        } else {
            callback(null, savedUser);
        }
    });
}

/**
 * Get User by Id
 *
 * @param     String, User Id
 * @return    Object, User object or error
 */
function getUserById(userId, callback) {
    User.findById(userId)
        .exec(function (err, findUser) {
            if(err) {
                callback(err, null);
            } else {
                if(findUser) {
                    callback(null, findUser);
                } else {
                    var error = new Error(consts.USER_NOT_EXISTS);
                    error.status = 422;
                    callback(error, null);
                }
            }
        });
}

/**
 * Get User by Id without populated data
 *
 * @param     String, User Id
 * @return    Object, User object or error
 */
function getUserByIdWithoutPopulatedData(userId, callback) {
    User.findById(userId)
        .exec(function (err, findUser) {
            if(err) {
                callback(err, null);
            } else {
                if(findUser) {
                    callback(null, findUser);
                } else {
                    var error = new Error(consts.USER_NOT_EXISTS);
                    error.status = 422;
                    callback(error, null);
                }
            }
        });
}

/**
 * Delete User by Id
 *
 * @param     Object, current user object
 * @param     String, User Id
 * @return    Object, User object or error
 */
function deleteUserById(currentUser, userId, callback) {

    var error;
    if(currentUser.role === consts.USER_ROLES.TM) {
        error = new Error(consts.CAN_NOT_DELETE_USERS);
        error.status = 422;
        return callback(error, null);
    } else {

        getUserById(userId, function (findErr, findUser) {
            if (findErr) {
                callback(null, findErr);
            } else {
                if (findUser._id === userId) {
                    error = new Error(consts.CAN_NOT_DELETE_YOURSELF);
                    error.status = 422;
                    callback(error, null);
                } else if (findUser.role === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP) {
                    error = new Error(consts.CAN_NOT_DELETE_BP);
                    error.status = 422;
                    callback(error, null);
                } else {
                    if(findUser.accessibleTags && findUser.accessibleTags.length>0) {
                        tagBindingUtils.unbindTags("User", findUser._id.toString(), findUser.accessibleTags,
                            function(err, result) {
                                if(err) {
                                    callback(err);
                                } else {
                                    User.remove({_id: findUser._id}, function (deleteErr) {
                                        if (deleteErr) {
                                            callback(deleteErr, null);
                                        } else {
                                            callback(null, consts.OK);
                                        }
                                    });
                                }
                            });
                    }
                    else {
                        User.remove({_id: findUser._id}, function (deleteErr) {
                            if (deleteErr) {
                                callback(deleteErr, null);
                            } else {
                                callback(null, consts.OK);
                            }
                        });
                    }
                }
            }
        });
    }
}

/**
 * Find Users by name
 *
 * @param     Object, current user object
 * @param     String, search text
 * @param     Int, limit of result rows
 * @return    Array, users array
 */
function getUsersByName(currentUser, findNameMask, limit, callback) {
    var params = {};

    if(findNameMask) {
        //params.name = new RegExp(findNameMask, "i");
        params.$or =  [
            { firstName: new RegExp(findNameMask, "i") },
            { middleName: new RegExp(findNameMask, "i") },
            { lastName: new RegExp(findNameMask, "i") }
        ];
    }

    if(currentUser.role !== consts.USER_ROLES.BP) {

        //var userSensors = currentUser.sensors;
        params.accounts = { $in: currentUser.accounts};
    }

    var q = User.find(params);

    if(limit) {
        q.limit(limit);
    }

    q.exec(function(findErr, findUsers) {
        if(findErr) {
            callback(findErr, null);
        } else {
            callback(null, findUsers);
        }
    });
}

/**
 * Get Admins all
 *
 * @param     Int, limit of result rows
 * @return    Array, array of admin users
 */
function getAdmins(user, limit, callback) {
    var params = null;

    if(user.role === consts.USER_ROLES.BP) {
        params = {role: consts.USER_ROLES.Admin};
    } else {
        params= {$and: [
            {role: consts.USER_ROLES.Admin},
            {
                accounts: { $in: user.accounts}
            }
        ]};
    }

    var q = User.find(params);

    if(limit) {
        q.limit(limit);
    }

    q.exec(function(findErr, findUsers) {
        if(findErr) {
            callback(findErr, null);
        } else {
            callback(null, findUsers);
        }
    });
}

/**
 * Find Users by params
 *
 * @param     Object, search param
 * @return    Array, users array
 */
function getUsersByParams(params, callback) {
    User.find(params)
        .exec(function (err, findUsers) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, findUsers);
            }
        });
}

function delUser(user, cb) {
    User.remove({_id: user._id}, function (deleteErr) {
        if (deleteErr) {
            deleteErr.user = user;
            utils.logError(deleteErr);
        }
        //process deleting for other users, send null error
        cb(null, consts.OK);
    });
}

/**
 * Delete multiple users with matched account Id
 *
 * @param     {array} accountIds
 * @param     {function} finalCallback
 * @return    void
 */
function deleteUsersByAccountId(accountIds, finalCallback) {

    getUsersByParams({accounts: { $in: accountIds}}, function(findUserErr, foundUsers) {

        if(findUserErr) {
            finalCallback(findUserErr);
        } else if(foundUsers.length > 0) {

            //unbind tags for each user
            async.each(foundUsers, function(user, cb) {

                if (user.accessibleTags && user.accessibleTags.length > 0) {
                    tagBindingUtils.unbindTags("User", user._id.toString(), user.accessibleTags,
                        function (unbindTagsErr, result) {
                            if (unbindTagsErr) {
                                unbindTagsErr.user = user;
                                utils.logError(unbindTagsErr);
                                cb(null, consts.OK);//process deleting for other users, send null error
                            } else {
                                delUser(user, cb);
                            }
                        });
                }
                else {
                    delUser(user, cb);
                }
            }, function(deleteAllUsersErr) {
                if(deleteAllUsersErr) {
                    finalCallback(deleteAllUsersErr);
                } else {
                    finalCallback(null, consts.OK);
                }
            });
        } else {
            finalCallback(null, consts.OK);
        }
    });
}

/**
 * Get apps of current user
 *
 * @param     Object, current user object
 * @return    Array, apps array
 */
function getApplications(currentUser, callback) {
    var allapps = config.get("apps");
    if(currentUser.role === consts.USER_ROLES.BP) {
        callback(null, allapps);
    } else {
        var userapps = currentUser.apps;
        for(var appName in allapps) {
            if(userapps.indexOf(appName) < 0) {
                delete allapps[appName];
            }
        }

        callback(null, allapps);
    }
}

/**
 * Add Tag to User sc>>>>>>> 0c89c3e1291e7ea0e3b387531839f0d259f4f5b5
 ma and userWithAccess to Tag schema
 *
 * @param     Object, current user object
 * @param     Object, User object
 * @param     Object, Tag object
 * @return    Object, User object or error
 */
function addTag(currentUser, foundUser, tag, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.CAN_NOT_CREATE_TAG);
        error.status = 422;
        callback(error, null);
    }

    if (utils.childExistsInParent(tag, foundUser.accessibleTags)) {
        callback(null, consts.OK);
    } else {
        if (!foundUser.accessibleTags) {
            foundUser.accessibleTags = [];
        }
        foundUser.accessibleTags.push(tag);
        async.parallel([
                function(cb) {
                    tagBindingUtils.bindTags("User", foundUser._id,
                        {"accessibleTags": {"id": tag.id, "tagType": tag.tagType}}, cb);
                },
                function(cb) {
                    saveUser(foundUser, cb);
                }
            ],
            function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results[1]);
                }
            });
    }
}

/**
 * Add Tags to User schema and userWithAccess to Tag schema into empty accessibleTags
 *
 * @param     Object, current user object
 * @param     Object, User object
 * @param     Object, Tag object
 * @return    Object, User object or error
 */
function addTags(currentUser, foundUser, tags, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.CAN_NOT_CREATE_TAG);
        error.status = 422;
        callback(error, null);
    }

    foundUser.accessibleTags = tags;

    async.parallel([
        function(cb) {
            tagBindingUtils.bindTags("User", foundUser._id, {"accessibleTags": tags}, cb);
        },
        function(cb) {
            saveUser(foundUser, cb);
        }
    ],
    function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results[1]);
        }
    });
}

/**
 * Remove Tag from User Schema and userWithAccess from Tag Schema
 *
 * @param     Object, current user object
 * @param     Object, User object
 * @param     String, Tag Id
 * @return    Object, User object or error
 */
function removeTag(currentUser, foundUser, tagId, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.CAN_NOT_DELETE_TAG);
        error.status = 422;
        callback(error, null);
    }

    var i = 0;
    foundUser.accessibleTags.forEach(function (iteratorObj) {
        if (iteratorObj.id.toString() === tagId.toString()) {
            foundUser.accessibleTags.splice(i, 1);
        }
        i++;
    });
    async.parallel([
            function (cb) {
                tagBindingUtils.unbindTags("User", foundUser._id, [
                    {"id": tagId}
                ], cb);
            },
            function (cb) {
                saveUser(foundUser, cb);
            }
        ],
        function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results[1]);
            }
        });
}

/**
 * Remove Tags All from User Schema and userWithAccess from Tag Schema
 *
 * @param     Object, current user object
 * @param     Object, User object
 * @return    Object, User object or error
 */
function removeTagsAll(currentUser, foundUser, callback) {
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.CAN_NOT_DELETE_TAG);
        error.status = 422;
        callback(error, null);
    }

    var accessibleTags = foundUser.accessibleTags;

    async.parallel([
        function (cb) {
            tagBindingUtils.unbindTags("User", foundUser._id, accessibleTags, cb);
        },
        function (cb) {
            saveUser(foundUser, cb);
        }
    ],
    function (err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results[1]);
        }
    });
}

/**
 * Remove Tag from Users and userWithAccess from Tag Schema
 *
 * @param     Object, Tag object
 * @param     Array, array of user Id
 * @return    Array, array of user object or error
 */
function removeTagFromAllUsersWithAccess(tagObject, userIdsArray, finalCallback) {
    async.each(userIdsArray, function(userId, callback) {
        User.update(
            {_id: new ObjectId(userId)},
            {$pull: {accessibleTags: tagObject}}).exec(callback);
    }, function(updateError, updateResult) {
        if (updateError) {
            finalCallback(updateError, null);
        } else {
            finalCallback(null, updateResult);
        }
    });
}

/**
 * Get Tags of User with full hierarchy
 *
 * @param     Object, User object
 * @return    Array, array of tags object with full hierarchy
 */
function getUserTagsFullHierarchy(findUser, finalCallback) {
    if(findUser.role === consts.USER_ROLES.BP) {
        tagDAO.getAllTagsFullHierarchy(function (tagsErr, tagsTreeArray) {
            if(tagsErr) {
                finalCallback(tagsErr);
            }
            else {
                var thisTags = {};
                thisTags[findUser._id.toString()] = tagsTreeArray;
                finalCallback(null, thisTags);
            }
        });
    } else {
        if(findUser.accessibleTags && findUser.accessibleTags.length>0) {
            var entityIds = [findUser._id.toString()];
            tagDAO.getTagsFullHierarchyByEntityIds(consts.USER_WITH_ACCESS_TYPE.USER, entityIds, null, null,
                function (tagsErr, tagsFullHierarchy) {
                    if(tagsErr) {
                        finalCallback(tagsErr);
                    }
                    else {
                        finalCallback(null, tagsFullHierarchy);
                    }
                });
        }
        else {
            var thisTags = {};
            thisTags[findUser._id.toString()] = [];
            finalCallback(null, thisTags);
        }
    }
}

function findSolarNodesByFacility(tag, parentTagName, parentTagTZ,
                                  timezoneOffsets, facilitiesStorage, scopeObj, geoObject) {

    if (tag.latitude && tag.longitude) {

        if(!geoObject.latitude || !geoObject.longitude) {
            geoObject.latitude = tag.latitude;
            geoObject.longitude = tag.longitude;
        }

        facilitiesStorage.latitude = tag.latitude;
        facilitiesStorage.longitude = tag.longitude;
    }

    if (tag.city && !geoObject.city) {
        geoObject.city = tag.city;
    }

    if (tag.timezone && !geoObject.timeZone) {
        geoObject.timeZone = tag.timezone;
        geoObject.zoneOffset = utils.getOffsetByTimeZone(geoObject.timeZone);
        log.silly("timezone = " + geoObject.timeZone +
            ", zoneOffest = " + geoObject.zoneOffset);
    }

    var i=0;

    if(tag.tagType === consts.TAG_TYPE.Scope) {
        scopeObj = {
            id: tag._id.toString(),
            name: tag.name,
            displayName: tag.displayName,
            potentialPower: 0,
            nodes: []
        };

        if(tag.childTags) {
            for (i = 0; i < tag.childTags.length; i++) {
                findSolarNodesByFacility(tag.childTags[i], tag.name, tag.timezone,
                    timezoneOffsets, facilitiesStorage, scopeObj, geoObject);
            }

            if(scopeObj.nodes.length > 0) {
                facilitiesStorage.scopes.push(scopeObj);
            }
        }
    } else if(tag.tagType === consts.TAG_TYPE.Node && tag.nodeType === consts.NODE_TYPE.Solar) {
        var nodeObj = {
            id: tag._id.toString(),
            displayName: tag.displayName,
            scopeName: parentTagName,
            nodeId: tag.deviceID,
            rate: 0,
            deviceOffset: timezoneOffsets[parentTagTZ] ? timezoneOffsets[parentTagTZ]: null,
            powerMetricId: null
        };

        if(tag.potentialPower) {
            facilitiesStorage.potentialPower += tag.potentialPower;
            scopeObj.potentialPower += tag.potentialPower;
        }

        facilitiesStorage.nodesCount++;

        for(i=0; i < tag.childTags.length; i++) {

            if(nodeObj.rate && nodeObj.powerMetricId) {
                break;
            }

            if(tag.childTags[i].tagType === consts.TAG_TYPE.Metric &&
                tag.childTags[i].name === consts.METRIC_NAMES.Reimbursement) {
                nodeObj.rate = tag.childTags[i].rate;
            }

            if(tag.childTags[i].tagType === consts.TAG_TYPE.Metric &&
                tag.childTags[i].name === consts.METRIC_NAMES.kW) {
                nodeObj.powerMetricId = tag.childTags[i].metricID;
            }
        }

        scopeObj.nodes.push(nodeObj);

    } else if(tag.childTags) {
        for (i = 0; i < tag.childTags.length; i++) {
            findSolarNodesByFacility(tag.childTags[i], tag.name, tag.timezone,
                timezoneOffsets, facilitiesStorage, scopeObj, geoObject);
        }
    }
}

function getUserSolarTags(user, finalCallback) {
    getUserTagsFullHierarchy(user, function(err, foundTags) {

        if(err) {
            finalCallback(err);
        } else {
            var facilities = [];
            var tags = foundTags[user._id.toString()];
            var i=0;

            var timezoneOffsets = {};
            for (i = 0; i < consts.TIME_ZONES.length; i++) {
                timezoneOffsets[consts.TIME_ZONES[i].name] = consts.TIME_ZONES[i].offset;
            }

            for(i=0; i < tags.length; i++) {
                if(tags[i].tagType === consts.TAG_TYPE.Facility) {
                    var obj = {
                        id: tags[i]._id.toString(),
                        name: tags[i].name,
                        displayName: tags[i].displayName,
                        scopes: [],
                        potentialPower: 0,
                        address: tags[i].address,
                        // do we need them now?
                        latitude: null,
                        longitude: null,
                        geo: {},
                        selected: true,
                        nodesCount: 0
                    };
                    var geoObject = obj.geo;

                    findSolarNodesByFacility(tags[i], tags[i].name, tags[i].timezone,
                        timezoneOffsets, obj, null, geoObject);

                    if(obj.scopes.length > 0) {
                        //facility has solar nodes
                        facilities.push(obj);
                    }
                }
            }

            var maxSelected = 3;
            var currentlySelected =0;
            var maxNodes = 3;

            if (facilities.length > maxSelected) {
                //if more than 5 facilities, first 5 will be selected by default
                for(i=0; i < facilities.length; i++) {

                    if(currentlySelected < maxSelected && facilities[i].nodesCount <= maxNodes) {
                        currentlySelected++;
                        facilities[i].selected = true;
                    } else {
                        facilities[i].selected = false;
                    }
                }
            }

            var result = {
                facilities: facilities
            };

            // the geo object will be the object of first selected facility
            var firstGeoObject = _.chain(facilities).
                filter("selected").
                filter("geo").
                first().
                value();

            if(firstGeoObject) {
                result.geo = firstGeoObject.geo;
            } else {
                result.geo = {};
            }
            log.debug("geo = " + JSON.stringify(result.geo));

            finalCallback(null, result);
        }
    });
}

/**
 * Get Tags of User with full hierarchy
 *
 * @param     Object, User object
 * @return    Array, array of tags object with full hierarchy
 */
function addTagToAccessibleArray(findUser, tagObject, finalCallback){
    User.update({_id: new ObjectId(findUser._id.toString())},
        {$push: {accessibleTags: tagObject}})
        .exec(function (err, updatedUser) {
            if (err) {
                finalCallback(err, null);
            } else {
                finalCallback(null, updatedUser);
            }
        });
}
// -------------------------------------------------------------------------------------

function setCorrectSFDCIdByLead(leadId, contactId, callback) {
    var sfLeadId = "Lead" + leadId;
    getUsersByParams({
        $or: [
            {sfdcContactId: leadId},
            {sfdcContactId: sfLeadId}
        ]
    }, function(err, foundUsers) {
        if(err) {
            callback(err);
        } else if(foundUsers.length > 0) {
            foundUsers[0].sfdcContactId = contactId;
            foundUsers[0].save(callback);
        } else {
            callback(null);
        }

    });
}

function getUserBySessionId(sessionId, callback) {
    var sessionsCollection = mongoose.connection.db.collection("sessions");

    async.waterfall([
        function(cb) {
            sessionsCollection.findOne({_id:sessionId}, cb);
        }, function(foundSession, cb) {
            if(!foundSession) {
                var incorrectSessionErr = new Error(consts.INCORRECT_SESSION);
                incorrectSessionErr.status = 403;
                cb(incorrectSessionErr, null);
            } else {
                var sessionField = JSON.parse(foundSession.session);
                var userId = sessionField.userId;
                cb(null, userId);
            }
        }, function(userId, cb) {
            getUserById(userId, cb);
        }
    ], function (err, user) {
        if(err) {
            callback(err);
        } else {
            callback(null, user);
        }
    });
}

exports.createBP = createBP;
exports.getUsersByParams = getUsersByParams;
exports.deleteUserById = deleteUserById;
exports.getAdmins = getAdmins;
exports.validate = validate;
exports.getUserByToken = getUserByToken;
exports.getUserBySocialToken = getUserBySocialToken;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.getUsersByName = getUsersByName;
exports.editUser = editUser;
exports.saveUser = saveUser;
exports.createUser = createUser;
exports.getApplications = getApplications;
exports.getUserByIdWithoutPopulatedData = getUserByIdWithoutPopulatedData;
exports.addTag = addTag;
exports.addTags = addTags;
exports.removeTag = removeTag;
exports.removeTagsAll = removeTagsAll;
exports.removeTagFromAllUsersWithAccess = removeTagFromAllUsersWithAccess;
exports.getUserTagsFullHierarchy = getUserTagsFullHierarchy;
exports.addTagToAccessibleArray = addTagToAccessibleArray;
exports.addUserAccount = addUserAccount;
exports.deleteUsersByAccountId = deleteUsersByAccountId;
exports.setCorrectSFDCIdByLead = setCorrectSFDCIdByLead;
exports.getUserBySessionId = getUserBySessionId;
exports.getUserSolarTags = getUserSolarTags;
exports.findSolarNodesByFacility = findSolarNodesByFacility;
