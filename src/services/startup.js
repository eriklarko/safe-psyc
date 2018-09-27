// @flow

import { userBackendFacade } from '~/src/services/user-backend.js';
import { remoteConfigBackendFacade } from '~/src/services/remote-config-backend.js';
import * as navigationActions from '~/src/navigation-actions.js';
import { log } from '~/src/services/logger.js';

// used to indicate that the login timer timed out
const timeout = "TIMEOUT";

export async function startLoading(
    navActions: typeof navigationActions = navigationActions,
    userBackend: typeof userBackendFacade = userBackendFacade,
) {
    log.debug('Loading...');
    await remoteConfigBackendFacade.load();
    return checkIfLoggedIn(navActions, userBackend)
}

async function checkIfLoggedIn(navActions, userBackend) {
    let timerId = null;
    return new Promise((resolve, reject) => {
        // fire off both the auth listener and a timer,
        // if the timer finishes first, the user isn't logged in
        // if the listener fires first, we handle the redirection
        // in function registerLoginRedirecters

        registerLoginRedirecters(navActions, userBackend, resolve);
        timerId = startTimer(resolve);
    }).then( res => {

        // either the timer or the auth listener finished, we should
        // stop the timer regardless
        stopTimer(timerId);

        // Determine if the timer or the auth listener finished first
        if (res === timeout) {

            // It was the timer, the user is logged out
            navActions.onUserLoggedOut();
        }

        // The other cases are handled by function registerLoginRedirecters
    });
}

function registerLoginRedirecters(navActions, backend, resolve) {
    backend.onAuthStateChange((user) => {
        resolve();

        try {
            if (user) {
                log.debug('User logged in');
                redirectToHomeIfOnLoadingScreen(navActions);
            } else {
                log.debug('User logged out - redirecting to login screen');
                navActions.onUserLoggedOut();
            }
        } catch (e) {
            log.error("Failed starting up: %s", e);
        }
    });
}

function redirectToHomeIfOnLoadingScreen(navActions) {
    const currentScreen = navActions.getCurrentScreen();
    if (currentScreen === "Loading" || currentScreen === 'Login') {
        log.debug('Was on the %s screen when logged in, redirecting to home', currentScreen);
        navActions.resetToHome();
    } else {
        log.debug('Current screen was %s, not redirecting anywhere', currentScreen);
    }
}

function startTimer(resolve, state) {
    return setTimeout(() => {
        resolve(timeout);
    }, 1000);
}

function stopTimer(timerId) {
    if (timerId) {
        clearTimeout(timerId);
    }
}
