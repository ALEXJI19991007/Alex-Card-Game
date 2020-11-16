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
                let data = await schema.validateAsync(req.body);
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
                newGame.state.push(initialState());
                let game = new app.models.Game(newGame);
                // Save the game into database
                try {
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
                let errMsg = err.details[0].message;
                console.log(`Game Creation Error: ${errMsg}`);
                res.status(400).send({error: errMsg});
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
                let game = await app.models.Game.findById(req.params.id).populate("moves");
                if (!game) {
                    res.status(404).send({ error: `Cannot Find Game: ${req.params.id}` });
                } else {
                    const curState = game.state[0];
                    const cardsRemaining = 52 - curState.stack1.length - curState.stack2.length - curState.stack3.length - curState.stack4.length;
                    res.status(200).send({
                        id: game.id,
                        start: game.start,
                        state: game.state[0],
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
                let game = await app.models.Game.findById(req.params.id).populate("moves");
                if (!game) {
                    res.status(404).send({ error: `Cannot Find Game: ${req.params.id}` });
                } else {
                    const stateSize = game.state.length;
                    const curState = game.state[stateSize - req.params.index - 1];
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
     * @return {200} Game information
     */
    app.put("/v1/game/:id", async (req, res) => {
        let move = req.body;
        if (!req.session.user) {
            res.status(401).send({error: 'unauthorized'});
        } else {
            let game = await app.models.Game.findById(req.params.id).populate("owner").exec();
            if (!game) {
                res.status(404).send({ error: `unknown game: ${req.params.id}` });
            } else if (game.owner.username !== move.player) {
                console.log("Owner: " + game.owner.username);
                console.log("Mover: " + move.player);
                res.status(401).send({error: 'unauthorized'});
            } else {
                let state = game.state[0];
                if (validateMove(state, move)) {
                    let src = move.src;
                    let dst = move.dst;
                    let cards = move.cards;
                    // Update state
                    state[src] = state[src].slice(0, -cards.length);
                    state[dst] = state[dst].concat(cards);
                    // Change the bottom card to face upwards if needed
                    if (src !== "draw" && state[src].length > 0) {
                        state[src][state[src].length - 1].up = true;
                    }
                    // Make sure all cards in the draw pile is facing downwards
                    if (dst === "draw") {
                        for (let i = 0; i < state["draw"].length; ++i) {
                            state["draw"][i].up = false;
                        }
                    }
                    // Change the top card in discard pile to face upwards
                    if (state["discard"].length > 0) {
                        state["discard"][state["discard"].length - 1].up = true;
                    }
                    // Push the state to game.state (to the left)
                    // Note that unshift has time complexity O(1) since it is a deque
                    game.state.unshift(state);
                    let newMove = new app.models.Move(move);
                    game.moves.push(newMove._id);
                    try {
                        await newMove.save();
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
                    res.status(400).send({ error: "Invalid Move", state: state });
                }
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
