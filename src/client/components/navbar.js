'use strict'

import React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from "react-router";

import {gravatarImg} from "../main";
import styled from "styled-components";

const Bar = styled.div`
        margin-bottom: 1em;
    `;

const RightNav = styled.div`
        text-align: right;
        padding-top: 10px;
        padding-right: 20px;
    `;


const Navbar = props => {
    const user = props.user.getUser();
    let rightOptions;
    let link = `/profile/${user.username}`;
    if (user.username !== "") {
        rightOptions = <div className="header">
            <Link to="/logout">Log Out</Link>
            <Link to={link} style={{marginLeft: "10px"}}>
                <img src={gravatarImg(user.primary_email, 40)} alt="gravatar image"/>
            </Link>
        </div>;
    } else {
        rightOptions = <RightNav className="col-xs-4">
            <Link to="/login" style={{display: "block"}}>Log In</Link>
            <Link to="/register" style={{display: "block"}}>Register</Link>
        </RightNav>;
    }
    return (
        <Bar className="navbar navbar-default navbar-static-top">
            <div className="col-xs-8">
                <h2>Graham's Solitaire</h2>
            </div>
            {rightOptions}
        </Bar>
    );
}

export default withRouter(Navbar);