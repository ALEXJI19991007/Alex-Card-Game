'use strict'

import React from 'react';
import {Card} from './card';
import PropTypes from "prop-types";

import styled from "styled-components";
import {CardPile} from "./styles";

export const Pile = props => {
    const cards = props.cards.map((card, index) => {
        let top = props.horizontal ? 0 : index * props.spacing;
        let left = props.horizontal ? index * props.spacing : 0;
        let isSelected = props.selectedRange && index >= props.selectedRange[0] && index <= props.selectedRange[1] && props.id === props.selectedPile;
        return <Card
            key={index}
            card={card}
            up={props.up}
            top={top}
            left={left}
            pile={props.id}
            borderStyle={isSelected}
            onClick={props.onClick}
        />;
    });
    let pileSize = props.cards.length;
    let frameHeight = props.spacing === 0 ? 140 : 20 * (pileSize - 1) + 140;

    return (
        <CardPile>
            <div className="card-pile-frame"
                 id={props.id}
                 style={{height: frameHeight + "px"}}
                 onClick={() => {
                     if (cards.length === 0) props.onClick({pile: props.id})
                 }}
            />
            {cards}
        </CardPile>
    );
}

Pile.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedPile: PropTypes.string,
    selectedRange: PropTypes.array,
    onClick: PropTypes.func,
    horizontal: PropTypes.bool,
    spacing: PropTypes.number,
    maxCards: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number
};

Pile.defaultProps = {
    horizontal: false,
    spacing: 20,
};