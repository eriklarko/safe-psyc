// @flow
//
// Contains tests related to the UI that doesn't fit into the more specialized
// test files.

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SessionScreen } from './SessionScreen.js';
import { Session } from './models/session.js';
import { props, newDescriptionQuestion } from './test-helpers';

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
    expect(true).toBe(false);
})
