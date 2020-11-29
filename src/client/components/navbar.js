'use strict'

import React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from "react-router";

import {gravatarImg} from "../main";
import {Bar, landingContainerStyle, RightNav, topLinkStyle} from "./styles";

const Navbar = props => {
    const user = props.user.getUser();
    let rightOptions;
    let link = `/profile/${user.username}`;
    if (user.username !== "") {
        rightOptions = <div className="header">
            <Link to="/logout" style={{color: "white"}}>Log Out</Link>
            <Link to={link} style={{marginLeft: "10px"}}>
                <img src={gravatarImg(user.primary_email, 40)} alt="gravatar image"/>
            </Link>
        </div>;
    } else {
        rightOptions = <RightNav className="col-xs-4">
            <Link to="/login" style={{display: "block", color: "white"}}>Log In</Link>
            <Link to="/register" style={{display: "block", color: "white"}}>Register</Link>
        </RightNav>;
    }
    return (
        <Bar className="navbar navbar-default navbar-static-top">
            <div className="col-xs-8">
                <Link to={"/"} style={topLinkStyle}>Home</Link>
                <a href="https://www.linkedin.com/in/yu-ji-97a606192/" style={topLinkStyle}>Developer Profile</a>
                <a href="https://en.wikipedia.org/wiki/Card_game" style={topLinkStyle}>About Card Game</a>
            </div>
            {rightOptions}
        </Bar>
    );
}

export default withRouter(Navbar);