// @flow

import { userBackendFacade } from '~/src/services/user-backend.js';
import { remoteConfigBackendFacade } from '~/src/services/remote-config-backend.js';
import * as navigationActions from '~/src/navigation-actions.js';
import { log } from '~/src/services/logger.js';

// used to indicate that the login timer timed out
const timeout = "TIMEOUT";

export async function startLoading(
    navigationActions: typeof navigationActions = navigationActions,
    userBackend: typeof userBackendFacade = userBackendFacade,
) {
    console.log('loading....');
    await remoteConfigBackendFacade.load();
    return checkIfLoggedIn(navigationActions, userBackend)
}

async function checkIfLoggedIn(navigationActions, userBackend) {
    const state = {};
    return new Promise((resolve, reject) => {
        // fire off both the auth listener and a timer,
        // if the timer finishes first, the user isn't logged in
        // if the listener fires first, we handle the redirection
        // in function registerLoginRedirecters

        registerLoginRedirecters(userBackend, resolve);
        startTimeout(resolve, state);
    }).then( res => {

        // either the timer or the auth listener finished, we should
        // stop the timer regardless
        clearTimeout(state);

        // Determine if the timer or the auth listener finished first
        if (res === timeout) {

            // It was the timer, the user is logged out
            navigationActions.onUserLoggedOut();
        }

        // The other cases are handled by function registerLoginRedirecters
    });
}

function registerLoginRedirecters(backend, resolve) {
    backend.onAuthStateChange((user) => {
        resolve();

        if (user) {
            log.debug('User logged in');
            redirectToHomeIfOnLoadingScreen();
        } else {
            log.debug('User logged out - redirecting to login screen');
            navigationActions.onUserLoggedOut();
        }
    });
}

function redirectToHomeIfOnLoadingScreen() {
    const currentScreen = navigationActions.getCurrentScreen();
    if (currentScreen === "Loading" || currentScreen === 'Login') {
        log.debug('Was on the loading screen when logged in, redirecting to home');
        navigationActions.resetToHome();
    } else {
        log.debug('Current screen was %s, not redirecting anywhere', currentScreen);
    }
}

function startTimeout(resolve, state) {
    state.autologinTimeout = setTimeout(() => {
        resolve(timeout);
    }, 1000);
}

function clearTimeout(state) {
    if (state.autologinTimeout) {
        clearTimeout(state.autologinTimeout);
    }
}
