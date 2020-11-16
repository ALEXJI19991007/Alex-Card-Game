"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardState = require("./card_state");

const GameState = new Schema({
    pile1:      { type: [CardState] },
    pile2:      { type: [CardState] },
    pile3:      { type: [CardState] },
    pile4:      { type: [CardState] },
    pile5:      { type: [CardState] },
    pile6:      { type: [CardState] },
    pile7:      { type: [CardState] },
    stack1:     { type: [CardState] },
    stack2:     { type: [CardState] },
    stack3:     { type: [CardState] },
    stack4:     { type: [CardState] },
    draw:       { type: [CardState] },
    discard:    { type: [CardState] }
});

GameState.pre("validate", function (next) {
    next();
});

module.exports = mongoose.model("GameState", GameState);