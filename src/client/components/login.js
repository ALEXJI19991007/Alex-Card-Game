/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import React, {useState} from "react";
import {withRouter} from "react-router";

export const Login = (props) => {
    const [state, setState] = useState({
        username: "",
        password: ""
    });
    const [loginError, setLoginError] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        if (state.username.length === 0) {
            setLoginError("Error: Empty Username");
        } else if (state.password.length === 0) {
            setLoginError("Error: Empty Password");
        } else {
            const response = await fetch('/v1/session', {
                body: JSON.stringify(state),
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.status === 401) {
                setLoginError("Invalid Username or Password");
            } else if (response.status === 400) {
                setLoginError("Session Validation Error");
            } else if (response.status === 500) {
                setLoginError("Session Validation Error");
            } else {
                props.logIn.logInHandler(props.history, data);
            }
        }
    };

    const onClick = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }

    return (
        <div className="row">
            <div className="col-sm-12 mx-auto">
                <div id="errorMsg" className="bg-danger" style={{textAlign: "center"}}>{loginError}</div>
            </div>
            <div className="col-sm-8 offset-sm-2">
                <form className="form-horizontal">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="username">Username:</label>
                        <div className="col-sm-10">
                            <input className="form-control" id="username" name="username" type="text"
                                   placeholder="Username" onChange={onClick}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="password">Password:</label>
                        <div className="col-sm-10">
                            <input className="form-control" id="password" name="password" type="password"
                                   placeholder="Password" onChange={onClick}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="offset-sm-2 col-sm-10">
                            <button id="submitBtn" className="btn btn-primary" onClick={onSubmit}>Login</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="col-sm-2"/>
        </div>
    );
};

export default withRouter(Login);