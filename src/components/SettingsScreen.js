// @flow

import React from 'react';
import { View, Switch } from 'react-native';
import { StandardText } from '~/src/components/lib/Texts';
import { StandardButton } from '~/src/components/lib/Buttons.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { constants } from '~/src/styles/constants.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { deviceStorage } from '~/src/services/storage.js';
import { onUserLoggedOut, navigateToRegister } from '~/src/navigation-actions.js';
import * as currentEmotionNotification from '~/src/services/current-emotion-notification.js';
import { log } from '~/src/services/logger.js';

import type { User } from '~/src/services/user-backend.js';
import type { Storage } from '~/src/services/storage.js';

type Props = {
    userBackend: typeof userBackendFacade,
    storage: Storage,
};
export class SettingsScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        title: 'SETTINGS',
    };

    static defaultProps = {
        userBackend: userBackendFacade,
        storage: deviceStorage,
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
                title="Current emotion notifications"
                testID="current-emotion-notification-toggle"
                onChange={on => {
                    if (on) {
                        currentEmotionNotification.scheduleNotification();
                    } else {
                        currentEmotionNotification.cancelNotification();
                    }
                }}
                storageKey={'current-emotion-notification'}
                storage={this.props.storage} />

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

        return <View>
            <StandardText>{ this.props.title }</StandardText>
            <Switch
                value={this.state.value}
                onValueChange={ on => {
                    this.setState({ value: on });
                    this.props.storage.setValue(this.props.storageKey, on.toString())
                        .catch(e => {
                            log.error('Failed storing current-emotion-notification value: %s', e);
                        });

                    this.props.onChange(on);
                }} />
        </View>
    }
}
