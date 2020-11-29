/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import React, {useState} from "react";
import {withRouter} from "react-router";

import {validUsername, validPassword} from "../../shared/index";
import styled from "styled-components";

export const Register = (props) => {
    const [state, setState] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        city: "",
        primary_email: "",
    });
    const [registerError, setRegisterError] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        // Use onChange method to record the input
        let checkValidUsername = validUsername(state.username);
        let checkValidPassword = validPassword(state.password);
        if (typeof checkValidUsername !== "undefined") {
            setRegisterError(`Error: ${checkValidUsername.error}`);
        } else if (typeof checkValidPassword !== "undefined") {
            setRegisterError(`Error: ${checkValidPassword.error}`);
        } else {
            const response = await fetch(`/v1/user`, {
                method: 'POST',
                body: JSON.stringify(state),
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                props.history.push("/login");
            } else {
                console.log(data.error);
                setRegisterError(`Error: ${data.error}`);
            }
        }
    }

    const onClick = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }

    return (
        <div className="row" style={{marginTop: "50px"}}>
            <div className="col-sm-12 mx-auto">
                <div id="errorMsg" className="bg-danger" style={{textAlign: "center"}}>{registerError}</div>
            </div>
            <div className="col-sm-8 offset-sm-2">
                <form className="form-horizontal">
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="username">Username:</label>
                        <div className="col-sm-9">
                            <input className="form-control" id="username" name="username" type="text"
                                   placeholder="Username" onChange={onClick}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="first_name">First Name:</label>
                        <div className="col-sm-9">
                            <input className="form-control" id="first_name" name="first_name" type="text"
                                   placeholder="First Name" onChange={onClick}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="last_name">Last Name:</label>
                        <div className="col-sm-9">
                            <input className="form-control" id="last_name" name="last_name" type="text"
                                   placeholder="Last Name" onChange={onClick}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="city">City:</label>
                        <div className="col-sm-9">
                            <input className="form-control" id="city" name="city" type="text" placeholder="City" onChange={onClick}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="primary_email">Email:</label>
                        <div className="col-sm-9">
                            <input className="form-control" id="primary_email" name="primary_email" type="email"
                                   placeholder="Email Address" onChange={onClick}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="password">Password:</label>
                        <div className="col-sm-9">
                            <input className="form-control" id="password" name="password" type="password"
                                   placeholder="Password" onChange={onClick}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="offset-sm-3 col-sm-9">
                            <button id="submitBtn" className="btn btn-primary" type="submit"
                                    onClick={onSubmit}>Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="col-sm-2"/>
        </div>
    );
};

export default withRouter(Register);