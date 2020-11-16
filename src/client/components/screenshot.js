import React, {useEffect, useState} from "react";
import {withRouter} from 'react-router';

import {Pile} from "./pile";
import {cardRowGapStyle, cardRowStyle} from "./styles";

export const Screenshot = (props) => {
    const [state, setState] = useState({
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
        discard: []
    });

    useEffect(() => {
        fetch(`/v1/game/${props.match.params.id}/${props.match.params.index}`, {
            method: "GET",
        }).then(response => response.json()).then((data) => {
            setState({
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
                discard: data.state.discard
            });
        }).catch((error) => {
            console.log("Error: ", error);
        });
    }, []);

    const onCardClick = () => {}

    return (
        <div>
            <div className="card-row" style={cardRowStyle}>
                <Pile cards={state.stack1} spacing={0} id="stack1" onClick={onCardClick}/>
                <Pile cards={state.stack2} spacing={0} id="stack2" onClick={onCardClick}/>
                <Pile cards={state.stack3} spacing={0} id="stack3" onClick={onCardClick}/>
                <Pile cards={state.stack4} spacing={0} id="stack4" onClick={onCardClick}/>
                <div className="card-row-gap" style={cardRowGapStyle} onClick={onCardClick}>
                    <Pile cards={state.draw} spacing={0} id="draw" onClick={onCardClick}/>
                    <Pile cards={state.discard} spacing={0} id="discard" onClick={onCardClick}/>
                </div>
            </div>
            <div className="card-row" style={cardRowStyle}>
                <Pile cards={state.pile1} id="pile1" onClick={onCardClick}/>
                <Pile cards={state.pile2} id="pile2" onClick={onCardClick}/>
                <Pile cards={state.pile3} id="pile3" onClick={onCardClick}/>
                <Pile cards={state.pile4} id="pile4" onClick={onCardClick}/>
                <Pile cards={state.pile5} id="pile5" onClick={onCardClick}/>
                <Pile cards={state.pile6} id="pile6" onClick={onCardClick}/>
                <Pile cards={state.pile7} id="pile7" onClick={onCardClick}/>
            </div>
        </div>
    );
}

export default withRouter(Screenshot);