// @flow
//
// Contains tests related to the UI that doesn't fit into the more specialized
// test files.

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import { Alert } from 'react-native';
import { SessionScreen } from './SessionScreen.js';
import { Session } from './models/session.js';
import { props, newDescriptionQuestion, clickCorrectAnswer } from './test-helpers';
import { installMockNavigator } from '../navigation';

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
    // finishes. To test this I need to disable the timers somehow and jests
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

describe('stuck in the not-started state', () => {
    // The SessionScreen moves out of the not-started state automatically by
    // calling `_showCurrentQuestion` in `componentDidMount`. In order to test
    // the not-started state I have to disable this automatic update somehow. I
    // could either
    //   * override componentDidMount and do nothing there
    //   * override _showCurrentQuestion to not update the state
    //
    // I think both works well and I chose to override componentDidMount here
    const StubbedSessionScreen = class extends SessionScreen {
        componentDidMount(){
            // no-op
        }
    };
    
    it('allows the user to force the next question', () => {
        // create a question we can use to test if the component moved out of the
        // not-started state
        const question = newDescriptionQuestion();
        const component = testingLib.render(<StubbedSessionScreen
            {...props({
                session: new Session(new Set([question])),
            })}
        />);

        // make sure the retry button exists in the not-started state
        const retryBtn = component.getByText("retry")
        
        // and that pressing it shows the question
        testingLib.fireEvent.press(retryBtn);
        component.getByText(question.text);
    })

    it('navigates to the report flow', () => {
        const navigationMock = installMockNavigator();
        const component = renderer.create(<StubbedSessionScreen
            {...props()}
        />).root;

        const instance = component.instance;
        if (!instance) { // make flow accept the instance.props|state calls below :(
            expect(instance).toBeDefined();
            return
        }
        
        // make sure the report button exists in the not-started state
        //const reportBtn = component.getByText("report")
        const reportBtn = component.findByProps({title: "report"})

        // and that pressing it navigates to the report flow
        testingLib.fireEvent.press(reportBtn);
        expect(navigationMock).toHaveNavigatedTo('Report', {
            screen: {
                name: 'Session',
                props: instance.props,
                state: instance.state,
            },
            header: 'Empty screen when starting new session',
        });
    })
})
