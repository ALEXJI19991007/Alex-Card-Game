/* Copyright G. Hemingway @2020 - All rights reserved */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Register } from '../../src/client/components/register';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { VirtualConsole } from 'jsdom';
import { MemoryRouter } from 'react-router';

let container = null;
let jsdom = () => {};

describe('Register Page:', () => {
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
        // History prop added for reference solution propTypes.
        // MemoryRouter should take care of this, but it does not.
        <MemoryRouter>
          <Register history={{}} />
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

  // it('End-to-end test: Registers a user via a post request', async () => {
  //   fetchMock.mock({
  //     matcher: '/v1/user',
  //     response: {
  //       username: 'test_username',
  //       primary_email: 'test_primary_email'
  //     },
  //     sendAsJson: true
  //   });
  //
  //   act(() => {
  //     ReactDOM.render(
  //       <MemoryRouter>
  //         <Register history={{}} />
  //       </MemoryRouter>,
  //       container
  //     );
  //   });
  //
  //   const fields = {
  //     username: 'foobar',
  //     first_name: 'Graham',
  //     last_name: 'Hemingway',
  //     city: 'Nashville',
  //     primary_email: 'foo@bar.com',
  //     password: 'p@ssw0rD1!'
  //   };
  //   for (const key in fields) {
  //     const field = document.querySelector(`#${key}`);
  //     expect(field, `No field with id="${key}" found`).to.exist;
  //     act(() => {
  //       [...fields[key]].forEach(letter =>
  //         field.dispatchEvent(new KeyboardEvent('keypress', { key: letter }))
  //       );
  //     });
  //   }
  //
  //   const submitBtn = document.querySelector('button#submitBtn');
  //   expect(submitBtn, 'No button with id="submitBtn" found').to.exist;
  //   await act(async () => {
  //     submitBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  //   });
  //
  //   expect(
  //     fetchMock.called('/v1/user'),
  //     "Didn't make POST request to /v1/user using fetch"
  //   ).to.be.true;
  // });
});
