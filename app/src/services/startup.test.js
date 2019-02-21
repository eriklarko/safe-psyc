// @flow

import React from 'react';

import { startLoading } from './startup.js';
import * as navigationActions from '~/src/navigation-actions.js';

import { mockNavigation } from '~/tests/mocks/navigation-mock.js';
import { checkNextTick } from '~/tests/cool-test-lib/utils.js';

import type { UserBackendFacade } from '~/src/services/user-backend.js';

jest.useFakeTimers();

it('calls onUserLoggedOut after timer fires', () => {
    const navActions = asNavActions({
        onUserLoggedOut: jest.fn(),
    });
    startLoading(navActions);

    expect(navActions.onUserLoggedOut).not.toHaveBeenCalled();
    jest.runAllTimers();
    return checkNextTick( () => {
        expect(navActions.onUserLoggedOut).toHaveBeenCalledTimes(1);
    });
});

it('calls onUserLoggedOut if logged out', () => {
    let signalAuthChange = jest.fn();
    const userBackend = asUserBackend({
        onAuthStateChange: cb => {
            signalAuthChange = cb;
        },
    });

    const navActions = asNavActions({
        onUserLoggedOut: jest.fn(),
    });

    startLoading(navActions, userBackend);
    return checkNextTick( () => {
        signalAuthChange(null); // use null to indicate logged out
        expect(navActions.onUserLoggedOut).toHaveBeenCalledTimes(1);
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
