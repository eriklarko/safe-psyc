// @flow

import { Switch } from 'react-native';

import { SettingsScreen } from './SettingsScreen.js';

import { render } from '~/tests/cool-test-lib/render-utils.js';
import { findFirstByTestId, findFirstChild } from '~/tests/cool-test-lib/component-tree-utils.js';
import { checkNextTick } from '~/tests/cool-test-lib/utils.js';

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
        
        return s.props.onValueChange(true)
            .then( () => {
                expect(setValue).toHaveBeenLastCalledWith('current-emotion-notification', "true");
                return s.props.onValueChange(false);
            })
            .then( () => {
                expect(setValue).toHaveBeenLastCalledWith('current-emotion-notification', "false");
            });
    });
});
