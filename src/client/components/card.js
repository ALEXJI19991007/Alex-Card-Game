'use strict'

import React from 'react';

export const Card = ({card, top, left, onClick, pile, borderStyle}) => {
    const cardSource = card.up ? `${card.value}_of_${card.suit}.png` : "face_down.jpg";
    const cardId = `${card.suit}:${card.value}`;
    const cardInfo = {card: card, pile: pile, cardId: cardId};
    const hasBorder = borderStyle ? "solid 2px red" : "none";
    const cardStyle = {left: `${left}%`, top: `${top}px`, position: "absolute", height: "140px", width: "100px", border: hasBorder};
    return <img
        className="card-image"
        id={cardId}
        onClick={() => {onClick(cardInfo)}}
        src={require(`../../../public/images/${cardSource}`).default}
        style={cardStyle}
        alt={cardInfo}
    />
};