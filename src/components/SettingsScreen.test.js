// @flow

import { Switch } from 'react-native';

import { SettingsScreen } from './SettingsScreen.js';

import { render } from '~/tests/render-utils.js';
import { findFirstByTestId, findFirstChild } from '~/tests/component-tree-utils.js';
import { checkNextTick } from '~/tests/utils.js';

it('saves the current-emotion-notification toggle value', () => {
    const setValue = jest.fn().mockResolvedValue();
    const component = render(SettingsScreen, {
        userBackend: { 
            getLoggedInUser: () => ({}),
        },
        deviceStorage: {
            setValue: setValue,
            getValue: jest.fn().mockResolvedValue(),
        },
        accountStorage: {
            setValue: jest.fn().mockResolvedValue(),
            getValue: jest.fn().mockResolvedValue(),
        },
    });


    return checkNextTick( () => {

        const toggle = findFirstByTestId(component, 'current-emotion-notification-toggle');
        expect(toggle).toBeDefined();

        const s = findFirstChild(toggle, Switch);
        expect(s).toBeDefined();
        
        s.props.onValueChange(true);
        expect(setValue).toHaveBeenLastCalledWith('current-emotion-notification', "true");

        s.props.onValueChange(false);
        expect(setValue).toHaveBeenLastCalledWith('current-emotion-notification', "false");
    });
});
