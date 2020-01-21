// @flow

import { Session } from './session.js';

it('can advance to the next question', () => {
    const questions = ['a', 'b', 'c']
    const session = new Session(questions);

    session.nextQuestion();
    expect(session.nextQuestion()).toBe('b');
});

it('returns the last question if asked to advance too far', () => {
    const questions = ['a', 'b', 'c']
    const session = new Session(questions);

    session.nextQuestion(); // returns 'a'
    session.nextQuestion(); // returns 'b'
    session.nextQuestion(); // returns 'c'
    expect(session.nextQuestion()).toBe('c');
});