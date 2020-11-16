/* Copyright G. Hemingway @2020 - All rights reserved */

import { shuffleCards, initialState } from '../../src/server/solitare';
import { expect } from 'chai';

const SUITS = Object.freeze(['spades', 'clubs', 'hearts', 'diamonds']);
const VALUES = Object.freeze([
  'ace',
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  'jack',
  'queen',
  'king'
]);
const FULL_DECK = Object.freeze([
  { suit: 'spades', value: 'ace' },
  { suit: 'spades', value: 2 },
  { suit: 'spades', value: 3 },
  { suit: 'spades', value: 4 },
  { suit: 'spades', value: 5 },
  { suit: 'spades', value: 6 },
  { suit: 'spades', value: 7 },
  { suit: 'spades', value: 8 },
  { suit: 'spades', value: 9 },
  { suit: 'spades', value: 10 },
  { suit: 'spades', value: 'jack' },
  { suit: 'spades', value: 'queen' },
  { suit: 'spades', value: 'king' },
  { suit: 'clubs', value: 'ace' },
  { suit: 'clubs', value: 2 },
  { suit: 'clubs', value: 3 },
  { suit: 'clubs', value: 4 },
  { suit: 'clubs', value: 5 },
  { suit: 'clubs', value: 6 },
  { suit: 'clubs', value: 7 },
  { suit: 'clubs', value: 8 },
  { suit: 'clubs', value: 9 },
  { suit: 'clubs', value: 10 },
  { suit: 'clubs', value: 'jack' },
  { suit: 'clubs', value: 'queen' },
  { suit: 'clubs', value: 'king' },
  { suit: 'hearts', value: 'ace' },
  { suit: 'hearts', value: 2 },
  { suit: 'hearts', value: 3 },
  { suit: 'hearts', value: 4 },
  { suit: 'hearts', value: 5 },
  { suit: 'hearts', value: 6 },
  { suit: 'hearts', value: 7 },
  { suit: 'hearts', value: 8 },
  { suit: 'hearts', value: 9 },
  { suit: 'hearts', value: 10 },
  { suit: 'hearts', value: 'jack' },
  { suit: 'hearts', value: 'queen' },
  { suit: 'hearts', value: 'king' },
  { suit: 'diamonds', value: 'ace' },
  { suit: 'diamonds', value: 2 },
  { suit: 'diamonds', value: 3 },
  { suit: 'diamonds', value: 4 },
  { suit: 'diamonds', value: 5 },
  { suit: 'diamonds', value: 6 },
  { suit: 'diamonds', value: 7 },
  { suit: 'diamonds', value: 8 },
  { suit: 'diamonds', value: 9 },
  { suit: 'diamonds', value: 10 },
  { suit: 'diamonds', value: 'jack' },
  { suit: 'diamonds', value: 'queen' },
  { suit: 'diamonds', value: 'king' }
]);

/**
 * getNumericCardValue returns the number corresponding to the value of the card.
 * @param {string|number} card
 */
function getNumericCardValue(card) {
  if (typeof card === 'number') return card;
  switch (card.toLowerCase()) {
    case 'ace':
      return 1;
    case 'jack':
      return 11;
    case 'queen':
      return 12;
    case 'king':
      return 13;
    case 'joker':
      return 14;
    default:
      try {
        return Number(card);
      } catch (err) {
        console.group('Error in getNumericCardValue');
        console.error(err);
        process.exit(1);
      }
  }
}

describe('Server Solitaire functions:', function() {
  describe('shuffleCards', () => {
    it('Shuffles cards randomly', () => {
      const NUM_ITERATIONS = 10000;

      // After 10000 shuffles, the expected value for each card should be 6.5
      let experimentalMeanValues = new Array(52);
      for (let i = 0; i < 52; ++i) experimentalMeanValues[i] = 0;

      // Sum each index of the deck over 10000 shuffles.
      // The average value over 10000 iterations will converge on 7.
      for (let i = 0; i < NUM_ITERATIONS; ++i) {
        const deck = shuffleCards(false);

        deck.forEach(
          (card, index) =>
            (experimentalMeanValues[index] += getNumericCardValue(card.value))
        );
      }

      expect(
        experimentalMeanValues
          .map(card => card / NUM_ITERATIONS)
          .every(avgValue => avgValue < 7.5 && 6.5 < avgValue),
        'Not every index in the array had an average value between 6.5 and 7.5. ' +
          'There is probably an error in your random distribution of cards!'
      ).to.be.true;
    });

    it('Deck contains one of each card', () => {
      const NUM_ITERATIONS = 5;

      // Test 5 times for assurance.
      for (let i = 0; i < NUM_ITERATIONS; ++i) {
        const deck = shuffleCards(false);

        const passes = FULL_DECK.every(expectedCard => {
          const expectedStrCard = JSON.stringify(expectedCard);
          return deck.some(
            deckCard => JSON.stringify(deckCard) === expectedStrCard
          );
        });

        expect(passes, "Deck doesn't contain one of each card.").to.be.true;
      }
    });
  });

  describe('initialState', () => {
    it('contains the correct number of cards for each pile', () => {
      const deck = initialState();
      for (let i = 1; i <= 4; ++i)
        expect(
          deck[`pile${i}`].length,
          `Pile ${i} doesn't have the right number of cards`
        ).to.equal(i);
    });

    it('contains no cards in any stack', () => {
      const deck = initialState();
      for (let i = 1; i <= 4; ++i)
        expect(deck[`stack${i}`].length, `Stack ${i} isn't empty`).to.equal(0);
    });

    it('contains 24 cards in the draw pile', () => {
      const deck = initialState();
      expect(
        deck.draw.length,
        'Draw pile contains the incorrect number of cards'
      ).to.equal(24);
    });

    it('ensures the top card is facing up', () => {
      const deck = initialState();
      for (let i = 1; i <= 7; ++i)
        expect(
          deck[`pile${i}`][i - 1].up,
          `The top card of pile ${i} is not up`
        ).to.be.true;
    });

    it('ensures all other cards are facing down', () => {
      const deck = initialState();
      for (let i = 2; i <= 7; ++i)
        for (let j = i; j > 1; --j)
          expect(
            deck[`pile${i}`][i - j].up,
            `Card ${i - j + 1} of pile ${i} is facing up and shouldn't be`
          ).to.be.false;
    });

    it('ensures every card has a suit', () => {
      const deck = initialState();
      for (let i = 1; i <= 7; ++i)
        expect(
          deck[`pile${i}`].every(card => SUITS.includes(card.suit)),
          `Pile ${i} contains a card that doesn't have a suit`
        ).to.be.true;
    });

    it('ensures every card has a value', () => {
      const deck = initialState();
      for (let i = 1; i <= 7; ++i)
        expect(
          deck[`pile${i}`].every(card => VALUES.includes(card.value)),
          `Pile ${i} contains a card that doesn't have a value`
        ).to.be.true;
    });
  });
});
