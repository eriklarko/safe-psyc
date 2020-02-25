// @flow
//
// Tests things related to the cancel button

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import * as mockBackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler.js';
import { SessionScreen } from './SessionScreen.js';
import { SessionReport } from './models';
import { props, withMockedAlert } from './test-helpers';

it('has a cancel button', () => {
    const component = testingLib.render(<SessionScreen
        {...props()}
    />);
    component.getByTestId('cancel-btn'); // throws if no component is found
});

it('shows a dialog when the cancel button is pressed', () => {
    const component = testingLib.render(<SessionScreen
        {...props()}
    />);
    const cancelBtn = component.getByTestId('cancel-btn');

    withMockedAlert((mockedAlert) => {
        expect(mockedAlert).toHaveBeenCalledTimes(0);
        testingLib.fireEvent.press(cancelBtn);
        expect(mockedAlert).toHaveBeenCalledTimes(1);
    });
});

describe('android back button', () => {
    it('brings up the cancel dialog', () => {
        const component = testingLib.render(<SessionScreen
            {...props({
                backHandler: mockBackHandler,
            })}
        />);

        // The BackHandler mock's state is global and there's no way to clear
        // the state at the start of a test. Instead we'll use testinglib's
        // unmount feature and remove any listeners that way.
        try {
            withMockedAlert((mockedAlert) => {
                expect(mockedAlert).toHaveBeenCalledTimes(0);
                mockBackHandler.mockPressBack();
                expect(mockedAlert).toHaveBeenCalledTimes(1);
            });

        } finally {
            component.unmount();
        }
    });

    const assertThat = it; // too much for readability's sake?
    assertThat('listener is removed when component is unmounted', () => {
        const component = testingLib.render(<SessionScreen
            {...props({
                backHandler: mockBackHandler,
            })}
        />);

        component.unmount();
        withMockedAlert((mockedAlert) => {
            mockBackHandler.mockPressBack();
            expect(mockedAlert).toHaveBeenCalledTimes(0);
        });
    });
})

it('includes a description of the three buttons in the alert', () => {
    const component = testingLib.render(<SessionScreen
        {...props()}
    />);
    const cancelBtn = component.getByTestId('cancel-btn');

    withMockedAlert((mockedAlert) => {
        // press the cancel button to show the alert
        testingLib.fireEvent.press(cancelBtn);

        // Find the message passed to Alert.alert. It's the second argument
        // to the Alert.alert function.
        // https://facebook.github.io/react-native/docs/alert#alert
        const message = mockedAlert.mock.calls[0][1];

        expect(message.toLowerCase()).toMatch('finish');
        expect(message.toLowerCase()).toMatch('abort');
        expect(message.toLowerCase()).toMatch('continue');
    });
});

// omg worst test description ever. The cancel button gives the option to
// either cancel and go back to Home, or to go the report screen and look
// at the unfinished session. This test tests the last case.
it('calls onSessionFinished on cancel with intent to see report', () => {
    const onSessionFinished = jest.fn();
    const component = testingLib.render(<SessionScreen
        {...props({
            onSessionFinished: onSessionFinished,
        })}
    />);
    const cancelBtn = component.getByTestId('cancel-btn');

    withMockedAlert((mockedAlert) => {
        // press the cancel button to show the alert
        testingLib.fireEvent.press(cancelBtn);

        // find the button we want to test in this test, finish
        const finishBtn = mockedAlert.getButtonWithText('finish');

        // press the button and verify that onSessionFinished was called
        expect(onSessionFinished).toHaveBeenCalledTimes(0);
        finishBtn.onPress();
        expect(onSessionFinished).toHaveBeenCalledTimes(1);
    });
});

it('calls onAborted on cancel with intent to throw away progress', () => {
    const onAborted = jest.fn();
    const component = testingLib.render(<SessionScreen
        {...props({
            onAborted: onAborted,
        })}
    />);
    const cancelBtn = component.getByTestId('cancel-btn');

    withMockedAlert((mockedAlert) => {
        // press the cancel button to show the alert
        testingLib.fireEvent.press(cancelBtn);

        // find the button we want to test in this test, finish
        const abortBtn = mockedAlert.getButtonWithText('abort');

        // press the button and verify that onSessionFinished was called
        expect(onAborted).toHaveBeenCalledTimes(0);
        abortBtn.onPress();
        expect(onAborted).toHaveBeenCalledTimes(1);
    });
});

it('dismisses the cancel alert on continue', () => {
    const onSessionFinished = jest.fn();
    const onAborted = jest.fn();
    const component = testingLib.render(<SessionScreen
        {...props({
            onSessionFinished: onSessionFinished,
            onAborted: onAborted,
        })}
    />);
    const cancelBtn = component.getByTestId('cancel-btn');

    withMockedAlert((mockedAlert) => {
        // press the cancel button to show the alert
        testingLib.fireEvent.press(cancelBtn);

        // find the button we want to test in this test, finish
        const continueBtn = mockedAlert.getButtonWithText('continue');

        // press the button and verify that onSessionFinished was called
        continueBtn.onPress();
        expect(onSessionFinished).toHaveBeenCalledTimes(0);
        expect(onAborted).toHaveBeenCalledTimes(0);
    });
});

it('throws away the report when aborted', () => {
    const report = new SessionReport();
    const component = testingLib.render(<SessionScreen
        {...props({
            report: report,
        })}
    />);
    const cancelBtn = component.getByTestId('cancel-btn');

    withMockedAlert((mockedAlert) => {
        // press the cancel button to show the alert
        testingLib.fireEvent.press(cancelBtn);

        // find the button we want to test in this test, finish
        const abortBtn = mockedAlert.getButtonWithText('abort');

        const emptyMap = new Map();
        expect(report.getAllResults()).not.toEqual(emptyMap);
        abortBtn.onPress();
        expect(report.getAllResults()).toEqual(emptyMap);
    });
});
