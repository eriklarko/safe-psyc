// @flow

// $FlowFixMe
import { NavigationActions, StackActions } from 'react-navigation';
import { randomSessionService } from '~/src/features/session/random-session-service.js';
import { deviceStorage } from '~/src/features/settings/device-storage.js';
import { log } from '~/src/services/logger.js';

import type { Emotion } from '~/src/models/emotion.js';
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



// TODO: Rename to addNavigationFrame
export function navigate(routeName: Route, params?: Object) {
    safeNavigation().dispatch(
        NavigationActions.navigate({ routeName, params }),
    );
}

export function setNavigationStack(stack: Array<{ route: Route, params?: Object}>, index?: number) {
    safeNavigation().dispatch(
        StackActions.reset({
            index: index || stack.length - 1, // default to last route in stack
            actions: stack.map(s => NavigationActions.navigate({
                routeName: s.route,
                params: s.params,
            })),
        })
    );
}

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
