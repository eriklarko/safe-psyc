// @flow
//
// Contains tests related to the UI that doesn't fit into the more specialized
// test files.

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SessionScreen } from './SessionScreen.js';
import { Session } from './models/session.js';
import { props, newDescriptionQuestion, clickCorrectAnswer } from './test-helpers';

it('shows the first question after the first render cycle', () => {
    const question = newDescriptionQuestion();

    // render the component
    const component = testingLib.render(<SessionScreen
        {...props({
            session: new Session(new Set([question])),
        })}
    />);

    // check that the question text and answers are rendered
    component.getByText(question.text);
    component.getByText(question.correctAnswer.name);
    for (const answer of question.incorrectAnswers) {
        component.getByText(answer.name);
    }
});

it('shows the question when in the about-to-finish state', () => {
    // This test is meant to test the state between when the last question is
    // answered and when onSessionFinished is called. A timer is started when 
    // the last question is answered, and calls onSessionFinished when it
    // finishes To test this I need to disable the timers somehow and jests
    // useFakeTimers does just that.
    jest.useFakeTimers();

    // create session with one question
    const question = newDescriptionQuestion();
    const session = new Session(new Set([question]));

    // render SessionScreen
    const component = testingLib.render(<SessionScreen
        {...props({
            session: session,
        })}
    />);

    // answer the question correctly
    clickCorrectAnswer(component, session);

    // check rendered state
    component.getByText(question.text);
})
