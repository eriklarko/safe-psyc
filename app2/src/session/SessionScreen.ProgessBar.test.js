// @flow
//
// Tests the integration between SessionScreen and QuestionProgress

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import { SessionScreen } from './SessionScreen.js';
import { props, arbitraryQuestionSetOfSize, clickCorrectAnswer } from './test-helpers';
import { Session } from './session.js';

const questions = arbitraryQuestionSetOfSize(3);

it('has a progress bar', () => {
    const component = testingLib.render(<SessionScreen
        {...props()}
    />);
    component.getByTestId('progress'); // throws if no component is found
});

it('starts with 0% progress', () => {
    const component = testingLib.render(<SessionScreen
        {...props({
            session: new Session(questions),
        })}
    />);
    expect(getProgress(component)).toBe(0);
});

it('increases progress when moving to the next question', () => {
    const session = new Session(questions);
    const component = testingLib.render(<SessionScreen
        {...props({
            session: session,
        })}
    />);

    const progressBefore = getProgress(component);
    clickCorrectAnswer(component, session)
    const progressAfter = getProgress(component);

    expect(progressAfter).toBeGreaterThan(progressBefore);
});

it('ends with 100% progress', () => {
    const session = new Session(questions);
    const component = testingLib.render(<SessionScreen
        {...props({
            session: session,
        })}
    />);

    // Finish the session by clicking the correct answer for all questions.
    for (let i = 0; i < questions.size; i++) {
        clickCorrectAnswer(component, session)
    }

    expect(getProgress(component)).toBe(1);
});

// duplicated in QuestionProgress.test.js, but it's so small it doesn't feel
// reasonable to put it in some shared place.
function getProgress(component): number {
    const progressBar = component.getByTestId('progress');
    return progressBar.props.progress;
}
