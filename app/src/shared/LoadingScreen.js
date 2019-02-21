// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { ImageBackground, ActivityIndicator } from '~/src/shared/components';
import { setCurrentScreen, getRouteToDirectToOnLoad, resetTo } from '~/src/navigation-actions.js';
import { startLoading } from '~/src/services/startup.js';
import { log } from '~/src/services/logger.js';

export class LoadingScreen extends React.Component<{}, {}> {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        setCurrentScreen('Loading');
        startLoading()
            .then( () => {
                log.debug('Loading done');
                const onLoadRoute = getRouteToDirectToOnLoad();

                if(onLoadRoute) {
                    log.debug('Loading done - resetting to %s', onLoadRoute);
                    resetTo(onLoadRoute);
                }
            })
            .catch(e => {
                log.error('Failed loading the app, %s', e);
                Alert.alert('Failed loading the app', e.message);
            });
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
