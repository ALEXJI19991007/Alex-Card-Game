/* Copyright G. Hemingway @2020 - All rights reserved */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Start } from '../../src/client/components/start';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { VirtualConsole } from 'jsdom';
import { MemoryRouter } from 'react-router';

let container = null;
let jsdom = () => {};

describe('Start Page:', () => {
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

  it('Uses react router navigation to start a new game', async () => {
    fetchMock.post(
      '/v1/game',
      {
        id: 'test_value'
      },
      { sendAsJson: true }
    );

    const history = [];
    act(() => {
      ReactDOM.render(
        <MemoryRouter>
          <Start history={{ push: addr => history.push(addr) }} />
        </MemoryRouter>,
        container
      );
    });

    const startBtn = document.querySelector('button#startBtn');
    expect(
      startBtn,
      'Either no button element exists or start button does not have id="startBtn"'
    );

    await act(async () => {
      startBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(
      history[0],
      'When clicked, the submit option does not push a new URL into the react router history object'
    ).to.equal('/game/test_value');
  });
});
