/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import React from "react";
import {withRouter} from 'react-router';

import {Pile} from "./pile";
import {cardRowGapStyle, cardRowStyle} from "./styles";

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
        };

        this.onCardClick = this.onCardClick.bind(this);
        this.onBackgroundClick = this.onBackgroundClick.bind(this);
        this.sendMove = this.sendMove.bind(this);
        this.onPressEsc = this.onPressEsc.bind(this);
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
            });
        }).catch((error) => {
            console.log("Error: ", error);
        });
    }

    onCardClick(cardInfo) {
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
            this.sendMove(move);
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
            this.sendMove(move);
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
            this.sendMove(move);
        }
    }

    sendMove(move) {
        console.log(move);
        move.player = this.props.username;
        fetch(`/v1/game/${this.props.match.params.id}`, {
            method: "PUT",
            body: JSON.stringify(move),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (response.status === 202) {
                response.json().then(data => {
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
                    });
                });
            }
        }).catch((error) => {
            console.log("Error: ", error);
        });
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

    render() {
        return (
            <div onClick={this.onBackgroundClick} onKeyDown={this.onPressEsc}>
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
        );
    }
}

export default withRouter(Game);