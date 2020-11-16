/* Copyright G. Hemingway, 2020 - All rights reserved */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Game Model *******************/

/* Schema for overall game - not completely Klondike specific */
const Game = new Schema({
    owner:      { type: Schema.ObjectId, ref: "User", required: true },
    start:      { type: Date },
    end:        { type: Date },
    state:      [{ type: Schema.ObjectId, ref: "GameState" }],
    game:       { type: String, required: true, enum: ["klondike", "pyramid", "canfield", "golf", "yukon", "hearts"]},
    active:     { type: Boolean, default: true },
    color:      { type: String, default: "red" },
    drawCount:  { type: Number, default: 1 },
    score:      { type: Number, default: 0 },
    winner:     { type: String, default: "" },
    moves:      [{type: Schema.ObjectId, ref: "Move" }]
});

Game.pre("validate", function (next) {
    this.start = Date.now();
    next();
});

module.exports = mongoose.model("Game", Game);
