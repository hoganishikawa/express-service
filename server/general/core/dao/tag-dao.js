"use strict";

var mongoose = require("mongoose"),
    Tag = mongoose.model("tag"),
//DataSource = mongoose.model("datasource"),
    async = require("async"),
    _ = require("lodash"),
    ObjectId = mongoose.Types.ObjectId,
    utils = require("../../../libs/utils"),
    tagBindingUtils = require("../../../libs/tag-binding-utils"),
//dashboardDAO = require("../../../bl-data-sense/core/dao/dashboard-dao"),
//presentationDAO = require("../../../bl-brighter-view/core/dao/presentation-dao"),
    userDAO = require("./user-dao"),
//log = require("../../../libs/log")(module),
    consts = require("../../../libs/consts"),
    tagRuleDAO = require("./tag-rule-dao"),
    timezoneDAO = require("./timezone-dao"),
    moment = require("moment"),
    nodeUtil = require("util");

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getTagById(selectedTagId, callback) {
    Tag.findById(selectedTagId, function (err, foundTag) {
        if (err) {
            callback(err, null);
        } else {
            if (foundTag) {
                callback(null, foundTag);
            } else {
                var error = new Error(consts.TAG_DOES_NOT_EXIST + selectedTagId);
                error.status = 422;
                callback(error, null);
            }
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function editTag(tagId, tagObj, currentUser, callback) {
    delete tagObj._id;
    //delete dataSourceObj.tags;
    var error;

    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.CAN_NOT_EDIT_TAG);
        error.status = 422;
        callback(error, null);
    } else {
        getTagById(tagId, function (findErr, foundTag) {
            if (findErr) {
                callback(findErr, null);
            } else {
                if (foundTag.creatorRole === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP) {
                    error = new Error(consts.ONLY_BP_CAN_SAVE_TAG);
                    error.status = 422;
                    callback(error, null);
                } else {

                    var paramsToChange = Object.keys(tagObj);

                    paramsToChange.forEach(function (param) {
                        foundTag[param] = tagObj[param];
                    });

                    foundTag.save(function (saveErr, savedTag) {
                        if (saveErr) {
                            callback(saveErr, null);
                        } else {
                            callback(null, savedTag);
                        }
                    });
                }
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function isAllowedTagTypeRelationship(childType, parentType, finalCallback) {
    async.waterfall([
        function (callback) {
            tagRuleDAO.getRules(callback);
        },
        function (tagRules, callback) {
            var childrenTagRules = _.filter(tagRules, function (tagRule) {
                return tagRule.tagType  === childType;
            });
            var parentTagRules = _.filter(tagRules, function (tagRule) {
                return tagRule.tagType  === parentType;
            });

            if(childrenTagRules.length > 0) {
                var allowedParentTagTypes = _.map(childrenTagRules[0].allowedParentTagTypes, function (allowedTag) {
                    return allowedTag.toLowerCase();
                });
                if (allowedParentTagTypes.indexOf(parentType.toLowerCase()) <= -1) {
                    callback(null, false);
                }
            }
            if(parentTagRules.length > 0) {
                var allowedChildrenTagTypes = _.map(parentTagRules[0].allowedChildrenTagTypes, function (allowedTag) {
                    return allowedTag.toLowerCase();
                });
                if (allowedChildrenTagTypes.indexOf(childType.toLowerCase()) <= -1) {
                    callback(null, false);
                }
            }
            callback(null, true);
        }
    ], function(error, result) {
        if (error) {
            finalCallback(error, null);
        }
        else {
            finalCallback(null, result);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function isValidTagType(tagType) {
    return consts.TAG_TYPES.indexOf(tagType) >= 0;
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function createTag(tagObj,  currentUser, finalCallback) {
    delete tagObj._id;
    //delete dataSourceObj.tags;
    console.log(tagObj);

    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        var error = new Error(consts.CAN_NOT_CREATE_TAG);
        error.status = 422;
        finalCallback(error, null);
    } else {
        // Making sure the tag to be created has a valid tagType
        if ((!tagObj.tagType) || (!isValidTagType(tagObj.tagType))) {
            finalCallback(consts.INVALID_TAG_TYPE, null);
            return;
        }

        var parentType = null;

        // Checking the tagObj"s parent tagType
        if (!tagObj.parents || tagObj.parents.length < 1) {
            parentType = consts.NO_PARENT_TAG_TYPE;
        } else {
            parentType = tagObj.parents[0].tagType;
        }

        async.waterfall([
            function (callback) {
                isAllowedTagTypeRelationship(tagObj.tagType, parentType, callback);
            },
            function (isAllowedTagTypeRelationship, callback) {
                if (!isAllowedTagTypeRelationship) {
                    callback(consts.NOT_ALLOWED_TAG_TYPES_RELATIONSHIP, null);
                }
                callback(null, isAllowedTagTypeRelationship);
            },
            function (isAllowedTagTypeRelationship, callback) {
                tagObj.creatorRole = currentUser.role;
                tagObj.creator = currentUser._id;
                tagObj.usersWithAccess = [];

                if(currentUser.role !== consts.USER_ROLES.BP) {
                    tagObj.usersWithAccess.push({id: currentUser._id.toString()});
                }

                var thisTagObjModel = new Tag(tagObj);
                thisTagObjModel.save(function(err, savedTag) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(null,savedTag);
                    }
                });
            },
            function (savedTag, callback) {
                async.parallel([
                    function (updatesCallback) {
                        if (savedTag.parents.length > 0) {
                            // Currently, tags can have only 1 parent.
                            // Therefore we can just access index 0 of parents array
                            getTagById(savedTag.parents[0].id, function (findErr, foundParentTag) {
                                if (findErr) {
                                    // There is a parent tag, yet getting it by its Id failed
                                    updatesCallback(findErr, null);
                                } else {
                                    var parentObj = foundParentTag;
                                    var childObj = {tagType: savedTag.tagType, id: savedTag._id.toString()};

                                    // Taking care of the 2-way binding
                                    parentObj.children.push(childObj);

                                    editTag(parentObj._id, parentObj, currentUser, function (editErr, editResponse) {
                                        if (editErr) {
                                            updatesCallback(editErr, null);
                                        } else {
                                            updatesCallback(null, editResponse);
                                        }
                                    });
                                }
                            });
                        } else {
                            // We already checked whether current parent tagType is allowed, 
                            // and that includes a case where it's set to "None" 
                            // (e.g., tags with "Facility" tagType have no parent, at this point
                            updatesCallback(null, savedTag);
                        }
                    },
                    function (updatesCallback) {
                        var tagObject = {id: savedTag._id.toString(), tagType: savedTag.tagType};

                        // The current user, who is also the creator of the new tag, 
                        // was added to the "usersWithAccess" array field of this tag.
                        // We now need to take care of adding the new tag to this user"s "accessibleTags" array field.
                        userDAO.addTagToAccessibleArray(currentUser, tagObject, function (updateErr, updatedUser) {
                            if (updateErr) {
                                updatesCallback(updateErr, null);
                            } else {
                                updatesCallback(null, savedTag);
                            }
                        });
                    }
                ], function (updatesError, updatesResult) {
                    if (updatesError) {
                        callback(updatesError, null);
                    } else {
                        callback(null, savedTag);
                    }
                });
            }
        ], function (createTagError, savedTag) {
            if (createTagError) {
                finalCallback(createTagError, null);
            } else {
                finalCallback(null, savedTag);
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getTagsByParams(params, callback) {
    Tag.find(params)
        .lean()
        .exec(function (err, foundTags) {
            if(err) {
                callback(err, null);
            } else {
                callback(null, foundTags);
            }
        });
}
// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function isDeletable(idArray, currentUser, finalCallback) {
    var allResults = [];
    async.each(idArray, function(id, isDeletableCallback) {
        async.waterfall([
            function (callback) {
                getTagById(id, callback);
            },
            function (foundTag, callback) {
                var answer = {
                    id: id,
                    isDeletable: false,
                    name: foundTag.name
                };

                if (foundTag.appEntities.length > 0) {
                    // A tag isn't deletable if it has app entities using it.
                    answer.isDeletable = false;
                    callback(null, [answer]);
                } else {
                    answer.isDeletable = true;
                            
                    if(foundTag.children.length > 0) {
                        allResults.push(answer);
                        // check children can be deleted
                        var childIdArray = _.pluck(foundTag.children, "id");
                        isDeletable(childIdArray, currentUser, callback);
                    }
                    else {
                        // Can be deleted
                        // Make sure to delete reference from any app entitty and/or parent
                        callback(null, [answer]);
                    }
                }
            }
        ], function (error, result) {
            if (error) {
                isDeletableCallback(error, null);
            } else {
                if(Array.isArray(result)) {
                    allResults = allResults.concat(result);
                }
                else {
                    allResults.push(result);
                }
                isDeletableCallback(null, allResults);
            }
        });
    }, function(finalErr) {
        if (finalErr) {
            finalCallback(finalErr, null);
        } else {
            allResults = _.uniq(allResults);
            finalCallback(null, allResults);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Delete tags in Ids array
 *
 * @access  public
 * @param   array of tagId
 * @param   user object
 * @param   callback
 * @return  void
 */
function deleteTagById(idArray, currentUser, finalCallback) {
    var error;
    if (currentUser.role !== consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.Admin) {
        error = new Error(consts.CAN_NOT_DELETE_TAG);
        error.status = 422;
        finalCallback(error, null);
    } else {
        async.waterfall([
            function (callback) {
                getTagsByParams({_id: {$in: idArray}}, callback);
            },
            function (foundTags, callback) {
                var incorrect = _.filter(foundTags, function(tag) {
                    return tag.creatorRole === consts.USER_ROLES.BP && currentUser.role !== consts.USER_ROLES.BP;
                });
                if(incorrect.length > 0) {
                    error = new Error(consts.ONLY_BP_CAN_DELETE_TAG);
                    error.status = 422;
                    callback(error, null);
                } else {
                    callback(null, foundTags);
                }
            },
            /*
            function (foundTags, currentUser, callback) {
                var tagIds = _.map(foundTags, function(tag) {
                    return tag._id.toString();
                });

                isDeletable(tagIds, currentUser, function (err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        var usedIds = [];
                        for(var prop in results) {
                            if(results[prop]) {
                                var item = results[prop];
                                if(!item.isDeletable) {
                                    usedIds.push(prop);
                                }
                            }
                            if(usedIds.length > 0) {
                                error = new Error(consts.TAG_IS_BEING_USED + ": " + usedIds);
                                error.status = 422;
                                callback(error, null);
                            } else {
                                callback(null, tagIds);
                            }
                        }
                        if(usedIds.length > 0) {
                            callback(new Error(consts.TAG_IS_BEING_USED + ": " + usedIds), null);
                        } else {
                            callback(null, tagIds);
                        }
                    }
                });
            },
            function (tagIds, callback) {
                async.each(tagIds, function(currId, tagsCallback) {
                    async.waterfall([
                        function(tagCallback) {
                            getTagById(currId, tagCallback);
                        },
            */
            function (foundTags, callback) {
                async.each(foundTags, function(foundTag, tagsCallback) {
                    async.waterfall([
                        function(tagCallback) {
                            tagCallback(null, foundTag);
                        },
                        function(currTag, tagCallback) {
                            if (currTag.usersWithAccess.length > 0) {
                                var tagObject = {id: currTag._id.toString(), tagType: currTag.tagType};
                                userDAO.removeTagFromAllUsersWithAccess(tagObject,
                                    _.pluck(currTag.usersWithAccess, "id"),
                                    function (updateErr, updateResult) {
                                        if (updateErr) {
                                            tagCallback(updateErr, null);
                                        } else {
                                            //tagCallback(null, updateResult);
                                            tagCallback(null, currTag);
                                        }
                                    }
                                );
                            } else {
                                tagCallback(null, currTag);
                            }
                        },
                        function (currTag, tagCallback){
                            if (currTag.children.length > 0) {
                                async.each(currTag.children, function(childTag, childCallback)
                                {
                                    var paretTag = {"id" : currTag._id, "tagType" : currTag.tagType};
                                    Tag.update(
                                        {_id: childTag.id},
                                        {$pull: {parents: paretTag}}).exec(childCallback);
                                }, function(updateError, updateResult) {
                                    if (updateError) {
                                        tagCallback(updateError, null);
                                    } else {
                                        tagCallback(null, currTag);
                                    }
                                });
                            } else {
                                tagCallback(null, currTag);
                            }
                        },
                        function(currTag, tagCallback) {
                            if (currTag.parents.length > 0) {
                                async.each(currTag.parents, function(parentTag, parentCallback) {
                                    var tagObject = {id: currTag._id.toString(), tagType: currTag.tagType};
                                    Tag.update({_id: parentTag.id},
                                        {$pull: {children: tagObject}}).exec(parentCallback);
                                }, function(updateError, updateResult) {
                                    if (updateError) {
                                        tagCallback(updateError, null);
                                    } else {
                                        tagCallback(null, currTag);
                                    }
                                });
                            } else {
                                tagCallback(null, currTag);
                            }
                        }
                    ], function(updatesError, updatesResult) {
                        if (updatesError) {
                            tagsCallback(updatesError, null);
                        } else {
                            tagsCallback(null, updatesResult);
                        }
                    });
                }, function(error, result) {
                    if (error) {
                        callback(error, null);
                    } else {
                        var removeIds = _.map(foundTags, function(foundTag) {
                            return foundTag._id.toString();
                        });
                        Tag.remove({_id:  {$in: removeIds}}).exec(callback);
                    }
                });
            }
        ], function (err, finalResult) {
            if (err) {
                finalCallback(err);
            } else {
                finalCallback(null, idArray);
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Delete tags in ID array with children
 *
 * @access  public
 * @param   array of tagId
 * @param   user object
 * @param   callback
 * @return  void
 */
function deleteTagsWithChildren(idArray, currentUser, finalCallback) {
    var deletedIdArray = [];
    async.each(idArray, function(tagId, tagCallback) {
        async.waterfall([
            function(callback) {
                getTagById(tagId, callback);
            },
            function(foundTag, callback) {
                if(foundTag.children && foundTag.children.length>0) {
                    var childrenIds = _.map(foundTag.children, function(child) {
                        return child.id.toString();
                    });
                    deleteTagsWithChildren(childrenIds, currentUser, callback);
                }
                else {
                    callback(null, []);
                }
            },
            function(removedIds, callback) {
                if(removedIds && removedIds.length>0) {
                    deletedIdArray = deletedIdArray.concat(removedIds);
                    deletedIdArray = _.uniq(deletedIdArray);
                }
                deleteTagById([tagId], currentUser, callback);
            }
        ], function(deleteError, deleteResult) {
            if (deleteError) {
                tagCallback(deleteError, null);
            } else {
                deletedIdArray = deletedIdArray.concat(deleteResult);
                deletedIdArray = _.uniq(deletedIdArray);
                tagCallback(null, deletedIdArray);
            }
        });
    }, function(finalErr, finalResult) {
        if (finalErr) {
            finalCallback(finalErr, null);
        } else {
            finalCallback(null, deletedIdArray);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Descriptions here
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function validate(tagObj, callback) {
    var tag = new Tag(tagObj);
    tag.validate(function (err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, consts.OK);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Filter tags by type
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */

/*function filterValidTagTypes(tags) {
    var filteredTags = _.filter(tags, function (item) {
        return consts.TAG_TYPES.indexOf(item.tagType) > -1;
    });

    return filteredTags;
}*/

// --------------------------------------------------------------------------------------------------

/**
 * Func will add sensors to parent data logger object
 *
 * @access  private
 * @param   parentDataLoggers
 * @param   allTags
 * @return  {array}
 */
function getChildMapsWithId(ids) {
    var mapIds = _.map(ids, function (id) {
        return id.toString();
    });

    return mapIds;
}

// --------------------------------------------------------------------------------------------------

/**
 * Recursive function for getting all tags by visiting every node in abstract tag tree (abstract means db relation)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */

function findTagsRecursive(tagIds, destinationArray, callback) {
    getTagsByParams({_id: { $in: tagIds}}, function(findErr, findObjects) {
        if(findErr) {
            callback(findErr);
        } else {

            var thisChildrenIds = [];
            /*findObjects = _.map(findObjects, function(obj) {
                return obj.toObject();
            });*/

            //destinationArray = _.union(findObjects, destinationArray);
            destinationArray.push.apply(destinationArray, findObjects);

            for (var i = 0; i < findObjects.length; i++) {
                //var childTags = filterValidTagTypes(findObjects[i].children);

                //var childTagIds = _.pluck(findObjects[i].children, "id");

                //childTagIds = getChildMapsWithId(childTagIds);
                //thisChildrenIds = _.union(thisChildrenIds, childTagIds);
                //[].push.apply(topLevelDataSourceIds, topLevelObjectDataSourceIds);//add page into existingSeries

                for(var j=0; j < findObjects[i].children.length; j++) {
                    thisChildrenIds.push(findObjects[i].children[j].id);
                }
            }
            //console.log("children:" + thisChildrenIds)
            //thisChildrenIds = _.uniq(thisChildrenIds);
            if(thisChildrenIds.length > 0) {
                findTagsRecursive(thisChildrenIds, destinationArray, callback);
            } else {
                callback(null, destinationArray);
            }

        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get all tags by entityId and filtered tagType
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getTagsByEntityIds(objectType, entityIds, tagType, findNameMask, finalCallback) {
    var result = {};

    async.map(entityIds, function(entityId, entityIdsCallback) {

        var objectBindPair = tagBindingUtils.getQueryObjectBindPair(objectType, entityId);

        if (!objectBindPair) {
            entityIdsCallback(new Error("An error occurred while attempting to retrieve tag binding pair"), null);
        }

        async.waterfall([
            function(callback) {
                if (consts.APP_ENTITY_TYPES.indexOf(objectType) > -1) {
                    Tag.find({appEntities: objectBindPair}, callback);
                } else if (consts.USER_WITH_ACCESS_TYPES.indexOf(objectType) > -1) {
                    Tag.find({usersWithAccess: objectBindPair}, callback);
                } else {
                    finalCallback(consts.INVALID_ENTITY_TYPE, null);
                }
            },
            function(currentTags, callback) {
                var re = null;
                if(findNameMask) {
                    re = new RegExp(findNameMask, "i");
                }

                var thisTags = [];
                for(var i=0; i < currentTags.length; i++) {
                    var nameCheck = findNameMask? re.test(currentTags[i].name) : true;

                    if (nameCheck) {
                        thisTags.push(currentTags[i]);
                    }
                }
                result[entityId] = thisTags;
                callback(null, result);
            }
        ], function(entityIdError, tagResults) {
            if (entityIdError) {
                entityIdsCallback(entityIdError, null);
            } else {
                entityIdsCallback(null, tagResults);
            }
        });
    }, function(entityIdsError, finalResults) {
        if (entityIdsError) {
            finalCallback(entityIdsError, null);
        } else {
            // Convert finalResult to Object from Array
            if(Array.isArray(finalResults)) {
                finalResults = finalResults[0];
            }

            var finalData = {};

            if(tagType) {
                for (var prop in finalResults) {
                    if(finalResults[prop]) {
                        var thisTags = [];
                        for (var i = 0; i < finalResults[prop].length; i++) {
                            if (finalResults[prop][i].tagType === tagType) {
                                thisTags.push(finalResults[prop][i]);
                            }
                        }
                        finalData[prop] = thisTags;
                    }
                }
            } else {
                finalData = finalResults;
            }

            //finalCallback(null, result);
            finalCallback(null, finalData);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Recurisve function for building tag tree from plain array
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function buildTagsRecuriveTraversal(tagsObj, parent) {

    parent.childTags = [];

    for (var i = parent.children.length - 1; i >= 0; i--) {
        var childId = parent.children[i].id.toString();
        var child = tagsObj[childId];

        if(child) {

            var parentTag = _.clone(parent);

            delete parentTag["childTags"];
            delete parentTag["children"];
            delete parentTag["parents"];
            delete parentTag["parentTag"];
            child.parentTag = parentTag;

            buildTagsRecuriveTraversal(tagsObj, child);
            parent.childTags.push(child);
        } else {
            var msg = nodeUtil.format("Alarm! Achtung! Inconsistent db! " +
                "Parent tag  %s has child tag %s that is removed from db. Fix DB immediately!", parent.name, childId);
            var error = new Error(msg);
            error.name ="InconsistentDB";

            utils.logError(error);
        }
    }

    return true;
}

// --------------------------------------------------------------------------------------------------

/**
 * Build full tag tree from plain tags array
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function buildTagsTree(plainTagsArray, rootTagNodeIds) {
    var fullTreeHierarchy = [];

    var tagsObj = {};
    var thisId = null;
    var i = 0;

    for(i=0; i < plainTagsArray.length; i++) {
        thisId = plainTagsArray[i]._id.toString();
        tagsObj[thisId] = plainTagsArray[i];
    }
    //plainTagsArray = null;

    rootTagNodeIds = _.map(rootTagNodeIds, function (id) {
        return id.toString();
    });

    for(var id in tagsObj) {
        if(tagsObj[id] && rootTagNodeIds.indexOf(id)> -1) {
            buildTagsRecuriveTraversal(tagsObj, tagsObj[id]);
            fullTreeHierarchy.push(tagsObj[id]);
        }
    }
    tagsObj = null;

    function compare(a,b) {
        return a.name.localeCompare(b.name);
    }

    fullTreeHierarchy.sort(compare);

    return fullTreeHierarchy;
}

// --------------------------------------------------------------------------------------------------

/**
 * Get all tags with full-hierarchy for specified entity such as User , Dashbard, Presentation
 *
 * @access  public
 * @param   string
 * @param   string
 * @param   array
 * @param   string
 * @param   callback
 * @return  void
 */
function getTagsFullHierarchyByEntityIds(objectType, entityIds, tagType, findNameMask, finalCallback) {
    getTagsByEntityIds(objectType, entityIds, tagType, findNameMask, function(err, resultTags) {
        if (err) {
            finalCallback(err);
        } else {

            async.map(entityIds, function(entityId, entityIdsCallback) {
                var topLevelTagIds = _.pluck(resultTags[entityId], "_id");

                findTagsRecursive(topLevelTagIds, [], function(err, plainTagsArray) {
                    if(err) {
                        entityIdsCallback(err);
                    } else {
                        var tagTreeCollection = buildTagsTree(plainTagsArray, topLevelTagIds);
                        var tagFullHierarchy = {
                            entityId: entityId,
                            fullTagHierarchy: tagTreeCollection,
                            plainTagsArray: plainTagsArray
                        };
                        entityIdsCallback(null, tagFullHierarchy);
                    }
                });

            }, function(err, results) {
                if (err) {
                    finalCallback(err);
                } else {
                    var tagFullHierarchy = {};
                    results.forEach(function(result) {
                        tagFullHierarchy[result.entityId] = result.fullTagHierarchy;
                    });
                    finalCallback(null, tagFullHierarchy);
                }
            });
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get all tags with full-hierarchy for specified entity such as User , Dashbard, Presentation
 *
 * @access  public
 * @param   string
 * @param   string
 * @param   array
 * @param   string
 * @param   callback
 * @return  void
 */
function getTagsFullHierarchyByEntity(entity, entityType, tagType, findNameMask, finalCallback) {
    var tagBindingArray = [];
    var tmpTags = [];
    var tmpSegment = {};

    if (consts.APP_ENTITY_TYPE.DASHBOARD === entityType || consts.APP_ENTITY_TYPE.ANALYZE_WIDGET === entityType) {

        entity.segments.forEach(function(segment) {
            tmpSegment = {};
            tmpSegment.name = segment.name;
            tmpSegment.id = segment.id;
            tmpSegment.tags = _.pluck(segment.tagBindings, "id");
            //tmpSegment.tags = _.map(tmpSegment.tags, function(tag) {return tag.toString();});
            tagBindingArray.push(tmpSegment);

        });

    } else if (consts.APP_ENTITY_TYPE.PRESENTATION === entityType) {

        tmpTags =  _.pluck(entity.tagBindings, "id");
        //tmpTags = _.map(tmpTags, function(tag) {return tag.toString();});
        tagBindingArray.push({name: entityType, tags: tmpTags});

    } else if (consts.USER_WITH_ACCESS_TYPES.indexOf(entityType) > -1) {

        tmpTags =  _.pluck(entity.accessibleTags, "id");
        //tmpTags = _.map(tmpTags, function(tag) {return tag.toString();});
        tagBindingArray.push({name: entityType, tags: tmpTags});

    } else {

        finalCallback(consts.INVALID_ENTITY_TYPE, null);

    }

    async.map(tagBindingArray, function(tagBinding, tagBindingCallback) {

        async.waterfall([
            /*function(tagCallback) {
             getTagsByTagIds(tagBinding.tags, tagType, findNameMask, tagCallback);
             },*/
            function(tagCallback) {
                var topLevelTagIds = tagBinding.tags;
                findTagsRecursive(topLevelTagIds, [], function(err, plainTagsArray) {
                    if(err) {
                        tagCallback(err);
                    } else {
                        var tagTreeCollection = buildTagsTree(plainTagsArray, topLevelTagIds);
                        tagCallback(null, tagTreeCollection);
                    }
                });
            }
        ], function(err, tagTreeArray) {
            if (err) {
                tagBindingCallback(err, null);
            } else {
                var formatedTagBinding = {
                    name: tagBinding.name,
                    id: tagBinding.id,
                    tags: tagTreeArray
                };
                tagBindingCallback(null, formatedTagBinding);
            }
        });

    }, function(err, resultTagBindings) {
        if (err) {
            finalCallback(err,null);
        } else {
            finalCallback(null,resultTagBindings);
        }
    });

}

// --------------------------------------------------------------------------------------------------

/**
 * Get all tags with full-hierarchy
 *
 * @access  public
 * @param   array
 * @param   string
 * @param   callback
 * @return  void
 */
function getAllTagsFullHierarchy(finalCallback) {

    async.waterfall([
        function (callback) {
            getTagsByParams({tagType: consts.TAG_TYPE.Facility}, callback);
        },
        function (foundTags, tagCallback) {
            var rootTagIds =  _.pluck(foundTags, "_id");
            findTagsRecursive(rootTagIds, [], function(err, plainTagsArray) {
                if(err) {
                    tagCallback(err);
                } else {
                    var tagTreeCollection = buildTagsTree(plainTagsArray, rootTagIds);
                    tagCallback(null, tagTreeCollection);
                }
            });
        }
    ], function(err, tagTreeArray) {
        if (err) {
            finalCallback(err, null);
        } else {
            finalCallback(null, tagTreeArray);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Visiting tag tree following preorder traversal algorithm (top-to-bottom)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function findTagsRecuriveTraversalA(tag, tagType, isTopToBottom, plainTagsArray, plainTagIdsArray) {

    if (tag.tagType === tagType) {
        plainTagsArray.push(tag);
    } else if (("childTags" in tag) && (tag.childTags.length)) {
        tag.childTags.forEach(function(childTag) {
            if ((childTag.tagType === tagType) && (! _.contains(plainTagIdsArray, childTag._id.toString()))) {
                plainTagsArray.push(childTag);
                plainTagIdsArray.push(childTag._id.toString());
            } else {
                findTagsRecuriveTraversalA(childTag, tagType, isTopToBottom, plainTagsArray, plainTagIdsArray);
            }
        });
    }

    return ;

}

// --------------------------------------------------------------------------------------------------

/**
 * Visiting tag tree following preorder traversal algorithm (bottom-to-top)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function findTagsRecuriveTraversalB(tag, tagType, isTopToBottom, plainTagsArray, plainTagIdsArray, finalCallback) {

    async.eachSeries(tag.parents, function(parent, callback){
        getTagById(parent.id.toString(), function(err, parentTag) {
            if ((parentTag.tagType === tagType) && (! _.contains(plainTagIdsArray, parentTag._id.toString()))) {
                plainTagsArray.push(parentTag);
                plainTagIdsArray.push(parentTag._id.toString());
                callback(null);
            } else {
                findTagsRecuriveTraversalB(parentTag, tagType, isTopToBottom,
                    plainTagsArray, plainTagIdsArray, finalCallback);
            }
        });
    }, function(err) {
        finalCallback(null, plainTagsArray);
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get plain tags array by calling recursive traversal function for specified tag tree
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getPlainTagsArray(tag, tagType, finalCallback) {
    var plainTagIdsArray = [];

    if(consts.TAG_TYPES.indexOf(tag.tagType) <= consts.TAG_TYPES.indexOf(tagType)) {
        var plainTagsArray = [];

        findTagsRecuriveTraversalA(tag, tagType, true, plainTagsArray, plainTagIdsArray);
        finalCallback(null, plainTagsArray);
    } else {
        findTagsRecuriveTraversalB(tag, tagType, false, [], plainTagIdsArray, finalCallback);
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Filtering tags by tag type
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function filterTagsByType(tags, tagType, finalCallback) {
    if (! isValidTagType(tagType)) {
        finalCallback(consts.INVALID_TAG_TYPE, null);
    }

    async.map(tags, function(tag, tagCallback) {
        getPlainTagsArray(tag, tagType, tagCallback);
    }, function(err, filteredTags) {
        if (err) {
            finalCallback(err);
        } else {
            filteredTags = _.uniq(_.flatten(filteredTags), function(obj) { return obj._id.toString(); });
            finalCallback(null, filteredTags);
        }
    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Func will add sensors to parent data logger object
 *
 * @access  private
 * @param   parentDataLoggers
 * @param   allTags
 * @return  {array}
 */
function getDataLoggersBySensors(parentDataLoggers, allTags) {

    var allDataLoggers = [];

    for(var i=0; i < parentDataLoggers.length; i++) {
        var dataLogger = parentDataLoggers[i];

        dataLogger.childTags = [];

        var childTagIds = _.pluck(dataLogger.children, "id");
        childTagIds = getChildMapsWithId(childTagIds);

        for(var j=0; j < allTags.length; j++) {
            if(allTags[j].tagType === consts.TAG_TYPE.Node && _.contains(childTagIds, allTags[j]._id.toString())) {
                dataLogger.childTags.push(allTags[j]);
            }
        }

        allDataLoggers.push(dataLogger);
    }

    return allDataLoggers;
}

// --------------------------------------------------------------------------------------------------

/**
 * Func will add metrics to sensors and sensors to parent data logger object
 *
 * @access  private
 * @param   foundSensors
 * @param   foundDataLoggers
 * @param   allTags
 * @return {array}
 */
function getDataLoggersByMetrics(foundSensors, foundDataLoggers, allTags) {
    var allDataLoggers = [];

    for(var i=0; i < foundDataLoggers.length; i++) {
        var dataLogger = foundDataLoggers[i];
        dataLogger.childTags = [];

        var childTagIds = _.pluck(dataLogger.children, "id");
        childTagIds = getChildMapsWithId(childTagIds);

        for(var j=0; j < foundSensors.length; j++) {
            var sensor = foundSensors[j];
            if(sensor.tagType === consts.TAG_TYPE.Node && _.contains(childTagIds, sensor._id.toString())) {
                sensor.childTags = [];

                var sensorchildTagIds = _.pluck(sensor.children, "id");
                sensorchildTagIds = getChildMapsWithId(sensorchildTagIds);

                for(var k =0;k < allTags.length; k++) {
                    if(allTags[k].tagType === consts.TAG_TYPE.Metric &&
                        _.contains(sensorchildTagIds, allTags[k]._id.toString())) {
                        sensor.childTags.push(allTags[k]);
                    }
                }

                dataLogger.childTags.push(sensor);
            }
        }

        allDataLoggers.push(dataLogger);
    }

    return allDataLoggers;
}

// --------------------------------------------------------------------------------------------------

/**
 * Filtering tags by tag type (will be deprecated soon. this is un-scalable proc)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function filterTagsByTypeA(tags, fromType, toType, finalCallback) {
    if (!isValidTagType(fromType) || !isValidTagType(toType)) {
        finalCallback(consts.INVALID_TAG_TYPE, null);
    } else {

        var tagParams = [];

        if (fromType === consts.TAG_TYPE.Facility) {
            var allDataLoggers = [];
            var allDataLoggersId = [];

            tags.forEach(function(tag) {
                tag.childTags.forEach(function(childTag) {
                    if (! _.contains(allDataLoggersId,childTag._id.toString())) {
                        allDataLoggers.push(childTag);
                        allDataLoggersId.push(childTag._id);
                    }
                });
            });

            finalCallback(null, allDataLoggers);
        }

        tags.forEach(function(tag) {
            if(tag.tagType === fromType) {
                tagParams.push(tag.parents[0].id);
            }
        });

        tagParams = _.uniq(tagParams, function (obj) {
            return obj.id.toString();
        });

        //find parents
        getTagsByParams({_id: {$in: tagParams }}, function(err, foundParents){
            if(err) {
                finalCallback(err);
            } else {
                if (fromType === consts.TAG_TYPE.Node) {
                    var allDataLoggers = getDataLoggersBySensors(foundParents, tags);
                    finalCallback(null, allDataLoggers);
                } else if(fromType === consts.TAG_TYPE.Metric) {

                    //need find data loggers
                    var secondLevelParentId = [];
                    foundParents.forEach(function(tag) {
                        secondLevelParentId.push(tag.parents[0].id);

                    });

                    getTagsByParams({_id: {$in: secondLevelParentId }}, function(secondLevelErr, foundTopLevelParents){
                        if(secondLevelErr) {
                            finalCallback(secondLevelErr);
                        } else {
                            var allDataLoggers = getDataLoggersByMetrics(foundParents, foundTopLevelParents, tags);
                            finalCallback(null, allDataLoggers);
                        }
                    });
                }
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 * Recursive function for getting all tags by visiting every node in abstract tag tree (abstract means db relation)
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getMetricsFromTags(objectType, entityId, tagType, findNameMask, finalCallback) {
    getTagsByEntityIds(objectType, [entityId], tagType, findNameMask, function(err, results) {
        if (err) {
            finalCallback(err);
        }
        else {
            var topLevelTagIds = _.pluck(results[entityId], "_id");
            findTagsRecursive(topLevelTagIds, [], function(err, plainTagsArray) {
                if(err) {
                    finalCallback(err);
                } else {
                    var metrics = _.filter(plainTagsArray, function(tag) {
                        return tag.tagType === consts.TAG_TYPE.Metric;
                    });
                    var uniqMetrics = _.uniq(metrics, "name");
                    finalCallback(null, uniqMetrics);
                }
            });
        }

    });
}

// --------------------------------------------------------------------------------------------------

/**
 * Get all tags by entityId and filtered tagType
 *
 * @access  public
 * @param   array
 * @param   array
 * @param   callback
 * @return  void
 */
function getTagsByTagIds(tagIds, tagType, findNameMask, finalCallback) {
    async.waterfall([
        function(callback) {
            Tag.find({_id: {$in: tagIds}}).lean().exec(callback);
        },
        function(currentTags, callback) {
            var re = null;
            if(findNameMask) {
                re = new RegExp(findNameMask, "i");
            }

            var thisTags = [];
            for(var i=0; i < currentTags.length; i++) {
                var nameCheck = findNameMask? re.test(currentTags[i].name) : true;

                if (nameCheck && (thisTags.tagType === tagType || tagType === null)) {
                    thisTags.push(currentTags[i]);
                }
            }
            callback(null, thisTags);
        }
    ], function(error, tagResults) {
        if (error) {
            finalCallback(error, null);
        } else {
            finalCallback(null, tagResults);
        }
    });
}

function deleteChildbyId(tagId, childrenId, callback) {
    Tag.find({_id: new ObjectId(childrenId)})
        .lean()
        .exec(function(err, result) {
            if (err) {
                callback(err, null);
            } else {
                if (result.length === 0) {
                    Tag.update(
                        {_id: new ObjectId(tagId)},
                        {$pull: {children: {id: childrenId}}}).exec(callback);
                } else {
                    callback(null, result);
                }
            }
        });
}

// --------------------------------------------------------------------------------------------------

/**
 *
 * @access  private
 * @param   tag Object
 * @return  accessibleUsers Array
 */

function getPopulatedUsersWithAccess(tag, callback) {
    if (typeof tag === "undefined" || tag === null) {
        var error = new Error("Empty Tag");
        error.status = 422;
        callback(error);
    } else if (typeof tag.parents === "undefined" || tag.parents === null || tag.parents.length === 0) {
        var callbackParam = tag.toObject().usersWithAccess;
        callback(null, callbackParam);
    } else {
        var mergedUsers = tag.toObject().usersWithAccess;
        async.each(tag.parents, function(parentObj, cb) {
            getTagById(parentObj.id, function(err, parentTag) {
                if (err) {
                    cb(err);
                } else {
                    getPopulatedUsersWithAccess(parentTag, function(err, result) {
                        if (err) {
                            cb(err);
                        } else {
                            if (typeof mergedUsers === "undefined" || mergedUsers === null) {
                                mergedUsers = result;
                            } else {
                                mergedUsers = _.union(mergedUsers, result);
                            }
                            cb(null);
                        }
                    });
                }
            });
        }, function(err) {
            if (err) {
                callback(err);
            } else {
                if (typeof mergedUsers !== "undefined" && mergedUsers !== null) {
                    mergedUsers = _.uniq(mergedUsers, function(user) {return user.id.toString();});
                    mergedUsers = _.without(mergedUsers, null, undefined);
                }
                callback(null, mergedUsers);
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 *
 * @access  private
 * @param   tag Object
 * @param   callback
 * @return  void
 */

function populateAccessibleUsersForTag(tag, callback) {
    getPopulatedUsersWithAccess(tag, function(err, users) {
        if (err) {
            callback(err);
        } else {
            if (typeof users === "undefined" || users === null || users.length === 0) {
                callback(new Error("Got Null Collection for usersWithAccess"));
            } else {
                async.map(users, function(user, cb) {
                    var userId = user.id || user._id;
                    userDAO.getUserById(userId, function(err, foundUser) {
                        if (err) {
                            cb(null, null);
                        } else {
                            cb(null, foundUser);
                        }
                    });
                }, function(err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    }
                });
            }
        }
    });
}
// --------------------------------------------------------------------------------------------------

/**
 *
 * @access  private
 * @param   tag Object
 * @return  accessibleUsers Array
 */

function getPopulatedUsersWithAccess(tag, callback) {
    if (typeof tag === "undefined" || tag === null) {
        var error = new Error("Empty Tag");
        error.status = 422;
        callback(error);
    } else if (typeof tag.parents === "undefined" || tag.parents === null || tag.parents.length === 0) {
        var callbackParam = tag.toObject().usersWithAccess;
        callback(null, callbackParam);
    } else {
        var mergedUsers = tag.toObject().usersWithAccess;
        async.each(tag.parents, function(parentObj, cb) {
            getTagById(parentObj.id, function(err, parentTag) {
                if (err) {
                    cb(err);
                } else {
                    getPopulatedUsersWithAccess(parentTag, function(err, result) {
                        if (err) {
                            cb(err);
                        } else {
                            if (typeof mergedUsers === "undefined" || mergedUsers === null) {
                                mergedUsers = result;
                            } else {
                                mergedUsers = _.union(mergedUsers, result);
                            }
                            cb(null);
                        }
                    });
                }
            });
        }, function(err) {
            if (err) {
                callback(err);
            } else {
                if (typeof mergedUsers !== "undefined" && mergedUsers !== null) {
                    mergedUsers = _.uniq(mergedUsers, function(user) {return user.id.toString();});
                    mergedUsers = _.without(mergedUsers, null, undefined);
                }
                callback(null, mergedUsers);
            }
        });
    }
}

// --------------------------------------------------------------------------------------------------

/**
 *
 * @access  private
 * @param   tag Object
 * @param   callback
 * @return  void
 */

function populateAccessibleUsersForTag(tag, callback) {
    getPopulatedUsersWithAccess(tag, function(err, users) {
        if (err) {
            callback(err);
        } else {
            if (typeof users === "undefined" || users === null || users.length === 0) {
                callback(new Error("Got Null Collection for usersWithAccess"));
            } else {
                async.map(users, function(user, cb) {
                    var userId = user.id || user._id;
                    userDAO.getUserById(userId, function(err, foundUser) {
                        if (err) {
                            cb(null, null);
                        } else {
                            cb(null, foundUser);
                        }
                    });
                }, function(err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    }
                });
            }
        }
    });
}
// --------------------------------------------------------------------------------------------------

function updateTimeZones() {

    async.waterfall([
        function (cb) {
            getTagsByParams({
                $and: [
                    {tagType: consts.TAG_TYPE.Scope},
                    {timezone: {$ne: null}}
                ]
            }, cb);
        }, function (scopes, cb) {
            timezoneDAO.getTimezoneSettings(function (err, foundTimezones) {
                if (err) {
                    cb(err);
                } else {

                    var obj = {};
                    for (var i = 0; i < foundTimezones.length; i++) {
                        obj[foundTimezones[i].name] = foundTimezones[i];
                    }

                    cb(null, scopes, obj);
                }
            });
        }, function (scopes, timezones, cb) {
            var now = moment.utc();
            var i = 0;

            var hourMS = 3600000;

            var timezoneOffsets = {};
            for (i = 0; i < consts.TIME_ZONES.length; i++) {
                timezoneOffsets[consts.TIME_ZONES[i].name] = consts.TIME_ZONES[i].offset;
            }

            var scopesToUpdate = [];

            for (i = 0; i < scopes.length; i++) {
                var scopeTZ = scopes[i].timezone;

                if (timezones[scopeTZ] && timezoneOffsets[scopeTZ]) {

                    var tzModel = timezones[scopeTZ];
                    var offset = timezoneOffsets[scopeTZ];

                    //convert utc to number of milliseconds in local time
                    var localTime = now.clone().add(offset, "m").toDate().getTime();

                    //if difference between current device time and daylight switch time < 1 hour, update tz
                    for (var j = 0; j < tzModel.switchTimes.length; j++) {
                        var diff = Math.abs(tzModel.switchTimes[j].getTime() - localTime);
                        if (diff < hourMS) {
                            scopes[i].timezone = tzModel.switchName;
                            scopesToUpdate.push(scopes[i]);
                            break;
                        }
                    }
                }
            }

            cb(null, scopesToUpdate);
        },
        function (scopesToUpdate, callback) {
            if (scopesToUpdate.length > 0) {
                async.each(scopesToUpdate, function (scope, cb) {
                    scope.save(cb);
                }, function (err) {
                    callback(err);
                });
            } else {
                callback(null, consts.OK);
            }
        }
    ], function (err) {
        if (err) {
            utils.logError(err);
        }
    });
}

exports.getTagById = getTagById;
exports.getTagsByTagIds = getTagsByTagIds;
exports.getTagsByEntityIds = getTagsByEntityIds;

exports.getTagsFullHierarchyByEntityIds = getTagsFullHierarchyByEntityIds;
exports.getTagsFullHierarchyByEntity = getTagsFullHierarchyByEntity;
exports.getAllTagsFullHierarchy = getAllTagsFullHierarchy;
exports.findTagsRecursive = findTagsRecursive;

exports.validate = validate;
exports.deleteTagById = deleteTagById;
exports.createTag = createTag;
exports.editTag = editTag;
exports.isDeletable = isDeletable;
exports.getTagsByParams = getTagsByParams;
exports.filterTagsByType = filterTagsByType;
exports.populateAccessibleUsersForTag = populateAccessibleUsersForTag;

exports.deleteChildbyId = deleteChildbyId;
exports.deleteTagsWithChildren = deleteTagsWithChildren;

//will be deprecated soon
exports.filterTagsByTypeA = filterTagsByTypeA;
exports.getMetricsFromTags = getMetricsFromTags;
//exports.getDataLoggersBySensors = getDataLoggersBySensors;
//exports.getDataLoggersByMetrics = getDataLoggersByMetrics;
exports.updateTimeZones = updateTimeZones;
exports.buildTagsTree = buildTagsTree;
