// @flow

import RNfirebase from 'react-native-firebase';
//import firebase from '../../tests/firebase-mock.js';

export const firebase = RNfirebase.initializeApp({
    debug: true,
    persistence: true,
});