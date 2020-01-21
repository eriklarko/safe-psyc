// @flow
//
// Go to react-navigation.js to add routes or to configure react-navigation
//

import React from 'react';
import { ReactNavigationRoot } from './react-navigation.js';

export class Navigator {

    getRootComponent() {
        return ReactNavigationRoot
    }
}

export const navigator = new Navigator()