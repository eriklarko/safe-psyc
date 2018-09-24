// @flow

import React from 'react';

import { startLoading } from './startup.js';
import * as navigationActions from '~/src/navigation-actions.js';

import { mockNavigation } from '~/tests/navigation-utils.js';
import { checkNextTick } from '~/tests/utils.js';

import type { UserBackendFacade } from '~/src/services/user-backend.js';

jest.useFakeTimers();

it('calls onUserLoggedOut after timer fires', () => {
    const loggedOut = jest.fn();
    const navActions = asNavActions({
        onUserLoggedOut: loggedOut,
    });
    startLoading(navActions);

    expect(loggedOut).not.toHaveBeenCalled();
    jest.runAllTimers();
    return checkNextTick( () => {
        expect(loggedOut).toHaveBeenCalledTimes(1);
    });
});

it('calls onUserLoggedOut if logged out', () => {
    let signalAuthChange = jest.fn();
    const userBackend = asUserBackend({
        onAuthStateChange: cb => {
            signalAuthChange = cb;
        },
    });

    const loggedOut = jest.fn();
    const navActions = asNavActions({
        onUserLoggedOut: loggedOut,
    });

    startLoading(navActions, userBackend);

    return checkNextTick( () => {
        signalAuthChange(null); // use null to indicate logged out
        expect(loggedOut).toHaveBeenCalledTimes(1);
    });
});

it('redirects to home screen if logged in', () => {
    const navigation = mockNavigation();

    let signalAuthChange = jest.fn();
    const userBackend = asUserBackend({
        onAuthStateChange: cb => {
            signalAuthChange = cb;
        },
    });

    navigationActions.setCurrentScreen('Loading');
    startLoading(navigationActions, userBackend);

    return checkNextTick( () => {
        signalAuthChange({}); // use {} to indicate logged in
        expect(navigation).toHaveResetTo('Home');
    });
});

it('does not redirect to home if logged in when not on the loading screen', () => {
    const navigation = mockNavigation();

    let signalAuthChange = jest.fn();
    const userBackend = asUserBackend({
        onAuthStateChange: cb => {
            signalAuthChange = cb;
        },
    });

    navigationActions.setCurrentScreen('some random screen');
    startLoading(navigationActions, userBackend);

    return checkNextTick( () => {
        signalAuthChange({}); // use {} to indicate logged in
        expect(navigation).not.toHaveResetTo('Home');
    });
});

function asUserBackend(o): UserBackendFacade {
    return ((o: any): UserBackendFacade);
}

function asNavActions(o): typeof navigationActions {
    return ((o: any): typeof navigationActions);
}
