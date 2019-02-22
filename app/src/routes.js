// @flow

import { LoadingScreen } from '~/src/shared/LoadingScreen.js';
import { PitchScreen } from '~/src/features/pitch/PitchScreen.js';
import { HomeScreen } from '~/src/features/home/HomeScreen.js';
import { SettingsScreen } from '~/src/features/settings/SettingsScreen.js';
import { ResetPasswordScreen } from '~/src/features/user-management/ResetPasswordScreen.js';
import { SessionScreen } from '~/src/features/session/SessionScreen.js';
import { SessionReportScreen } from '~/src/features/session/report/SessionReportScreen.js';
import { EmotionDetailsScreen } from '~/src/features/emotion-details/EmotionDetailsScreen.js';
import { CurrentFeelingScreen } from '~/src/features/current-emotion/CurrentFeelingScreen.js';
import { LoginScreen } from '~/src/features/user-management/LoginScreen.js';
import { EmailAuthScreen } from '~/src/features/user-management/EmailAuthScreen.js';
import { DebugScreen } from '~/src/features/home/DebugScreen.js';
import { LessonSelectorScreen } from '~/src/features/lesson-selector/LessonSelectorScreen.js';

import { constants } from '~/src/styles/constants.js';

// This is very tied to react-navigation, perhaps it should be defined somewhere else
const defaultScreenProps = {
    navigationOptions: {
        headerStyle: {
            backgroundColor: constants.primaryColor,
        },
        headerTintColor: constants.notReallyWhite,
    },
};

export const routeDetails = {
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
};

export type Route = $Keys<typeof routeDetails>;

//
//  routes is {
//    Loading: "Loading",
//    Pitch: "Pitch",
//    ...
//    AlwaysHome: "AlwaysHome",
//  }
//
// and hould be used like this:
// in ~/src/.../somefile.js
//   import { navigateTo } from '~/src/navigation-actions.js';
//   import { routes } from '~/src/routes.js';
//
//   navigateTo(routes.CurrentFeeling);
//
export const routes : {[Route]: Route} = Object.keys(routeDetails)
    .reduce((acc, route) => {
        acc[route] = route;
        return acc;
    }, {});
