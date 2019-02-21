// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { ImageBackground, SquarePrimaryButton, SquareSecondaryButton, VerticalSpace, StandardText, ActivityIndicator, LogoBanner } from '~/src/shared/components';

import { constants } from '~/src/styles/constants.js';
import { navigateToEmailLogIn } from '~/src/navigation-actions.js';
import { userBackendFacade } from '~/src/services/user-backend.js';

type State = {
    loggingIn: 'no' | 'yes',
};
export class LoginScreen extends React.Component<{}, State> {
    static navigationOptions = {
        header: null,
    };

    constructor() {
        super();
        this.state = {
            loggingIn: 'no',
        };
    }

    _anonymousLogin() {

        this.setState({ loggingIn: 'yes' }, () => {

            userBackendFacade.createNewAnonymousUser()
                .catch( e => {
                    this.setState({ loggingIn: 'no' });
                    Alert.alert('Something went wrong', e.message);
                });
        });
    }

    render() {
        return (
            <ImageBackground>
                <View style={constants.colApart}>
                    <View style={{ paddingTop: constants.padding.paddingTop }} />
                    <LogoBanner />
                    <View style={styles.container}>

                        { this._renderLoginButton() }
                        <VerticalSpace />

                        <SquareSecondaryButton
                            title={'Have an account?'}
                            onPress={navigateToEmailLogIn}
                        />
                    </View>
                </View>
            </ImageBackground>
        )
    }

    _renderLoginButton(Component, containerStyle) {
        if (this.state.loggingIn === 'yes') {
            return <ActivityIndicator style={{ height: 69 }}/>

        } else {
            return <SquarePrimaryButton
                title={'Improve your EQ!'}
                onPress={this._anonymousLogin.bind(this)}
            />
        }
    }
}

const styles = {
    container: {
        ...constants.padflex,
        justifyContent: 'center',
    },
};
