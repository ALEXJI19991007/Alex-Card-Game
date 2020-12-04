"use strict";

import React from "react";

export const Functionality = () => (
    <div>
        <ol>
            <li>(30 pts - mandatory) Code review.</li>
            <li>(20 pts - mandatory) Deployed with HTTPS.</li>
            <li>(10 pts) Enabled modification of user's profile.</li>
            <li>(10 pts) Fully working results page, players can see the detail of each move.</li>
            <li>(30 pts) Each move is clickable and renders the state of the game after the completion of that move (not playable).</li>
            <li>(40 pts) Autocomplete button enabled. Clickable when there are possible moves from the piles or discard to the stack</li>
            <li>(10 pts) Recognizes the end of the game (there are no moves from piles to the stacks and that there are no usable
                moves from the discard pile to the stacks). In this condition, the "End Game" button will be activated
                and you can end the game (then the game is no longer playable).
            </li>
            <li>(10 pts) Infinite undo / redo. The redo stack should always be cleared if the user plays a new move.</li>
            <li>(Last assignment) Selected cards will be highlighted</li>
            <li>(Last assignment) Clicking on white space or clicking on "ESC" deselects cards</li>
        </ol>
    </div>
);