// @flow

import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createStackNavigator, NavigationActions } from 'react-navigation';

import { routeDetails, routes } from '~/src/routes.js';
import { log } from '~/src/services/logger.js';
import { setNavigation, setCurrentScreen, setRouteToDirectToOnLoad, navigate } from '~/src/navigation-actions.js';

// $FlowFixMe
const rootNavigator = createStackNavigator(routeDetails, {
    initialRouteName: routes.Loading,
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
