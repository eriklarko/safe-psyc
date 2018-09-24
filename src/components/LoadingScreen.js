// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { ImageBackground } from '~/src/components/lib/ImageBackground.js';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { log } from '~/src/services/logger.js';
import { setCurrentScreen } from '~/src/navigation-actions.js';

export class LoadingScreen extends React.Component<{}, {}> {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        setCurrentScreen('Loading');
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
