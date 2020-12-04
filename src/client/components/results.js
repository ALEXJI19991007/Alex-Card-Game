/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import React, {useEffect, useState} from "react";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";

const generalResult = (duration, numMoves, points, cardsRemaining, ableToMove) => {
    let hours = Math.floor(duration / 3600);
    duration = Math.floor(duration % 3600);
    let minutes = Math.floor(duration / 60);
    let seconds = duration % 60;
    return (
        <div className="col-sm-6">
            <p>{hours} hours, {minutes} minutes, {seconds} seconds</p>
            <p>{numMoves}</p>
            <p>{points}</p>
            <p>{cardsRemaining}</p>
            <p>{ableToMove ? "Active" : "Finished"}</p>
        </div>
    );
}

const Move = ({gameId, move, index}) => {
    const url = `/screenshot/${gameId}/${index}`;
    const text = `${move.cards[0].suit} ${move.cards[0].value}, ${move.src} to ${move.dst}`;
    return (
        <tr key={index}>
            <th>{index}</th>
            <th><Link to={`/profile/${move.player}`}>{move.player}</Link></th>
            <th><Link to={{pathname: url}}>{text}</Link></th>
        </tr>
    );
}

const moveDetail = (id, moves) => {
    return moves.map((move, index) => {
        return <Move gameId={id} key={index} move={move} index={index + 1}/>
    });
};

export const Results = (props) => {
    const [state, setState] = useState({
        duration: 0,
        numMoves: 0,
        points: 0,
        cardsRemaining: 0,
        ableToMove: 0,
        moves: []
    });

    useEffect(() => {
        fetch(`/v1/game/${props.match.params.id}`, {
            method: "GET",
        }).then(response => response.json()).then((data) => {
            setState({
                duration: ((new Date(Date.now())) - (new Date(data.start))) / 1000,
                numMoves: data.moves.length,
                points: data.score,
                cardsRemaining: data.cards_remaining,
                ableToMove: data.active,
                moves: data.moves
            });
        }).catch((error) => {
            console.log("Error: ", error);
        });
    }, []);

    return (
        <div className="row" style={{marginTop: "20px"}}>
            <div className="col-sm-2"><h5>Game Detail</h5></div>
            <div className="col-sm-10">
                <div className="row">
                    <div className="col-sm-3 text-right">
                        <p><b>Last Played:</b></p>
                        <p><b>Number of Moves:</b></p>
                        <p><b>Points:</b></p>
                        <p><b>Cards Remaining:</b></p>
                        <p><b>Able to Move:</b></p>
                    </div>
                    {generalResult(state.duration, state.numMoves, state.points, state.cardsRemaining, state.ableToMove)}
                </div>
                <div className="row">
                    <table id="gameTable" className="col-sm-8 table">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Player</th>
                            <th>Move Details</th>
                        </tr>
                        </thead>
                        <tbody>{moveDetail(props.match.params.id, state.moves)}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default withRouter(Results);