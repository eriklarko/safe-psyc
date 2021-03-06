// @flow

import React from 'react';
import { View, TextInput, FlatList } from 'react-native';

import { StandardText, VerticalSpace } from '~/src/shared/components';

import { emotionService } from '~/src/services/emotion-service.js';
import { resetToHome } from '~/src/navigation-actions.js';
import { log } from '~/src/services/logger.js';
import type { Navigation } from '~/src/navigation-actions.js';

import { PhotographicAffectMeter } from './PhotographicAffectMeter.js';
import { currentEmotionBackendFacade } from './current-emotion-backend.js';

type Props = {
    navigation: Navigation<{
        skippable: boolean,
    }>,
};
type State = {};
export class CurrentFeelingScreen extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'How are you feeling?',
    };

    _skip() {
        log.event('CURRENT_EMOTION_SKIPPED');
        resetToHome();
    }

    render() {
        const skippable =
            this.props.navigation.state && this.props.navigation.state.params
                ? !!this.props.navigation.state.params.skippable
                : false;

        const onSkip = skippable ? () => this._skip() : undefined;

        return (
            <PhotographicAffectMeter
                onAnswered={() => resetToHome()}
                onSkip={onSkip}
                backendFacade={currentEmotionBackendFacade}
                emotionImages={require('../../../SECRETS/pam/pam-images.json')}
            />
        );
    }
}
