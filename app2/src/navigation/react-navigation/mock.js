// @flow
//
// An impl of react-navigation to be used by tests
//
// because I use jest.fn but jest can't be imported I need to disable the eslint
// no-undef rule for this file. And... eslint pragmas need to be defined in
// block comments, grrrrr..
/* eslint-disable no-undef */

import { navigator } from './navigator.js';
import type { Navigator } from './navigator.js';

export function mockReactNavigation(): Navigator {
    // $FlowFixMe: ugh, mocking the real navigator is a lot of work. Let's just do this instead
    const mockNavigator: Navigator = {
        dispatch: jest.fn(),
        addListener: jest.fn(),
    };

    navigator._setInternalNavigator(mockNavigator); // omg navigators everywhere
    return mockNavigator;
}
