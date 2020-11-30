/* Copyright G. Hemingway, 2020 - All rights reserved */
"use strict";

const Joi = require("joi");
const {validateMove} = require("../../solitare");
const {initialState, shuffleCards} = require("../../solitare");

module.exports = (app) => {
    /**
     * Create a new game
     *
     * @param {req.body.game} Type of game to be played
     * @param {req.body.color} Color of cards
     * @param {req.body.draw} Number of cards to draw
     * @return {201 with { id: ID of new game }}
     */
    app.post("/v1/game", async (req, res) => {
        if (!req.session.user) {
            res.status(401).send({error: 'unauthorized'});
        } else {
            let schema = Joi.object().keys({
                game: Joi.string().lowercase().required(),
                color: Joi.string().lowercase().required(),
                draw: Joi.any()
            });
            try {
                let data = await schema.validateAsync(req.body, { stripUnknown: true });
                // newGame object
                let newGame = {
                    owner: req.session.user._id,
                    active: true,
                    cards_remaining: 52,
                    color: data.color,
                    game: data.game,
                    drawCount: data.draw === "Draw 1" ? 1 : 3,
                    score: 0,
                    start: Date.now(),
                    winner: "",
                    moves: [],
                    state: []
                };
                // Get the initial state of the game
                let myState = new app.models.GameState(initialState());
                // Push the state's object id into the array
                newGame.state.push(myState._id);
                // Get the new game
                let game = new app.models.Game(newGame);
                try {
                    // Save the initial state into database
                    await myState.save();
                    try {
                        // save the game into database
                        await game.save();
                        let query = {$push: {games: game._id}};
                        // Save the game to User table
                        app.models.User.findOneAndUpdate({_id: req.session.user._id}, query, () => {
                            res.status(201).send({
                                id: game._id
                            });
                        });
                    } catch (err) {
                        console.log(`Game Creation Failed: ${err.message}`);
                        res.status(400).send({error: "failure creating game"});
                    }
                } catch (err) {
                    console.log(`Initial Game State Creation Failed: ${err.message}`);
                    res.status(400).send({error: "failure creating initial game state"});
                }
            } catch (err) {
                console.log(err);
                const message = err.details[0].message;
                console.log(`Game.create validation failure: ${message}`);
                res.status(400).send({ error: message });
            }
        }
    });

    /**
     * Fetch game information
     *
     * @param (req.params.id} Id of game to fetch
     * @return {200} Game information
     */
    app.get("/v1/game/:id", async (req, res) => {
        if (!req.session.user) {
            res.status(401).send({error: 'unauthorized'});
        } else {
            try {
                let game = await app.models.Game.findById(req.params.id).populate("moves").populate("state");
                if (!game) {
                    res.status(404).send({ error: `Cannot Find Game: ${req.params.id}` });
                } else {
                    const curState = game.state[game.state.length - 1];
                    const cardsRemaining = 52 - curState.stack1.length - curState.stack2.length - curState.stack3.length - curState.stack4.length;
                    res.status(200).send({
                        id: game.id,
                        start: game.start,
                        state: game.state[game.state.length - 1],
                        active: game.active,
                        drawCount: game.drawCount,
                        score: game.score,
                        winner: game.winner,
                        moves: game.moves,
                        cards_remaining: cardsRemaining,
                    });
                }
            } catch (err) {
                console.log(err);
                res.status(404).send({ error: `unknown game: ${req.params.id}` });
            }
        }
    });

    /**
     * Fetch a particular screenshot of a game
     *
     * @param (req.params.id} Id of game to fetch
     * @return {200} Game information
     */
    app.get("/v1/game/:id/:index", async (req, res) => {
        if (!req.session.user) {
            res.status(401).send({error: 'unauthorized'});
        } else {
            try {
                let game = await app.models.Game.findById(req.params.id).populate("state");
                if (!game) {
                    res.status(404).send({ error: `Cannot Find Game: ${req.params.id}` });
                } else {
                    const curState = game.state[req.params.index];
                    res.status(200).send({
                        state: curState
                    });
                }
            } catch (err) {
                console.log(err);
                res.status(404).send({ error: `unknown move: ${req.params.id}` });
            }
        }
    });

    /**
     * Update game status
     *
     * @param (req.params.id} Id of game to update
     * @return {202} Game information
     */
    app.put("/v1/game/:id", async (req, res) => {
        let move = req.body;
        if (!req.session.user) {
            res.status(401).send({error: 'unauthorized'});
        } else {
            let game = await app.models.Game.findById(req.params.id).populate("owner").populate("state").exec();
            if (!game) {
                res.status(404).send({ error: `unknown game: ${req.params.id}` });
            } else if (game.owner.username !== move.player) {
                console.log("Owner: " + game.owner.username);
                console.log("Mover: " + move.player);
                res.status(401).send({error: 'unauthorized'});
            } else if (move.action === "move") {
                // Call function to validate the move
                // Will return a state after the move if it is valid, null otherwise
                let state = validateMove(game.state[move.curStateIndex], move);
                if (state !== null) {
                    // Create a new state model
                    let stateCreate = new app.models.GameState(state);
                    // Check if we have to delete overwritten states & moves
                    if (stateCreate.stateIndex < game.state.length) {
                        let stateToKeep = game.state.slice(0, stateCreate.stateIndex);
                        let stateToDelete = game.state.slice(stateCreate.stateIndex);
                        let movesToKeep = game.moves.slice(0, move.curStateIndex);
                        let movesToDelete = game.moves.slice(move.curStateIndex);
                        game.state = stateToKeep;
                        game.moves = movesToKeep;
                        // Delete state from DB
                        stateToDelete.map(async oneState => {
                            try {
                                await app.models.GameState.findByIdAndDelete(oneState._id);
                            } catch (err) {
                                console.log(`state-deletion failed: ${err.message}`);
                                res.status(500).send({error: "failure deleting state"});
                            }
                        })
                        // Delete move from DB
                        movesToDelete.map(async oneMove => {
                            try {
                                await app.models.Move.findByIdAndDelete(oneMove._id);
                            } catch (err) {
                                console.log(`move-deletion failed: ${err.message}`);
                                res.status(500).send({error: "failure deleting move"});
                            }
                        })
                    }
                    // Push the state to game.state
                    game.state.push(stateCreate._id);
                    let newMove = new app.models.Move(move);
                    game.moves.push(newMove._id);
                    game.score = game.state.stack1.length + game.state.stack2.length + game.state.stack3.length + game.state.stack4.length;
                    try {
                        await newMove.save();
                        await stateCreate.save();
                        try {
                            await game.save();
                            res.status(202).send(state);
                        } catch (err) {
                            console.log(`game-saving failed: ${err.message}`);
                            res.status(500).send({error: "failure update game"});
                        }
                    } catch (err) {
                        console.log(`move-saving failed: ${err.message}`);
                        res.status(500).send({error: "failure saving move"});
                    }
                } else {
                    res.status(400).send({error: "Invalid Move", state: state});
                }
            } else {
                game.active = false;
                try {
                    await game.save();
                    res.status(202).send({active: false});
                } catch (err) {
                    console.log(`game-saving failed: ${err.message}`);
                    res.status(500).send({error: "failure update game"});
                }
            }
        }
    });

    /**
     * Undo a move
     *
     * @param (req.params.id} Id of game to update
     * @return {200} Game information
     */
    app.post("/v1/game/:id", async (req, res) => {
        let action = req.body;
        if (!req.session.user) {
            res.status(401).send({error: 'unauthorized'});
        } else {
            let game = await app.models.Game.findById(req.params.id).populate("owner").populate("state").exec();
            if (!game) {
                res.status(404).send({ error: `unknown game: ${req.params.id}` });
            } else if (game.owner.username !== action.player) {
                console.log("Owner: " + game.owner.username);
                console.log("Mover: " + action.player);
                res.status(401).send({error: 'unauthorized'});
            } else if (action.moveType === "undo") {
                // Get the previous state
                let prevState = game.state[action.curStateIndex - 1];
                res.status(202).send(prevState);
            } else if (action.moveType === "redo") {
                // Get the next state
                if (action.curStateIndex === game.state.length - 1) {
                    res.status(202).send(game.state[action.curStateIndex]);
                } else {
                    let nextState = game.state[action.curStateIndex + 1];
                    res.status(202).send(nextState);
                }
            } else {
                res.status(400).send({error: "Invalid Action"});
            }
        }
    });

    // Provide end-point to request shuffled deck of cards and initial state - for testing
    app.get("/v1/cards/shuffle", (req, res) => {
        res.send(shuffleCards(false));
    });
    app.get("/v1/cards/initial", (req, res) => {
        res.send(initialState());
    });
};
