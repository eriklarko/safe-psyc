// @flow

import React from 'react';

import { LoadingScreen } from './LoadingScreen.js';

import { render } from '~/tests/render-utils.js';
import { mockNavigation } from '~/tests/navigation-utils.js';
import { checkNextTick } from '~/tests/utils.js';

jest.useFakeTimers();

it('redirects to start screen after timer fires', () => {
    const loggedOut = jest.fn();
    const component = render(LoadingScreen, {
        navigationActions: {
            onUserLoggedOut: loggedOut,
        },
    });

    expect(loggedOut).not.toHaveBeenCalled();
    jest.runAllTimers();
    return checkNextTick( () => {
        expect(loggedOut).toHaveBeenCalledTimes(1);
    });
});

it('redirects to start screen if logged out', () => {
    let signalAuthChange = jest.fn();
    const loggedOut = jest.fn();
    const component = render(LoadingScreen, {
        userBackend: {
            onAuthStateChange: cb => {
                signalAuthChange = cb;
            },
        },
        navigationActions: {
            onUserLoggedOut: loggedOut,
        },
    });

    return checkNextTick( () => {
        signalAuthChange(null); // use null to indicate logged out
        expect(loggedOut).toHaveBeenCalledTimes(1);
    });
});

it('redirects to home screen if logged in', () => {
    const navigation = mockNavigation();

    let signalAuthChange = jest.fn();
    const component = render(LoadingScreen, {
        userBackend: {
            onAuthStateChange: cb => {
                signalAuthChange = cb;
            },
        },
    });

    return checkNextTick( () => {
        signalAuthChange({}); // use {} to indicate logged in
        expect(navigation).toHaveResetTo('Home');
    });
});
