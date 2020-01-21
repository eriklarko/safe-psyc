// @flow
// @format

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import { RootComponent } from './src/navigation/react-navigation/root-component.js';

AppRegistry.registerComponent(appName, () => RootComponent);
