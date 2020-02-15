// @flow
import { createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import type { NavigationStackProp } from 'react-navigation';
import type { Screen } from './screens.js';

export type Navigator = NavigationStackProp<any>;
export class ReactNavigationNavigator {
    _internalNavigator: ?Navigator;

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
    _setInternalNavigator(navigator: Navigator) {
        this._internalNavigator = navigator;
    }

    _getNavigatorOrThrow(): Navigator {
        if (this._internalNavigator) {
            return this._internalNavigator;
        } else {
            throw new Error('navigation has not been initialized yet');
        }
    }
    //////////////////// internals //////////////////////////
    /////////////////////////////////////////////////////////
}

export const navigator = new ReactNavigationNavigator();