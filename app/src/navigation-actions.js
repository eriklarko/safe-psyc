// @flow

import { InteractionManager, Alert } from 'react-native';
import moment from 'moment';
// $FlowFixMe
import { NavigationActions, StackActions } from 'react-navigation';
import { randomSessionService } from '~/src/features/session/random-session-service.js';
import { deviceStorage } from '~/src/features/settings/device-storage.js';
import { accountStorage } from '~/src/features/settings/account-storage.js';
import { SettingsKeys } from '~/src/features/settings/settings.js';
import { log } from '~/src/services/logger.js';

import type { Emotion } from '~/src/models/emotion.js';
import type { CurrentEmotionBackendFacade } from '~/src/features/current-emotion/current-emotion-backend.js';
import type { AccountStorage } from '~/src/features/settings/account-storage.js';
import type { Report } from '~/src/features/session/report/SessionReport.js';
import type { Route } from '~/src/routes.js';

export type Navigation<P> = {
    dispatch: Object => void,
    state?: {
        params: P,
    },
    addListener: ('willBlur'|'willFocus'|'didBlur'|'didFocus', () => void) => Subscription,
};

export type Subscription = {
    remove: () => void,
};



let navigation: ?Navigation<mixed> = null;
function safeNavigation() {
    if (navigation) return navigation;
    else throw new Error("Tried to navigate but the navigation handle was not set");
}
export function setNavigation(nav: Navigation<mixed>) {
    navigation = nav;
}

let routeToDirectToOnLoad: ?Route = null;
export function setRouteToDirectToOnLoad(name: Route) {
    routeToDirectToOnLoad = name;
}
export function getRouteToDirectToOnLoad(): ?Route {
    return routeToDirectToOnLoad;
}

let currentScreen: ?Route = null;
export function setCurrentScreen(name: Route) {
    currentScreen = name;
}
export function getCurrentScreen(): ?Route {
    return currentScreen;
}

// TODO: can be replaced by navigation.getParam('name', default);
export function paramsOr<T, S>(navigation: Navigation<T>, or: S): T | S {
    return navigation.state && navigation.state.params ? navigation.state.params : or;
}

export function startRandomSession(onDataLoaded?: () => void): Promise<{}> {
    log.event("START_RANDOM_SESSION");
    return new Promise(resolve => {
        InteractionManager.runAfterInteractions(() => {

            randomSessionService.getRandomQuestions()
                .then( questions => {
                    onDataLoaded && onDataLoaded();
                    navigate('Session', {
                        questions: questions,
                    });

                    resolve();
                });
        });
    });
}

export function navigate(routeName: Route, params?: Object) {
    safeNavigation().dispatch(
        NavigationActions.navigate({ routeName, params }),
    );
}

export function navigateToEmotionDetails(emotion: Emotion) {
    navigate('EmotionDetails', {
        emotion: emotion,
    });
}

export function navigateToSessionReport(report: Report) {
    safeNavigation().dispatch(
        StackActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: 'Home' }),
                NavigationActions.navigate({
                    routeName: 'SessionReport',
                    params: {
                        report: report,
                    },
                }),
            ],
        })
    );
}

export function routeToCurrentFeelingOrHome(
    emotionBackend: CurrentEmotionBackendFacade,
    settingsBackend: AccountStorage,

): Promise<*> {
    return emotionBackend
        .getLastEmotionAnswer()
        .then(answer => {
            if (answer) {
                const eightHoursAgo = moment().subtract(8, 'hours');
                const haveAlreadyAnswered = eightHoursAgo.isBefore(answer.when);

                return haveAlreadyAnswered;
            } else {
                return false;
            }
        })
        .then(haveAlreadyAnswered => {
            return settingsBackend.getValue(SettingsKeys.ASK_CURR_EM_Q)
                .then (wantsToBeAsked => {
                    return {
                        haveAlreadyAnswered,
                        wantsToBeAsked,
                    };
                });
        })
        .then(context => {
            const { haveAlreadyAnswered, wantsToBeAsked } = context;
            const shouldAskHowTheUserIsFeeling = !haveAlreadyAnswered && wantsToBeAsked;

            if (shouldAskHowTheUserIsFeeling) {
                const resetAction = StackActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({
                            routeName: 'CurrentFeeling',
                            params: {
                                skippable: true,
                            },
                        }),
                    ],
                });
                safeNavigation().dispatch(resetAction);
            } else {
                resetToHome();
            }
        })
        .catch(e => {
            log.error('Unable to navigate onSessionFinished', e);
            Alert.alert('ERROR', 'Unable to navigate onSessionFinished.\n' + e);
        });
}

export function toResetPassword(email?: string) {
    navigate('ResetPassword', {
        email: email,
    });
}

export function openSettings() {
    navigate('Settings');
}

export function onUserRegistered() {
    navigate('Home');
}

export function onUserLoggedIn() {
    resetToHome();
}

export function onUserLoggedOut(storage: * = deviceStorage): Promise<void> {
    return storage
        .getValue('hasSeenThePitch')
        .then(hasSeenThePitch => {
            if (hasSeenThePitch === 'true') {
                return 'Login';
            } else {
                return 'Pitch';
            }
        })
        .catch(e => {
            log.warn('Failed reading async storage: %s', e);
            return 'Pitch';
        })
        .then(route => {
            resetTo(route);
        });
}

export function resetTo(routeName: Route) {
    safeNavigation().dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: routeName })],
        })
    );
}

export function resetToHome() {
    resetTo('Home');
}

export function resetToLogin() {
    resetTo('Login');
}

export function navigateToEmailLogIn() {
    navigate('EmailAuth', {
        action: 'login',
    });
}

export function navigateToRegister() {
    navigate('EmailAuth', {
        action: 'register',
    });
}

export function UNSAFE_navigateTo(screen: Route, params?: Object) {
    navigate(screen, params);
}
