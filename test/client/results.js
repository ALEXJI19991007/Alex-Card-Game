/* Copyright G. Hemingway @2020 - All rights reserved */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Results } from '../../src/client/components/results';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { VirtualConsole } from 'jsdom';
import { MemoryRouter } from 'react-router';

let container = null;
let jsdom = () => {};

describe('Results Page:', () => {
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
      matcher: '/v1/game/test_id',
      sendAsJson: true,
      response: JSON.stringify({
        start: 0,
        score: 0,
        cards_remaining: 0,
        active: true,
        moves: []
      })
    });

    act(() => {
      ReactDOM.render(
        <MemoryRouter>
          <Results match={{ params: { id: 'test_id' } }} />
        </MemoryRouter>,
        container
      );
    });

    expect(container.innerHTML, 'The Results component is empty').to.not.equal(
      ''
    );
  });
});
