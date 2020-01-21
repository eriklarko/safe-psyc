// @flow
// @format

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import { navigator } from './src/navigation';

AppRegistry.registerComponent(appName, () => navigator.getRootComponent);

