/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import React, {useEffect} from "react";
import {withRouter} from 'react-router-dom';

const Logout = (props) => {
    useEffect(() => {
        props.user.logOut(props.history);
    })

    return <div/>;
};

export default withRouter(Logout);