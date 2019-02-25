// @flow

import React from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text  } from 'react-native';
import { ImageBackground, StandardButton, VerticalSpace, ActivityIndicator } from '~/src/shared/components';
import { openSettings } from '~/src/navigation-actions.js';
import { startRandomSession } from '~/src/features/session/random-session-service.js';
import { statusBarHeight } from '~/src/styles/status-bar-height.js';
import { constants } from '~/src/styles/constants.js';

import { navigate, UNSAFE_navigateTo } from '~/src/navigation-actions.js';
import { routes } from '~/src/routes.js';
import { randomSessionService } from '~/src/features/session/random-session-service.js';
import { log } from '~/src/services/logger.js';
import { cogwheel } from '~/src/utils/images.js';

const contentStyle = {
    paddingTop: statusBarHeight + constants.space(),
    ...constants.padflex,
    flexDirection: 'column',
    justifyContent: 'space-between',
};

type Props = {};
type State = {
    loading: boolean,
};
export class DebugScreen extends React.Component<Props, State> {
    static navigationOptions = {
        header: null,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    _openSettings() {
        openSettings();
    }

    _startSession() {
        startRandomSession();
    }

    _lessonSelector() {
        UNSAFE_navigateTo('LessonSelector');
    }

    render() {
        return (
            <ImageBackground>
                <View style={contentStyle}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={this._openSettings.bind(this)}>
                            <Image style={{ width: 40, height: 40 }} source={cogwheel} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <StandardButton
                            title={'Emotion details'}
                            onPress={() =>
                                navigate(routes.EmotionDetails, {
                                    emotion: randomSessionService
                                        .getEmotionPool()
                                    .filter(e => e.name === 'bitter')[0],
                                })
                            }
                        />
                        <VerticalSpace />

                        <StandardButton
                            title={'How are you feeling right now?'}
                            onPress={() => UNSAFE_navigateTo('CurrentFeeling', { skippable: true })}
                        />
                        <VerticalSpace />

                        <StandardButton
                            title={'Pitch'}
                            onPress={() => UNSAFE_navigateTo('Pitch')}
                        />
                        <VerticalSpace />

                        <StandardButton
                            title={'Real home'}
                            onPress={() => UNSAFE_navigateTo('AlwaysHome')}
                        />
                        <VerticalSpace />

                        <StandardButton
                            title={'Start session'}
                            onPress={this._startSession.bind(this)}
                        />
                        <VerticalSpace />

                        <StandardButton
                            title={'Lesson Selector'}
                            onPress={this._lessonSelector.bind(this)}
                        />
                        <VerticalSpace />

                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
}
