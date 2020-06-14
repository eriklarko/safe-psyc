// @flow
import { StackActions, NavigationActions } from 'react-navigation';

import type { NavigationStackProp } from 'react-navigation';
import type { Screen } from './screens.js';
import type { Emotion } from '../../shared/models';
import type { Props as ReportProps } from '../../report';

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

    toEmotionDetails(emotion: Emotion) {
        this.navigateTo('EmotionDetails', {
            emotion: emotion,
        });
    }

    openReportFlow(params: ReportProps) {
        this.navigateTo('Report', params);
    }

    navigateTo(screen: Screen, params?: Object) {
        const navigateAction = NavigationActions.navigate({
          routeName: screen,
          params: params,
        });
        this._getNavigatorOrThrow().dispatch(navigateAction);
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
