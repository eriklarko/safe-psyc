// @flow

import React from 'react';
import { View, Switch } from 'react-native';
import { StandardText, StandardButton, VerticalSpace, ActivityIndicator } from '~/src/shared/components';
import { constants } from '~/src/styles/constants.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { onUserLoggedOut, navigateToRegister } from '~/src/navigation-actions.js';
import * as currentEmotionNotification from '~/src/features/current-emotion/current-emotion-notification.js';
import { log } from '~/src/services/logger.js';

import { deviceStorage } from './device-storage.js';
import { accountStorage } from './account-storage.js';

import type { User } from '~/src/services/user-backend.js';

type Props = {
    userBackend: typeof userBackendFacade,
    deviceStorage: typeof deviceStorage,
    accountStorage: typeof deviceStorage,
};
export class SettingsScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        title: 'SETTINGS',
    };

    static defaultProps = {
        userBackend: userBackendFacade,
        deviceStorage: deviceStorage,
        accountStorage: accountStorage,
    }

    render() {
        const user = this.props.userBackend.getLoggedInUser();
        if (!user) {
            return <StandardText>Cannot show settings when there's no user logged in</StandardText>
        }

        const logout = this._renderLogout(user);
        return <View style={constants.padflex}>
            <StandardText>Hi { user.email }</StandardText>

            <VerticalSpace />

            <Toggle
                title='Ask current emotion question'
                testID='ask-current-emotion-question-toggle'
                storageKey={'ask-current-emotion-question'}
                storage={this.props.accountStorage} />
            <Toggle
                title='Current emotion notifications'
                testID='current-emotion-notification-toggle'
                onChange={on => {
                    if (on) {
                        return currentEmotionNotification.scheduleNotification()
                            .catch( e => {
                                log.error('scheduleNotification error', e);
                                throw e;
                            });
                    } else {
                        return currentEmotionNotification.cancelNotification()
                            .catch( e => {
                                log.error('cancelNotification error', e);
                                throw e;
                            });
                    }
                }}
                storageKey={'current-emotion-notification'}
                storage={this.props.deviceStorage} />

            <VerticalSpace />
            { logout }
        </View>
    }

    _renderLogout(user) {

        if (user.isAnonymous) {
            return <View>
                <StandardText>
                    { /* hehe, this is the worst text I've ever written */ }
                    If you want your progress to be kept across app installs you will need to register
                </StandardText>
                <VerticalSpace />
                <StandardButton
                    title={'Register'}
                    onPress={navigateToRegister}
                />
                <VerticalSpace />
                { __DEV__ && <LogoutButton title='Log out - all data will be lost'/> }
            </View>
        } else {
            return <View>
                <LogoutButton title='Log out'/>
            </View>
        }
    }
}

function LogoutButton(props: { title: string }) {
    const { title } = props;
    return <StandardButton
            onPress={() =>
                userBackendFacade
                    .logOut()
                    // this .then might not be necessary...
                    .then(() => onUserLoggedOut())
            }
            title={title}
        />
}

class Toggle extends React.Component<*, { value: 'loading' | boolean | Error }> {

    constructor(props) {
        super(props);

        this.state = {
            value: 'loading',
        };
    }

    componentWillMount() {
        this.props.storage.getValue(this.props.storageKey)
            .then( val => {
                this.setState({ value: val === 'true' });
            })
            .catch( e => {
                this.setState({ value: e });
                log.error('Failed loading setting %s: %s', this.props.storageKey, e);
            });
    }

    render() {
        if (this.state.value === 'loading') {
            return <ActivityIndicator size='large' />
        }

        if (this.state.value instanceof Error) {
            return <StandardText>{ this.state.value.message }</StandardText>
        }

        const { storageKey, onChange } = this.props;

        return <View>
            <StandardText>{ this.props.title }</StandardText>
            <Switch
                value={this.state.value}
                onValueChange={ on => {
                    if (onChange) {
                        const v = onChange(on);
                        if (v instanceof Promise) {
                            return v.then( set => this._setValue(on));
                        } else {
                            this._setValue(on);
                        }
                    }

                }} />
        </View>
    }

    _setValue(on: bool) {
        const { storage, storageKey } = this.props;
        return storage.setValue(storageKey, on.toString())
            .then( () => {
                this.setState({ value: on });
            })
            .catch(e => {
                log.error('Failed storing %s: %s', storageKey, e);
            });
    }
}
