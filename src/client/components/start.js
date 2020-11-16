/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import React, {useEffect, useState} from "react";
import {withRouter} from "react-router";

export const Start = (props) => {
    let [state, setState] = useState({
        game: "klondike",
        draw: "Draw 1",
        color: "Red"
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/v1/game', {
            body: JSON.stringify({
                game: state.game,
                draw: state.draw,
                color: state.color
            }),
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            props.history.push(`/game/${data.id}`);
        } else {
            console.log(`Error: ${data.error}`);
        }
    }

    const onChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }

    return (
        <div className="row">
            <div className="col-sm-8 offset-sm-2">
                <h4>Create New Game</h4>
                <form className="form-horizontal row">
                    <div className="form-group col-sm-4">
                        <div className="radio">
                            <label>
                                <input type="radio" name="game" id="klondyke" value="klondyke" defaultChecked onChange={onChange}/>
                                Klondike
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" name="game" id="pyramid" value="pyramid" onChange={onChange}/>
                                Pyramid
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" name="game" id="canfield" value="canfield" onChange={onChange}/>
                                Canfield
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" name="game" id="golf" value="golf" onChange={onChange}/>
                                Golf
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" name="game" id="yukon" value="yukon" onChange={onChange}/>
                                Yukon
                            </label>
                        </div>
                    </div>
                    <div className="form-group col-sm-8 row">
                        <div className="col-sm-12">
                            <label className="control-label" htmlFor="draw">Draw:</label>
                            <select id="draw" name="draw" className="form-control" onChange={onChange}>
                                <option>Draw 1</option>
                                <option>Draw 3</option>
                            </select>
                        </div>
                        <div className="col-sm-12">
                            <label className="control-label" htmlFor="color">Card Color:</label>
                            <select id="color" name="color" className="form-control" onChange={onChange}>
                                <option>Red</option>
                                <option>Green</option>
                                <option>Blue</option>
                                <option>Magical</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group col-sm-12">
                        <button id="startBtn" className="btn btn-primary" type="submit" onClick={onSubmit}>
                            Start
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default withRouter(Start);