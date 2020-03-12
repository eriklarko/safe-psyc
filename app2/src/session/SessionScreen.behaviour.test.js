// @flow
//
// Contains tests related to the more external behaviours of the SessionScreen
// such as moving to the next question and invoking listeners when the session
// is completed.

// after the last question is finished there's a delay before the state is
// updated and onSessionFinished is called. To not have to wait for that delay
// timers are mocked here.
jest.useFakeTimers();

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import moment from 'moment';
import { SessionScreen } from './SessionScreen.js';
import { Session, SessionReport } from './models';
import { props, newArbitraryQuestion, arbitraryQuestionSetOfSize, clickCorrectAnswer, clickIncorrectAnswer } from './test-helpers';

import type { TQuestion } from './models';

it('calls onSessionFinished with the correct report when all questions are finished', () => {
    // create a session with only one question
    const session = new Session(arbitraryQuestionSetOfSize(1));

    const report = new SessionReport();
    const onSessionFinished = jest.fn();

    // render the component
    const component = testingLib.render(<SessionScreen
        {...props({
            session: session,
            onSessionFinished: onSessionFinished,
            report: report,
        })}
    />);

    // answer the only question in the session
    clickCorrectAnswer(component, session);

    // make sure the delay after the last question has run out
    jest.runAllTimers();

    // and make sure onSessionFinished is called correctly
    expect(onSessionFinished).toHaveBeenCalledTimes(1);
    expect(onSessionFinished).toHaveBeenCalledWith(report);
});

it('moves to the next question on a correct answer', () => {
    const q1 = newArbitraryQuestion();
    const q2 = newArbitraryQuestion();

    const session = new Session<TQuestion>(new Set([q1, q2]));
    const component = testingLib.render(<SessionScreen
        {...props({
            session: session,
        })}
    />);

    clickCorrectAnswer(component, session);
    expect(session.currentQuestion()).toBe(q2);
});

it('moves to the next question if there are three incorrect answers', () => {
    const q1 = newArbitraryQuestion();
    const q2 = newArbitraryQuestion();

    const session = new Session<TQuestion>(new Set([q1, q2]));
    const component = testingLib.render(<SessionScreen
        {...props({
            session: session,
        })}
    />);

    // first attempt
    clickIncorrectAnswer(component, session);
    expect(session.currentQuestion()).toBe(q1); // should still be on q1

    // second attempt
    clickIncorrectAnswer(component, session);
    expect(session.currentQuestion()).toBe(q1); // should still be on q1

    // third attempt
    clickIncorrectAnswer(component, session);
    // after having answered wrong three times we should have moved on to q2
    expect(session.currentQuestion()).toBe(q2);
});
