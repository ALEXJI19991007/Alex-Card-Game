/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import React from "react";
import {withRouter} from 'react-router';

import {Pile} from "./pile";
import {autoCompleteButtonStyle, cardRowGapStyle, cardRowStyle} from "./styles";

export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pile1: [],
            pile2: [],
            pile3: [],
            pile4: [],
            pile5: [],
            pile6: [],
            pile7: [],
            stack1: [],
            stack2: [],
            stack3: [],
            stack4: [],
            draw: [],
            discard: [],
            selectedPile: "",
            selectedRange: [-1, -1],
            srcCard: null,
            dstCard: null,
            drawCount: null,
            stateIndex: null,
        };

        this.onCardClick = this.onCardClick.bind(this);
        this.onBackgroundClick = this.onBackgroundClick.bind(this);
        this.sendMove = this.sendMove.bind(this);
        this.onPressEsc = this.onPressEsc.bind(this);
        this.autoComplete = this.autoComplete.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
    }

    componentDidMount() {
        fetch(`/v1/game/${this.props.match.params.id}`, {
            method: "GET",
        }).then(response => response.json()).then((data) => {
            this.setState({
                pile1: data.state.pile1,
                pile2: data.state.pile2,
                pile3: data.state.pile3,
                pile4: data.state.pile4,
                pile5: data.state.pile5,
                pile6: data.state.pile6,
                pile7: data.state.pile7,
                stack1: data.state.stack1,
                stack2: data.state.stack2,
                stack3: data.state.stack3,
                stack4: data.state.stack4,
                draw: data.state.draw,
                discard: data.state.discard,
                drawCount: data.drawCount,
                stateIndex: data.state.stateIndex
            });
            document.addEventListener("keydown", this.onPressEsc, false);
        }).catch((error) => {
            console.log("Error: ", error);
        });
    }

    async onCardClick(cardInfo) {
        let isSelectedCard = cardInfo.hasOwnProperty("card");
        let isSrcCardUnselected = this.state.srcCard === null;

        let move = null;
        if (cardInfo.pile === "draw" && isSelectedCard && isSrcCardUnselected) {
            console.log("Draw Cards");
            move = {
                cards: this.state.draw.slice(-this.state.drawCount),
                src: "draw",
                dst: "discard"
            };
            this.setState({
                selectedPile: "",
                selectedRange: [-1, -1],
                srcCard: null,
                dstCard: null
            });
            await this.sendMove(move);
        } else if (cardInfo.pile === "draw" && this.state.draw.length === 0) {
            console.log("Reset Draw Pile");
            move = {
                cards: this.state.discard.slice().reverse(),
                src: "discard",
                dst: "draw"
            }
            this.setState({
                srcCard: null,
                dstCard: null
            });
            await this.sendMove(move);
        } else if (isSrcCardUnselected && isSelectedCard && cardInfo.card.up) {
            console.log("Set First Card");
            let srcPile = this.state[cardInfo.pile];
            let cardIndex = srcPile.indexOf(cardInfo.card);
            this.setState({
                srcCard: cardInfo,
                selectedPile: cardInfo.pile,
                selectedRange: [cardIndex, srcPile.length - 1]
            });
        } else if ((isSelectedCard && !cardInfo.card.up) || isSrcCardUnselected || this.state.srcCard.pile === cardInfo.pile) {
            console.log("Illegal Move");
            this.setState({
                selectedPile: "",
                selectedRange: [-1, -1],
                srcCard: null,
                dstCard: null
            });
        } else {
            console.log("Execute Move");
            let srcPile = this.state.srcCard.pile;
            let cardIndex = this.state[srcPile].indexOf(this.state.srcCard.card);
            move = {
                cards: this.state[srcPile].slice(cardIndex),
                src: srcPile,
                dst: cardInfo.pile
            }
            this.setState({
                selectedPile: "",
                selectedRange: [-1, -1],
                srcCard: null,
                dstCard: null
            });
            await this.sendMove(move);
        }
    }

    async sendMove(move) {
        move.player = this.props.username;
        move.curStateIndex = this.state.stateIndex;
        let response = await fetch(`/v1/game/${this.props.match.params.id}`, {
            method: "PUT",
            body: JSON.stringify(move),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.status === 202) {
            console.log(move);
            let data = await response.json();
            this.setState({
                pile1: data.pile1,
                pile2: data.pile2,
                pile3: data.pile3,
                pile4: data.pile4,
                pile5: data.pile5,
                pile6: data.pile6,
                pile7: data.pile7,
                stack1: data.stack1,
                stack2: data.stack2,
                stack3: data.stack3,
                stack4: data.stack4,
                draw: data.draw,
                discard: data.discard,
                stateIndex: data.stateIndex
            });
            return true;
        }
        return false;
    }

    onBackgroundClick(event) {
        let target = event.target;
        if (!target.classList.contains("card-image") && !target.classList.contains("card-pile") && this.state.srcCard !== null) {
            this.setState({
                selectedPile: "",
                selectedRange: [-1, -1],
                srcCard: null,
                dstCard: null
            });
        }
    }

    onPressEsc(event) {
        if (event.keyCode === 27) {
            this.onBackgroundClick(event);
        }
    }

    validatePileToStack(srcCards, dstStackName) {
        if (srcCards.length === 0) {
            return false;
        }
        let dstStack = this.state[dstStackName];
        let srcCard = srcCards[0];

        // Case 1: Empty dstStack
        if (dstStack.length === 0) {
            return srcCard.value === "ace";
        }
        let dstCard = dstStack[dstStack.length - 1];

        // Case 2: Occupied Stack
        if (srcCard.suit !== dstCard.suit) {
            return false;
        }

        // Case 3: Legal Moves (srcCard = dstCard + 1)
        // 3.1: Ace, Jack, Queen, King Involved
        let kingToQueen = srcCard.value === "king" && dstCard.value === "queen";
        let queenToJack = srcCard.value === "queen" && dstCard.value === "jack";
        let jackToTen = srcCard.value === "jack" && dstCard.value === "10";
        let twoToAce = srcCard.value === "2" && dstCard.value === "ace";
        // 3.2: Normal Numbers
        // Case 4: Other Illegal Moves
        return kingToQueen || queenToJack || jackToTen || twoToAce || srcCard.value - dstCard.value === 1;
    }

    async autoComplete(event) {
        event.preventDefault();
        let movedLastRound = true;
        while (movedLastRound) {
            movedLastRound = false;
            for (let i = 1; i <= 7; ++i) {
                let srcPile = this.state[`pile${i}`];
                let srcCards = srcPile.slice(-1);
                for (let j = 1; j <= 4; ++j) {
                    if (this.validatePileToStack(srcCards, `stack${j}`)) {
                        let moved = await this.sendMove({
                            cards: srcCards,
                            src: `pile${i}`,
                            dst: `stack${j}`
                        });
                        if (moved) {
                            movedLastRound = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    async undo(event) {
        event.preventDefault();
        if (this.state.stateIndex === 0) {
            return;
        }
        let undoMove = {
            player: this.props.username,
            curStateIndex: this.state.stateIndex,
            moveType: "undo"
        }
        let response = await fetch(`/v1/game/${this.props.match.params.id}`, {
            method: "POST",
            body: JSON.stringify(undoMove),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.status === 202) {
            let data = await response.json();
            console.log(`Undo to state ${data.stateIndex}`);
            this.setState({
                pile1: data.pile1,
                pile2: data.pile2,
                pile3: data.pile3,
                pile4: data.pile4,
                pile5: data.pile5,
                pile6: data.pile6,
                pile7: data.pile7,
                stack1: data.stack1,
                stack2: data.stack2,
                stack3: data.stack3,
                stack4: data.stack4,
                draw: data.draw,
                discard: data.discard,
                stateIndex: data.stateIndex
            });
        }
    }

    async redo(event) {
        event.preventDefault();
        let redoMove = {
            player: this.props.username,
            curStateIndex: this.state.stateIndex,
            moveType: "redo"
        }
        let response = await fetch(`/v1/game/${this.props.match.params.id}`, {
            method: "POST",
            body: JSON.stringify(redoMove),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.status === 202) {
            let data = await response.json();
            console.log(`Redo to state ${data.stateIndex}`);
            this.setState({
                pile1: data.pile1,
                pile2: data.pile2,
                pile3: data.pile3,
                pile4: data.pile4,
                pile5: data.pile5,
                pile6: data.pile6,
                pile7: data.pile7,
                stack1: data.stack1,
                stack2: data.stack2,
                stack3: data.stack3,
                stack4: data.stack4,
                draw: data.draw,
                discard: data.discard,
                stateIndex: data.stateIndex
            });
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-2">
                    <button id="btn" className="btn btn-primary" style={autoCompleteButtonStyle} onClick={this.autoComplete}>
                        Auto-Complete
                    </button>
                    <button id="btn" className="btn btn-primary" style={autoCompleteButtonStyle} onClick={this.undo}>
                        Undo
                    </button>
                    <button id="btn" className="btn btn-primary" style={autoCompleteButtonStyle} onClick={this.redo}>
                        Redo
                    </button>
                </div>
                <div className="col-sm-8" onClick={this.onBackgroundClick}>
                    <div className="card-row" style={cardRowStyle} onClick={this.onBackgroundClick}>
                        <Pile cards={this.state.stack1} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} spacing={0} id="stack1" onClick={this.onCardClick}/>
                        <Pile cards={this.state.stack2} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} spacing={0} id="stack2" onClick={this.onCardClick}/>
                        <Pile cards={this.state.stack3} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} spacing={0} id="stack3" onClick={this.onCardClick}/>
                        <Pile cards={this.state.stack4} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} spacing={0} id="stack4" onClick={this.onCardClick}/>
                        <div className="card-row-gap" style={cardRowGapStyle} onClick={this.onBackgroundClick}>
                            <Pile cards={this.state.draw} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} spacing={0} id="draw" onClick={this.onCardClick}/>
                            <Pile cards={this.state.discard} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} spacing={0} id="discard" onClick={this.onCardClick}/>
                        </div>
                    </div>
                    <div className="card-row" style={cardRowStyle} onClick={this.onBackgroundClick}>
                        <Pile cards={this.state.pile1} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} id="pile1" onClick={this.onCardClick}/>
                        <Pile cards={this.state.pile2} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} id="pile2" onClick={this.onCardClick}/>
                        <Pile cards={this.state.pile3} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} id="pile3" onClick={this.onCardClick}/>
                        <Pile cards={this.state.pile4} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} id="pile4" onClick={this.onCardClick}/>
                        <Pile cards={this.state.pile5} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} id="pile5" onClick={this.onCardClick}/>
                        <Pile cards={this.state.pile6} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} id="pile6" onClick={this.onCardClick}/>
                        <Pile cards={this.state.pile7} selectedPile={this.state.selectedPile} selectedRange={this.state.selectedRange} id="pile7" onClick={this.onCardClick}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Game);