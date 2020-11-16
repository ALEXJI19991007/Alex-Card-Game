/* Copyright G. Hemingway, @2020 - All rights reserved */
"use strict";

import "../../node_modules/bootstrap/dist/css/bootstrap.css";

import md5 from "md5";

import React, {useState} from "react";
import {render} from "react-dom";
import {BrowserRouter, Route, Redirect} from "react-router-dom";

import {Landing} from "./components/landing";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register";
import Profile from "./components/profile";
import Game from "./components/game";
import Start from "./components/start";
import Logout from "./components/logout";
import Results from "./components/results";
import Edit from "./components/edit";

export class User {
  constructor(username, primary_email) {
    this.userData = {
      username: username ? username : "",
      primary_email: primary_email ? primary_email : ""
    }
  }

  getUser() {
    return this.userData;
  }

  logInHandler(router, userData) {
    this.userData = userData;
    sessionStorage.setItem("user", JSON.stringify(this));
    router.push(`/profile/${userData.username}`);
  }

  logOut(router) {
    this.userData = {
      username: "",
      primary_email: ""
    }
    sessionStorage.removeItem("user");
    router.push("/login");
  }

  isLoggedIn() {
    return this.userData.username.length > 0 && this.userData.primary_email.length > 0;
  }
}

const MyApp = () => {
  let curUser = JSON.parse(sessionStorage.getItem("user"));

  const [user, setUser] = useState(curUser === null ?
      new User() : new User(curUser.userData.username, curUser.userData.primary_email));

  return (
      <BrowserRouter>
        <div>
          <Navbar user={user}/>
          <Route exact path="/" component={Landing}/>
          <Route exact path="/register" render={props => <Register {...props}/>}/>
          <Route exact path="/login" render={props => <Login {...props} logIn={user}/>}/>
          <Route exact path="/logout" render={props => <Logout {...props} user={user}/>}/>
          <Route exact path="/profile/:username" render={props => <Profile {...props} username={user.userData.username}/>}/>
          <Route exact path="/profile/:username/edit" render={props => <Edit {...props} username={user.userData.username}/>}/>
          <Route exact path="/start" render={props => {
            return user.isLoggedIn() ? <Start {...props} user={user}/> :
                <Login {...props} logIn={user}/>
          }}/>
          <Route exact path="/game/:id" render={props => <Game {...props} username={user.userData.username}/>}/>
          <Route exact path="/results/:id"  render={props => <Results {...props}/>}/>
        </div>
      </BrowserRouter>
  );
};

export const gravatarImg = (email, size) => {
  // 1. Trim white space at the start and the end
  // 2. Change to lower case
  // 3. Use md5 to get the hash
  let gravHash = md5(email.replace(/^\s+|\s+$/gm,'').toLowerCase());
  // Get the gravatar image.
  return `https://www.gravatar.com/avatar/${gravHash}?s=${size}`;
}

render(<MyApp/>, document.getElementById("mainDiv"));