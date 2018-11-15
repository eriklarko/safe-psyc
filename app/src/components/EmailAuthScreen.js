// @flow

import React from 'react';
import {
    Text,
    View,
    TextInput,
    Alert,
    Keyboard,
} from 'react-native';
import { StandardText } from '~/src/components/lib/Texts.js';
import { SquarePrimaryButton, SquareSecondaryButton, SecondaryButton } from '~/src/components/lib/Buttons.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { ImageBackground } from '~/src/components/lib/ImageBackground.js';
import { FancyInput } from '~/src/components/lib/Inputs.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { constants } from '~/src/styles/constants.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { paramsOr, onUserLoggedIn, onUserRegistered, toResetPassword } from '~/src/navigation-actions.js';

import type { Navigation } from '~/src/navigation-actions.js';


type Props = {
    navigation: Navigation<{
        action: 'login' | 'register',
    }>,
};
type State = {
    loading: 'no' | 'yes',
    email: string,
    password: string,
};
export class EmailAuthScreen extends React.Component<Props, State> {
    static navigationOptions = {
        header: null,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: 'no',
            email:    __DEV__ ? 'lol@lol.lol' : '',
            password: __DEV__ ? 'lollol'      : '',
        };
    }

    _login() {
        const { email, password } = this.state;
        this.setState({
            password: '',
            loading: 'yes',
        });

        userBackendFacade
            .login(email, password)
            .then(() => {
                Keyboard.dismiss();
                onUserLoggedIn();
            })
            .catch(e => {
                this.setState({
                    loading: 'no',
                });
                Alert.alert('Login failed', e.message);
            });
    }

    _register() {
        const { email, password } = this.state;
        this.setState({
            password: '',
            loading: 'yes',
        });

        const action = (
            userBackendFacade.isLoggedIn()
                ? userBackendFacade.promoteAnonymousToNamed
                : userBackendFacade.createNewUser
        ).bind(userBackendFacade)

        action(email, password)
            .then(user => {
                Keyboard.dismiss();
                onUserRegistered();
            })
            .catch(e => {
                this.setState({
                    loading: 'no',
                });
                Alert.alert('Unable to create account', e.message);
            });
    }

    _resetPassword() {
        toResetPassword(this.state.email);
    }

    render() {
        const params = paramsOr(this.props.navigation, { action: 'register' });
        const button = this._renderActionButton(params.action);

        return (
            <ImageBackground>
                <View style={styles.container}>
                    <AnonymousLinkDescription />
                    <VerticalSpace />

                    <FancyInput
                        label={'Email'}
                        value={this.state.email}
                        keyboardType={'email-address'}
                        onChange={text => this.setState({ email: text })}
                    />

                    <VerticalSpace />
                    <FancyInput
                        label={'Password'}
                        secureTextEntry={true}
                        value={this.state.password}
                        onChange={text => this.setState({ password: text })}
                    />

                    <VerticalSpace multiplier={2} />
                    { button }
                </View>
            </ImageBackground>
        );
    }

    _renderActionButton(action) {
        if (this.state.loading === 'yes') {
            return <ActivityIndicator />

        } else if (action === 'register') {
                return <SquarePrimaryButton
                    onPress={this._register.bind(this)}
                    disabled={this.state.loading !== 'no'}
                    title={'Register'}
                />

        } else {
            return <View>
                <SquarePrimaryButton
                    onPress={this._login.bind(this)}
                    disabled={this.state.loading !== 'no'}
                    title={'Log in'}
                />
                <VerticalSpace />
                <SecondaryButton
                    title="forgot password"
                    onPress={this._resetPassword.bind(this)}
                    textStyle={{
                        color: constants.notReallyWhite,
                        textAlign: 'left',
                    }}
                />
            </View>
        }
    }
}

function AnonymousLinkDescription() {
    const user = userBackendFacade.getLoggedInUser();
    if (user && user.isAnonymous) {
        return <StandardText>
            You can register and make sure all you data is accessible whenever you want.
        </StandardText>
    } else {
        return null;
    }
}

const styles = {
    container: {
        ...constants.padflex,
        justifyContent: 'center',
    },
};

