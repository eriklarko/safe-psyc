// @flow

import React from 'react';
import { View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ImageBackground } from './ImageBackground.js';
import { HeroButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { startRandomSession, openSettings } from '../navigation-actions.js';
import { statusBarHeight } from '../styles/status-bar-height.js';
import { constants } from '../styles/constants.js';
import { log } from '../services/logger.js';

import type { Navigation } from '../navigation-actions.js';

const contentStyle = {
    paddingTop: statusBarHeight + constants.space(),
    padding: constants.space(),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
};

type Props = {
    navigation: Navigation<{}>,
};
type State = {
    loading: boolean,
};
export class HomeScreen extends React.Component<Props, State> {
    static navigationOptions = {
        header: null,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    componentDidMount() {
        log.event('HOME_SCREEN_MOUNTED');
    }

    _openSettings() {
        openSettings(this.props.navigation);
    }

    _startSession() {
        const onNavDataLoaded = () => {
            this.setState({ loading: false });
        };

        const onStateUpdated = () => {
            startRandomSession(this.props.navigation, onNavDataLoaded);
        };

        this.setState({ loading: true }, onStateUpdated);
    }

    render() {
        const sessionButtonContent = this.state.loading ? <ActivityIndicator /> : 'Start session';

        // $FlowFixMe
        const cogwheel = require('../../images/settings.png');
        return (
            <ImageBackground>
                <View style={contentStyle}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={this._openSettings.bind(this)}>
                            <Image style={{ width: 40, height: 40 }} source={cogwheel} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <HeroButton
                            title={"View progress"}
                            disabled={true}
                            style={{ height: 90 }}
                        />
                        <VerticalSpace />
                        <HeroButton
                            title={sessionButtonContent}
                            onPress={this._startSession.bind(this)}
                            style={{ height: 90 }}
                        />
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
