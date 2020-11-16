/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import React, {useEffect, useState} from "react";
import {Link, withRouter} from 'react-router-dom';
import md5 from "md5";
import {InfoBlock, InfoData, InfoLabels, ProfileBlockBase, ProfileImage, ShortP} from "./styles";

const gravatarImg = (email, size) => {
    // 1. Trim white space at the start and the end
    // 2. Change to lower case
    // 3. Use md5 to get the hash
    let gravHash = md5(email.replace(/^\s+|\s+$/gm, '').toLowerCase());
    // Get the gravatar image.
    return `https://www.gravatar.com/avatar/${gravHash}?s=${size}`;
}

const Game = ({game, index}) => {
    let date = new Date(game.start);
    const activeUrl = game.active ? `/game/${game._id}` : `/results/${game._id}`;
    const resultsUrl = `/results/${game._id}`;
    return (
        <tr key={index}>
            <th>{game.active ? "Active" : "Complete"}</th>
            <th><Link to={activeUrl}>{"Game"}</Link> / <Link to={resultsUrl}>{"Result"}</Link></th>
            <th>{date.toLocaleString()}</th>
            <th>{game.moves.length}</th>
            <th>{game.score}</th>
            <th>{game.game}</th>
        </tr>
    );
};

// get all the game records and convert them to Record objects
const gameRecords = games => {
    return games.map((game, index) => (
        <Game key={index} game={game} index={index}/>
    ));
}

const editProfile = (userNameOnPage, userLoggedIn) => {
    return userNameOnPage === userLoggedIn ?
        <Link to={`/profile/${userNameOnPage}/edit`}>Edit Profile</Link>
        : undefined;
}

const startGame = (userNameOnPage, userLoggedIn) => {
    return userNameOnPage === userLoggedIn ?
        <Link to="/start">Start new game</Link>
        : undefined;
}

const ProfileBlock = props => {
    return (
        <ProfileBlockBase>
            <ProfileImage src={gravatarImg(props.primaryEmail, 200)}/>
            <InfoBlock>
                <InfoLabels>
                    <p>Username:</p>
                    <p>First Name:</p>
                    <p>Last Name:</p>
                    <p>City:</p>
                    <p>Email Address:</p>
                </InfoLabels>
                <InfoData>
                    <ShortP>{props.username}</ShortP>
                    <ShortP>{props.firstname}</ShortP>
                    <ShortP>{props.lastname}</ShortP>
                    <ShortP>{props.city}</ShortP>
                    <ShortP>{props.primaryEmail}</ShortP>
                </InfoData>
            </InfoBlock>
        </ProfileBlockBase>
    );
};

export const Profile = props => {
    const [state, setState] = useState({
        username: "",
        firstname: "",
        lastname: "",
        city: "",
        primaryEmail: "",
        games: [],
    });

    useEffect(() => {
        fetch(`/v1/user/${props.match.params.username}`, {
            method: "GET",
        }).then(response => response.json()).then((data) => {
            setState({
                username: data.username,
                firstname: data.first_name,
                lastname: data.last_name,
                city: data.city,
                primaryEmail: data.primary_email,
                games: data.games
            })
        }).catch((error) => {
            console.log("Error: ", error);
        });
    }, []);

    return (
        <div className="row">
            <div className="col-sm-2">
                <h5>Player Profile</h5>
                {editProfile(props.match.params.username, props.username)}
            </div>
            <div className="col-sm-8">
                <ProfileBlock {...state} />
                <div className="row">
                    <div className="col-sm-12">
                        <h4>Games Played ({state.games.length}):</h4>
                        {startGame(props.match.params.username, props.username)}
                    </div>
                    <table id="gameTable" className="col-sm-12 table">
                        <thead>
                        <tr>
                            <th>Status</th>
                            <th>Show Game / Result</th>
                            <th>Start Date</th>
                            <th># of moves</th>
                            <th>Score</th>
                            <th>Game Type</th>
                        </tr>
                        </thead>
                        <tbody id="games">{gameRecords(state.games)}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default withRouter(Profile);