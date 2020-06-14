// @flow
//
// Screens are defined in react-navigation/screens.js
//
// Navigation usage:
//   import * as React from 'react';
//   import { Buttom } from 'react-native';
//   import { navigator } from '../navigation';
//
//   export function ButtonThatNavigates(props: {}) {
//     return <Button
//              title="navigate to home"
//              onPress={ () => navigator.resetToHome() }
//            />
//   }

export { navigator } from './react-navigation/navigator.js';
export { mockReactNavigation as installMockNavigator } from './react-navigation/mock.js';
export { Screen } from './react-navigation/screens.js';
