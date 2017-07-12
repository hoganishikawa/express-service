"use strict";

var mongoose = require("mongoose"),
    //config = require("../../config"),
    //uniqueValidator = require("mongoose-unique-validator"),
    //consts = require("../../libs/consts"),
    Schema = mongoose.Schema;

module.exports = function() {
    var manufacturerSchema = new Schema({
        name: { type: String, required: true}
    });

    mongoose.model("manufacturer", manufacturerSchema);
};