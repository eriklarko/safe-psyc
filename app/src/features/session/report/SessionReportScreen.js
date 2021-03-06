// @flow

import React from 'react';
import { View, ScrollView } from 'react-native';
import { StandardText, StandardButton, VerticalSpace } from '~/src/shared/components';
import { SessionReport } from './SessionReport.js';

import { paramsOr } from '~/src/navigation-actions.js';
import { navigateToCurrentFeelingOrHome } from '~/src/features/current-emotion/navigation.js'
import { currentEmotionBackendFacade } from '~/src/features/current-emotion/current-emotion-backend.js';
import { accountStorage } from '~/src/features/settings/account-storage.js';
import { constants } from '~/src/styles/constants.js';

import type { Navigation } from '~/src/navigation-actions.js';
import type { Question } from '~/src/models/questions.js';
import type { Emotion } from '~/src/models/emotion.js';
import type { Report } from './SessionReport.js';

const backgroundStyle = {
    backgroundColor: constants.notReallyWhite,
    flex: 1,
};

type Props = {
    navigation: Navigation<{
        report: Report,
    }>,
};
export class SessionReportScreen extends React.Component<Props, {}> {

    static navigationOptions = {
        title: 'Session Report',
        headerLeft: <View/>,
    };

    _onDismiss() {
        navigateToCurrentFeelingOrHome(currentEmotionBackendFacade, accountStorage);
    }

    render() {
        const report = paramsOr(this.props.navigation, { report: new Map() }).report;

        return (
            <ScrollView style={backgroundStyle} contentContainerStyle={constants.padding}>
                <StandardText>
                    Great job! Congratulations on finishing the session, here's a summary of the
                    emotions you saw!
                </StandardText>

                <VerticalSpace multiplier={4} />
                <SessionReport report={report} />
                <VerticalSpace multiplier={4} />

                <StandardButton title={'Done!'} onPress={this._onDismiss.bind(this)} />
            </ScrollView>
        );
    }
}
