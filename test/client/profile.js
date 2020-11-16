/* Copyright G. Hemingway @2020 - All rights reserved */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Profile } from '../../src/client/components/profile';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { VirtualConsole } from 'jsdom';
import { MemoryRouter } from 'react-router-dom';

let container = null;
let jsdom = () => {};

describe('Profile Page:', () => {
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

  it('Loads', () => {
    fetchMock.mock({
      matcher: '/v1/user/test_username',
      sendAsJson: true,
      response: {
        username: '',
        first_name: '',
        last_name: '',
        primary_email: '',
        city: '',
        games: [],
        error: ''
      }
    });

    act(() => {
      ReactDOM.render(
        <MemoryRouter>
          <Profile match={{ params: { username: 'test_username' } }} />
        </MemoryRouter>,
        container
      );
    });

    expect(container.innerHTML, 'The Profile component is empty').to.not.equal(
      ''
    );
  });
});
