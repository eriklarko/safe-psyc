// @flow

import * as React from 'react';
import { createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import type { NavigationStackProp } from 'react-navigation';

/////////////////////////////////////////////////////////
////////////////// ADD NEW SCREENS HERE /////////////////
import { Home } from '../home';
import { Loading } from '../loading';

const initialScreen: Screen = 'Loading';
const screens = {
    Loading: {
        screen: Loading,
    },
    Home: {
        screen: Home,
    },
};
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////


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
// $FlowFixMe: There's something hard to understand going on with generics here. Let's ignore flow instead.
const AppContainer = createAppContainer(AppNavigator);

type Screen = $Keys<typeof screens>;
type Navigator = NavigationStackProp<any>;
export class ReactNavigationNavigator {
    navigator: ?Navigator;

    resetToHome() {
        this.resetTo('Home');
    }

    resetTo(screen: Screen) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: screen })],
        });
        this._getNavigatorOrThrow().dispatch(resetAction);
    }

    /////////////////////////////////////////////////////////
    //////////////////// internals //////////////////////////

    // `this` was hard for this function because of how it's passed to
    // AppRegistry.registerComponent, so I bind `this` here using an arrow
    // function
    getRootComponent = () => {
        return <AppContainer
                // $FlowFixMe: The type of ref here is `(mixed) => void` but it'll always be something navigatable so it's fine
                ref={this._setNavigator} />
    }

    // same problem here with `this` :(
    _setNavigator = (navigator: Navigator) => {
        this.navigator = navigator;
    }

    _getNavigatorOrThrow(): Navigator {
        if (this.navigator) {
            return this.navigator;
        } else {
            throw new Error("navigation has not been initialized yet");
        }
    }
    //////////////////// internals //////////////////////////
    /////////////////////////////////////////////////////////
}

export const navigator = new ReactNavigationNavigator()