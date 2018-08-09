import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { LoadingScreen } from './src/components/LoadingScreen.js';
import { PitchScreen } from './src/components/PitchScreen.js';
import { HomeScreen } from './src/components/HomeScreen.js';
import { SettingsScreen } from './src/components/SettingsScreen.js';
import { ResetPasswordScreen } from './src/components/ResetPasswordScreen.js';
import { SessionScreen } from './src/components/session/SessionScreen.js';
import { SessionReportScreen } from './src/components/session/report/SessionReportScreen.js';
import { EmotionDetailsScreen } from './src/components/EmotionDetailsScreen.js';
import { CurrentFeelingScreen } from './src/components/CurrentFeelingScreen.js';
import { LoginScreen } from './src/components/LoginScreen.js';
import { EmailAuthScreen } from './src/components/EmailAuthScreen.js';
import { DebugScreen } from './src/components/DebugScreen.js';

import { setNavigation } from './src/navigation-actions.js';
import { constants } from './src/styles/constants.js';

const defaultScreenProps = {
    navigationOptions: {
        headerStyle: {
            backgroundColor: constants.primaryColor,
        },
        headerTintColor: constants.notReallyWhite,
    },
};

const RootNavigator = createStackNavigator({
    Loading: { screen: LoadingScreen },
    Pitch: { screen: PitchScreen },
    Login: { screen: LoginScreen },
    EmailAuth: { screen: EmailAuthScreen },
    Home: { screen: __DEV__ ? DebugScreen : HomeScreen },

    Settings: { screen: SettingsScreen, ...defaultScreenProps },
    ResetPassword: { screen: ResetPasswordScreen, ...defaultScreenProps },

    Session: { screen: SessionScreen, ...defaultScreenProps },
    SessionReport: { screen: SessionReportScreen, ...defaultScreenProps },
    EmotionDetails: { screen: EmotionDetailsScreen, ...defaultScreenProps },
    CurrentFeeling: { screen: CurrentFeelingScreen, ...defaultScreenProps },

    // Since the "Home" screen gives the debug screen in dev mode but I want to be able to see the
    // real home screen in dev too I need a second screen for this :)
    AlwaysHome: { screen: HomeScreen },
}, {
    initialRouteName: 'Loading',
});

// The props available in navigationOptions is a little hard to find, so
// the link is here https://reactnavigation.org/docs/navigators/stack#StackNavigatorConfig

export default function App(props) {
    return <RootNavigator ref={ r => setNavigation(r) } />
};
