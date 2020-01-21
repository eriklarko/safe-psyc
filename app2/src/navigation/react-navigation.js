// @flow

import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Home } from '../home';

const initialRoute = "Home";
const screens = {
    Home: {
        screen: Home,
    },
};

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
//
// I tried making ReactNavigationRoot a functional component but it doesn't work :(

const AppNavigator = createStackNavigator(screens, {
    initialRouteName: initialRoute,
});

// $FlowFixMe
const AppContainer = createAppContainer(AppNavigator);

export class ReactNavigationRoot extends React.Component<{}, {}> {
  render() {
    return <AppContainer />;
  }
}
