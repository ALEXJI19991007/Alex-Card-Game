/* Copyright G. Hemingway @2020 - All rights reserved */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Game } from '../../src/client/components/game';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { VirtualConsole } from 'jsdom';
import { MemoryRouter } from 'react-router';

let container = null;
let jsdom = () => {};

describe('Game Page:', () => {
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
    fetchMock.mock('*', {});
    act(() => {
      ReactDOM.render(
        <MemoryRouter>
          <Game match={{ params: { id: 'test_id' } }} />
        </MemoryRouter>,
        container
      );
    });

    expect(container.innerHTML, 'The Game component is empty').to.not.equal('');
  });
});
