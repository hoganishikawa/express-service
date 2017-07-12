"use strict";
require("../../general/models");
require("../../bl-brighter-view/models");
require("../../bl-data-sense/models");

var mongoose = require("mongoose"),
    User = mongoose.model("user"),
    ObjectId = mongoose.Types.ObjectId,
    consts = require("../../libs/consts"),
    argv = require("minimist")(process.argv.slice(2)),
    async = require("async"),
    log = require("../../libs/log")(module),
    utils = require("../../libs/utils"),
    Email = "";

if(!argv.email) {
    //Developer BP account email
    Email = "brightergy.developer@brightergy.com";
} else {
    Email = argv.email;
}

function insertUsers(finalCallback) {

    User.remove({}, function(err, retval) {
        if (err) {
            utils.logError(err);
        } else {
            async.waterfall([
                function (callback) {
                    var users = [];
                    users.push({
                        "_id" : new ObjectId("54135e285a749f381d2dd46a"),
                        "firstName": "Adam",
                        "lastName": "Blake",
                        "email": "adam.blake@brightergy.com",
                        "emailUser": "adam.blake",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "Admin",
                        "profilePictureUrl" : "/assets/img/icon_SF_large.png",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("54135ec74f09ccc06d5be3d6"),
                        "firstName": "Adam",
                        "lastName": "Admin",
                        "email": "adam@brightergy.com",
                        "emailUser": "adam",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "TM",
                        "profilePictureUrl" : null,
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("54135f90c6ab7c241e28095e"),
                        "firstName": "Daniel",
                        "lastName": "Keith",
                        "email": "aleksei.pylyp@brightergy.com",
                        "emailUser": "daniel.keith",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "BP",
                        "profilePictureUrl" : "/assets/img/mm-picture.png",
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE",
                        "tokens": []
                    });
                    users.push({
                        "_id" : new ObjectId("5416f4647fd9bfec17c6253d"),
                        "firstName": "Emmanuel",
                        "lastName": "Ekochu",
                        "email": "emmanuel.ekochu@brightergy.com",
                        "emailUser": "emmanuel.ekochu",
                        "emailDomain": "brightergy.com",
                        "accounts": [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "BP",
                        "profilePictureUrl" : "/assets/img/mm-picture.png",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("5416f4a4aa6409d01d0c91dc"),
                        "firstName" : "Ilya",
                        "lastName" : "Shekhurin",
                        "email" : "ilya.shekhurin@brightergy.com",
                        "emailUser" : "ilya.shekhurin",
                        "emailDomain" : "brightergy.com",
                        "accounts": [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password" : "Brightergy1",
                        "role" : "BP",
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "profilePictureUrl" : "/assets/img/icon_SF_large.png",
                        "sfdcAccountId" : "001C0000013iMilIAE",
                        "tokens": []
                    });
                    users.push({
                        "_id" : new ObjectId("542036a34242d6e81dd2ac45"),
                        "firstName" : "Ian",
                        "lastName" : "Edwards",
                        "email" : "ian.edwards@brightergy.com",
                        "emailUser" : "ian.edwards",
                        "emailDomain" : "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password" : "Brightergy1",
                        "role" : "Admin",
                        "profilePictureUrl" : "/assets/img/mm-picture.png",
                        "tokens": [],
                        "apps": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("545898afa6e5da3a00dfe131"),
                        "firstName": "Samar",
                        "lastName": "Acharya",
                        "email": "samar.acharya@brightergy.com",
                        "emailUser": "samar.acharya",
                        "emailDomain": "brightergy.com",
                        "accounts": [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "BP",
                        "profilePictureUrl" : "/assets/img/mm-picture.png",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("5458ac6a5e9b792200497fad"),
                        "firstName" : "Ivan",
                        "lastName" : "Vesely",
                        "email" : "ivan.vesely@brightergy.com",
                        "emailUser" : "ivan.vesely",
                        "emailDomain" : "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password" : "Brightergy1",
                        "role" : "BP",
                        "profilePictureUrl" : "/assets/img/icon_SF_large.png",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("5458c537de56992100f87cb7"),
                        "firstName" : "Dima",
                        "lastName" : "Sliva",
                        "email" : "dima.sliva@brightergy.com",
                        "emailUser" : "dima.sliva",
                        "emailDomain" : "brightergy.com",
                        "accounts": [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password" : "Brightergy1",
                        "role" : "BP",
                        "profilePictureUrl" : "/assets/img/icon_SF_large.png",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("5458d61fdcb8eb2b000dce66"),
                        "firstName" : "Andriy",
                        "lastName" : "Mobile1",
                        "email" : "dev.mobile1@brightergy.com",
                        "emailUser" : "dev.mobile1",
                        "emailDomain" : "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password" : "Brightergy1",
                        "role" : "BP",
                        "profilePictureUrl" : "/assets/img/mm-picture.png",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("5458d660ab746d33008c77be"),
                        "firstName" : "Inn",
                        "lastName" : "Mobile2",
                        "email" : "dev.mobile2@brightergy.com",
                        "emailUser" : "dev.mobile2",
                        "emailDomain" : "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password" : "Brightergy1",
                        "role" : "BP",
                        "profilePictureUrl" : "/assets/img/mm-picture.png",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("5458d6a9df148b3b00b6b787"),
                        "firstName" : "Yakov",
                        "lastName" : "Mobile3",
                        "email" : "dev.mobile3@brightergy.com",
                        "emailUser" : "dev.mobile3",
                        "emailDomain" : "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "profilePictureUrl" : null,
                        "role" : "BP",
                        "password" : "Brightergy1",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("5458ee0341dbce5800f248c9"),
                        "firstName" : "Dev",
                        "lastName" : "Webapp",
                        "email" : "dev.web@brightergy.com",
                        "emailUser" : "dev.web",
                        "emailDomain" : "brightergy.com",
                        "accounts": [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "profilePictureUrl" : "/assets/img/icon_SF_large.png",
                        "role" : "BP",
                        "password" : "Brightergy1",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("5458ef4b8cd91d6000a105af"),
                        "firstName" : "Nenad",
                        "lastName" : "Pavlovic",
                        "email" : "nenad.pavlovic@brightergy.com",
                        "emailUser" : "nenad.pavlovic",
                        "emailDomain" : "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "profilePictureUrl" : null,
                        "role" : "BP",
                        "password" : "Brightergy1",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("54590cc2fcbf7357005117cf"),
                        "firstName" : "Petro",
                        "lastName" : "Lysenko",
                        "email" : "petro.lysenko@brightergy.com",
                        "emailUser" : "petro.lysenko",
                        "emailDomain" : "brightergy.com",
                        "accounts": [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "profilePictureUrl" : "/assets/img/mm-picture.png",
                        "role" : "BP",
                        "password" : "Brightergy1",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("545ce51ce84de93400dc69fb"),
                        "firstName" : "test",
                        "lastName" : "testov",
                        "email" : "dev.web2@brightergy.com",
                        "emailUser" : "dev.web2",
                        "emailDomain" : "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "profilePictureUrl" : "/assets/img/icon_SF_large.png",
                        "role" : "BP",
                        "password" : "Brightergy1",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "_id" : new ObjectId("545ce53282fc6c3b007005c9"),
                        "firstName" : "test",
                        "lastName" : "testov",
                        "email" : "dev.web3@brightergy.com",
                        "emailUser" : "dev.web3",
                        "emailDomain" : "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "profilePictureUrl" : "/assets/img/icon_SF_large.png",
                        "role" : "BP",
                        "password" : "Brightergy1",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "firstName": "Brightergy",
                        "lastName": "Developer",
                        "email": Email,
                        "emailUser": "brightergy.developer",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "BP",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "firstName": "Brightergy",
                        "lastName": "Admin1",
                        "email": "brightergy_admin1@brightergy.com",
                        "emailUser": "brightergy.admin1",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "Admin",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "firstName": "Brightergy",
                        "lastName": "Admin2",
                        "email": "brightergy_admin2@brightergy.com",
                        "emailUser": "brightergy.admin2",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "Admin",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "firstName": "Brightergy",
                        "lastName": "TM1",
                        "email": "brightergy_tm1@brightergy.com",
                        "emailUser": "brightergy.tm1",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "TM",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "firstName": "Brightergy",
                        "lastName": "TM2",
                        "email": "brightergy_tm2@brightergy.com",
                        "emailUser": "brightergy.tm2",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "TM",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });
                    users.push({
                        "firstName": "Tatiana",
                        "lastName": "Savchenko",
                        "email": "tatiana.savchenko@brightergy.com",
                        "emailUser": "tatiana.savchenko",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "BP",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });

                    users.push({
                        "firstName": "Igor",
                        "lastName": "Hodunay",
                        "email": "igor.hodunay@brightergy.com",
                        "emailUser": "igor.hodunay",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "BP",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });

                    users.push({
                        "firstName": "Jonathan",
                        "lastName": "Hockman",
                        "email": "jonathan.hockman@brightergy.com",
                        "emailUser": "jonathan.hockman",
                        "emailDomain": "brightergy.com",
                        "accounts" : [
                            new ObjectId("54927f9da60298b00cd95fd2")
                        ],
                        "password": "Brightergy1",
                        "role": "BP",
                        "tokens": [],
                        "enphaseUserId": "4d6a49784e7a67790a",
                        "sfdcAccountId" : "001C0000013iMilIAE"
                    });

                    async.each(users, function (user, saveCallback) {
                        var UserModel = new User(user);
                        UserModel.save(saveCallback);
                    }, function (saveErr, saveResult) {
                        if (saveErr) {
                            callback(saveErr);
                        } else {
                            callback(null, consts.OK);
                        }
                    });
                }
            ], function (err, result) {
                if (err) {
                    var correctErr = utils.convertError(err);
                    log.error(correctErr);
                    finalCallback(correctErr, null);
                } else {
                    log.info(result);
                    finalCallback(null, result);
                }
            });
        }
    });
}

exports.insertUsers = insertUsers;
