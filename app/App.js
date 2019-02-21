// @flow

import React from 'react';
import { Platform, Alert } from 'react-native';
import { createAppContainer, createStackNavigator, NavigationActions } from 'react-navigation';

import { LoadingScreen } from './src/shared/LoadingScreen.js';
import { PitchScreen } from './src/features/pitch/PitchScreen.js';
import { HomeScreen } from './src/features/home/HomeScreen.js';
import { SettingsScreen } from './src/features/settings/SettingsScreen.js';
import { ResetPasswordScreen } from './src/features/user-management/ResetPasswordScreen.js';
import { SessionScreen } from './src/features/session/SessionScreen.js';
import { SessionReportScreen } from './src/features/session/report/SessionReportScreen.js';
import { EmotionDetailsScreen } from './src/features/emotion-details/EmotionDetailsScreen.js';
import { CurrentFeelingScreen } from './src/features/current-emotion/CurrentFeelingScreen.js';
import { LoginScreen } from './src/features/user-management/LoginScreen.js';
import { EmailAuthScreen } from './src/features/user-management/EmailAuthScreen.js';
import { DebugScreen } from './src/features/home/DebugScreen.js';
import { LessonSelectorScreen } from './src/features/lesson-selector/LessonSelectorScreen.js';

import { log } from '~/src/services/logger.js';
import { setNavigation, setCurrentScreen, setRouteToDirectToOnLoad, navigate } from './src/navigation-actions.js';
import { constants } from './src/styles/constants.js';

const defaultScreenProps = {
    navigationOptions: {
        headerStyle: {
            backgroundColor: constants.primaryColor,
        },
        headerTintColor: constants.notReallyWhite,
    },
};

// $FlowFixMe
const rootNavigator = createStackNavigator({
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

    LessonSelector: { screen: LessonSelectorScreen, ...defaultScreenProps },

    // Since the "Home" screen gives the debug screen in dev mode but I want to be able to see the
    // real home screen in dev too I need a second screen for this :)
    AlwaysHome: { screen: HomeScreen },
}, {
    initialRouteName: 'Loading',
});

const AppNavigationContainer = createAppContainer(rootNavigator);

// The props available in navigationOptions is a little hard to find, so
// the link is here https://reactnavigation.org/docs/navigators/stack#StackNavigatorConfig

/////  DEEP LINKING
// on Android, the URI prefix typically contains a host in addition to scheme
// on Android, note the required / (slash) at the end of the host property
const deepLinkingPrefix = Platform.OS == 'android' ? 'safepsyc://safepsyc/' : 'safepsyc://';
const previousGetActionForPathAndParams = rootNavigator.router.getActionForPathAndParams;
Object.assign(rootNavigator.router, {
    getActionForPathAndParams(path, params) {
        if (path.startsWith("open/")) {
            const screen = path.substr("open/".length);
            setRouteToDirectToOnLoad(screen);
        }

        return previousGetActionForPathAndParams(path, params);
    },
});

///// SCREEN TRACKING
function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }

    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
}

export default class App extends React.Component<{}, {}> {

    render() {
        // $FlowFixMe
        return <AppNavigationContainer
            ref={ r => setNavigation(r) }
            uriPrefix={ deepLinkingPrefix }
            onNavigationStateChange={ (prevState, currentState) => {
                if (currentState.isTransitioning) return;

                const currentScreen = getActiveRouteName(currentState);
                if (currentScreen) {
                    setCurrentScreen(currentScreen);
                }
            }}
        />
    }
}
