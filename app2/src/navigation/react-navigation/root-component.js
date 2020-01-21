// @flow

import * as React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { initialScreen, screens } from './screens.js';
import { navigator } from './navigator.js';

// react-navigation creates a react component that needs to be passed to
// react-native's AppRegistry.registerComponent
//
// The react-navigation docs says
//   createStackNavigator is a function that returns a React component. It takes
//   a route configuration object and, optionally, an options object (we omit
//   this below, for now). createAppContainer is a function that returns a React
//   component to take as a parameter the React component created by the
//   createStackNavigator, and can be directly exported from App.js to be used
//   as our App's root component.
const AppNavigator = createStackNavigator(screens, {
    initialRouteName: initialScreen,
});

const AppContainer = createAppContainer(AppNavigator);

export function RootComponent() {
    // $FlowFixMe: No idea :(
    return <AppContainer
            ref={navRef => {
                navigator._setInternalNavigator(navRef);
            }}
             />
}