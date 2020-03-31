// @flow

import { withMockedAlert } from './MockAlert.js';
import { Alert } from 'react-native';

 it('shows an alert', () => {
      const funcShowingAlert = () => {
          Alert.alert('hello :)', null);
      };

      withMockedAlert(mock => {
          funcShowingAlert();
          expect(mock).toHaveBeenCalled();
      });
 });
