// @flow

import { Session } from './session.js';

it('throws if created with no question', () => {
    expect(() => new Session(new Set())).toThrow();
});

it('starts with the first question', () => {
    const questions = new Set(['a', 'b', 'c']);
    const session = new Session(questions);

    expect(session.currentQuestion()).toBe('a');
});

it('can advance to the next question', () => {
    const questions = new Set(['a', 'b', 'c']);
    const session = new Session(questions);

    session.nextQuestion();
    expect(session.currentQuestion()).toBe('b');
});

it('throws exception if asked to advance too far', () => {
    const questions = new Set(['a', 'b', 'c']);
    const session = new Session(questions);

    session.nextQuestion(); // current question is 'b'
    session.nextQuestion(); // current question is 'c'

    // test that an exception with some useful information is thrown. The .bind
    // is necessary because `this` gets corrupted when using jest.toThrow with
    // a regular expression.
    expect(session.nextQuestion.bind(session)).toThrow(/index 3 of 3/);
});

it('returns the number of questions in the session', () => {
    const questions = new Set(['a', 'b', 'c']);
    const session = new Session(questions);

    expect(session.numberOfQuestions()).toBe(questions.size);
});

describe('hasNextQuestion', () => {
    it('returns true when there are more questions', () => {
        const questions = new Set(['a', 'b', 'c']);
        const session = new Session(questions);

        expect(session.hasNextQuestion()).toBe(true); // next question is 'b'

        session.nextQuestion();
        expect(session.hasNextQuestion()).toBe(true); // next question is 'c'
    });

    it('returns false when there are no more questions', () => {
        const questions = new Set(['a', 'b']);
        const session = new Session(questions);

        session.nextQuestion(); // current question is 'b'

        // check hasNextQuestion twice for no real reason
        expect(session.hasNextQuestion()).toBe(false);
        expect(session.hasNextQuestion()).toBe(false);
    });
});

describe('currentIndex', () => {
    const questions = new Set(['a', 'b', 'c']);

    it('returns zero when on the first question', () => {
        const session = new Session(questions);
        expect(session.currentQuestionIndex()).toBe(0);
    });

    it('returns one when on the first question', () => {
        const session = new Session(questions);
        session.nextQuestion(); // current question is 'b'

        expect(session.currentQuestionIndex()).toBe(1);
    });
});
