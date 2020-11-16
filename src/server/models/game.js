/* Copyright G. Hemingway, 2020 - All rights reserved */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardState = require("./card_state");
//const GameMove = require("./move");

/***************** Game Model *******************/

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
    discard:    { type: [CardState] },
    draw:       { type: [CardState] }
}, { _id: false });

/* Schema for overall game - not completely Klondike specific */
const Game = new Schema({
    owner:      { type: Schema.ObjectId, ref: "User", required: true },
    start:      { type: Date },
    end:        { type: Date },
    state:      { type: [GameState] },
    game:       { type: String, required: true, enum: ["klondike", "pyramid", "canfield", "golf", "yukon", "hearts"]},
    active:     { type: Boolean, default: true },
    color:      { type: String, default: "red" },
    drawCount:  { type: Number, default: 1 },
    score:      { type: Number, default: 0 },
    winner:     { type: String, default: "" },
    moves:      [{type: Schema.ObjectId, ref: "Move"}]
});

Game.pre("validate", function (next) {
    this.start = Date.now();
    next();
});

module.exports = mongoose.model("Game", Game);
