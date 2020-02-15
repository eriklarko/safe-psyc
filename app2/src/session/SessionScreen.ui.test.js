// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import { SessionScreen } from './SessionScreen.js';
import { Session } from './session.js';

it('shows the first question after the first render cycle', () => {
    const question = {
        type: 'description',
        text: 'what is the meaning of life?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    };

    // render the component
    const component = testingLib.render(<SessionScreen
        session={new Session(new Set([question]))}
        onSessionFinished={jest.fn()}
    />);

    // check that the question text and answers are rendered
    component.getByText(question.text);
    component.getByText(question.correctAnswer);
    for (const answer of question.incorrectAnswers) {
        component.getByText(answer);
    }
});

it('shows a dialog when the cancel button is pressed', () => {

});

// omg worst test description ever. The cancel button gives the option to
// either cancel and go back to Home, or to go the report screen and look
// at the unfinished session.
it('calls onSessionFinished on cancel with intent to see report', () => {

});
