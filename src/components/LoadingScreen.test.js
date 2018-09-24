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
    let signalLoggedOut = jest.fn();
    const loggedOut = jest.fn();
    const component = render(LoadingScreen, {
        userBackend: {
            onUserLoggedIn: jest.fn(),
            onUserLoggedOut: cb => {
                signalLoggedOut = cb;
            },
        },
        navigationActions: {
            onUserLoggedOut: loggedOut,
        },
    });

    return checkNextTick( () => {
        signalLoggedOut();
        expect(loggedOut).toHaveBeenCalledTimes(1);
    });
});

it('redirects to home screen if logged in', () => {
    const navigation = mockNavigation();

    let signalLoggedIn = jest.fn();
    const component = render(LoadingScreen, {
        userBackend: {
            onUserLoggedIn: cb => {
                signalLoggedIn = cb;
            },
            onUserLoggedOut: jest.fn(),
        },
    });

    return checkNextTick( () => {
        signalLoggedIn();
        expect(navigation).toHaveResetTo('Home');
    });
});
