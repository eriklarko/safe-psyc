// @flow

import { Alert } from 'react-native';

export interface MockAlert {
    getButtonWithText(string): Object,
    mock: Object,
}

export function withMockedAlert(cb: (alert: MockAlert) => void) {
    const realAlertFunction = Alert.alert;
    try {
        const mockAlert = createMockAlert();
        // $FlowExpectedError: Alert.alert is not writable
        Alert.alert = mockAlert;
        cb(mockAlert);
    } finally {
        // $FlowExpectedError: Alert.alert is not writable
        Alert.alert = realAlertFunction;
    }
}

function createMockAlert(): MockAlert {
    // $FlowExpectedError
    const a: MockAlert = jest.fn(); /* eslint-disable-line no-undef */

    // $FlowExpectedError: Cannot assign function to `a.getButtonWithText` because property `getButtonWithText` is not writable.
    a.getButtonWithText = (buttonText: string) => {
        // Find the buttons passed to Alert.alert. They're the third argument
        // to the Alert.alert function.
        // https://facebook.github.io/react-native/docs/alert#alert
        const alertButtons = a.mock.calls[0][2];

        // find the button we want to test
        const btn = alertButtons.find(b => b.text.toLowerCase() === buttonText.toLowerCase());
        if (!btn) {
            const alertButtonTexts = alertButtons.map(b => b.text);
            throw new Error(`Button named ${buttonText} not found in ${alertButtonTexts}`);
        }

        return btn;
    };
    return a;
}
