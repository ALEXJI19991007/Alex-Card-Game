/* Copyright G. Hemingway, 2020 - All rights reserved */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardState = require("./card_state");

/***************** Move Model *******************/

/* Schema for an individual move of Klondike */
const Move = new Schema({
    cards:      { type: [CardState] },
    player:     { type: String },
    src:        { type: String },
    dst:        { type: String }
});

Move.pre("validate", function (next) {
    this.start = Date.now();
    next();
});

module.exports = mongoose.model("Move", Move);
