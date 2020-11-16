/* Copyright G. Hemingway @2020 - All rights reserved */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Login } from '../../src/client/components/login';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { VirtualConsole } from 'jsdom';
import { MemoryRouter } from 'react-router';

let container = null;
let jsdom = () => {};

describe('Login Page:', () => {
  before(() => {
    let virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(console, { omitJSDOMErrors: true });
    jsdom = require('jsdom-global')('', { virtualConsole });
  });

  after(() => {
    jsdom();
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) document.body.removeChild(container);
    container = null;
    fetchMock.reset();
  });

  it('Has a submit button', async () => {
    act(() => {
      ReactDOM.render(
        <MemoryRouter>
          <Login logIn={() => {}} />
        </MemoryRouter>,
        container
      );
    });

    const startBtn = document.querySelector('button#submitBtn');
    expect(
      startBtn,
      'Either no button element exists or start button does not have id="submitBtn"'
    );
  });

  // it('End-to-end test: Logs in a user after a successful post request', async () => {
  //   fetchMock.mock({
  //     matcher: '/v1/session',
  //     response: {
  //       username: 'test_username'
  //     },
  //     sendAsJson: true
  //   });
  //
  //   let loggedInUser;
  //   act(() => {
  //     ReactDOM.render(
  //       <MemoryRouter>
  //         <Login logIn={user => void (loggedInUser = user)} />
  //       </MemoryRouter>,
  //       container
  //     );
  //   });
  //
  //   const usernameField = document.querySelector('#username');
  //   expect(usernameField, 'No field with id="username" found').to.exist;
  //   act(() => {
  //     [...'usera'].forEach(letter =>
  //       usernameField.dispatchEvent(
  //         new KeyboardEvent('keypress', { key: letter })
  //       )
  //     );
  //   });
  //
  //   const passwordField = document.querySelector('#password');
  //   expect(passwordField, 'No field with id="password" found').to.exist;
  //   act(() => {
  //     [...'secret'].forEach(letter =>
  //       passwordField.dispatchEvent(
  //         new KeyboardEvent('keypress', { key: letter })
  //       )
  //     );
  //   });
  //
  //   const submitBtn = document.querySelector('button#submitBtn');
  //   expect(submitBtn, 'No button with id="submitBtn" found').to.exist;
  //   await act(async () => {
  //     submitBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  //   });
  //
  //   expect(
  //     fetchMock.done('/v1/session'),
  //     "Didn't make POST request to /v1/session with the username and password in the body using fetch"
  //   ).to.be.true;
  //
  //   expect(
  //     loggedInUser,
  //     'Component did not use a logIn prop to propagate the login to the rest of the application' +
  //       'You should pass a prop named `logIn` to this component to set the global state after logging in.'
  //   ).to.equal('test_username');
  // });
});
