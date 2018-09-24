// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { ImageBackground } from '~/src/components/lib/ImageBackground.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { remoteConfigBackendFacade } from '~/src/services/remote-config-backend.js';
import { log } from '~/src/services/logger.js';
import * as navigationActions from '~/src/navigation-actions.js';

// used to indicate that the login timer timed out
const timeout = "TIMEOUT";

type Props = {
    navigationActions: typeof navigationActions,
    userBackend: typeof userBackendFacade,
};
export class LoadingScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        header: null,
    };

    // only used for testing
    static defaultProps = {
        navigationActions: navigationActions,
        userBackend: userBackendFacade,
    };

    autologinTimeout = null;

    componentDidMount() {
        this._startLoading().catch(e => {
            log.error('Failed loading the app, %s', e);

            Alert.alert('Failed loading the app', e.message);
        });
    }

    async _startLoading() {
        await remoteConfigBackendFacade.load();
        await this._checkIfLoggedIn()
    }

    async _checkIfLoggedIn() {
        return new Promise((resolve, reject) => {
            // fire off both the auth listener and a timer,
            // if the timer finishes first, the user isn't logged in
            // if the listener fires first, we handle the redirection
            // in _registerLoginRedirecters

            this._registerLoginRedirecters(this.props.userBackend, resolve);
            this._startTimeout(resolve);
        }).then( res => {

            // either the timer or the auth listener finished, we should
            // stop the timer regardless
            this._clearTimeout();

            // Determine if the timer or the auth listener finished first
            if (res === timeout) {

                // It was the timer, the user is logged out
                this.props.navigationActions.onUserLoggedOut();
            }

            // The other cases are handled by _registerLoginRedirecters
        });

    }

    _registerLoginRedirecters(backend, resolve) {
        backend.onAuthStateChange((user) => {
            resolve();

            if (user) {
                log.debug('User logged in');
                this._redirectToHomeIfOnLoadingScreen();
            } else {
                log.debug('User logged out - redirecting to login screen');
                this.props.navigationActions.onUserLoggedOut();
            }
        });
    }

    _redirectToHomeIfOnLoadingScreen() {
        const currentScreen = "Loading";
        if (currentScreen === "Loading") {
            this.props.navigationActions.resetToHome();
        }
    }

    _startTimeout(resolve) {
        this.autologinTimeout = setTimeout(() => {
            resolve(timeout);
        }, 1000);
    }

    _clearTimeout() {
        if (this.autologinTimeout) {
            clearTimeout(this.autologinTimeout);
        }
    }

    componentWillUnmount() {
        this._clearTimeout();
    }

    render() {
        return (
            <ImageBackground>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            </ImageBackground>
        );
    }
}
