// @flow

import firebase from 'react-native-firebase';
import { log } from '~/src/services/logger.js';
import type { rnfNotification, NotificationOpen } from 'react-native-firebase';

type Notification = {
    ...rnfNotification,
    startedApp: bool,
};
export function addNotificationListener(cb: (Notification) => void) {

    let notificationListener: ?Function = null;
    let notificationOpenedListener: ?Function = null;

    //notificationDisplayedListener: Function;
    /*this.notificationDisplayedListener = firebase
        .notifications()
        .onNotificationDisplayed( (notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.

            this._trace('onNotificationDisplayed', notification);
        });*/

    notificationListener = firebase
        .notifications()
        .onNotification( (notification: Notification) => {
            // Process your notification as required
            cb({
                ...notification,
                startedApp: false,
            });
        });

    notificationOpenedListener = firebase
        .notifications()
        .onNotificationOpened( (notificationOpen: NotificationOpen) => {
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;

            cb({
                ...notification,
                startedApp: false,
            });
        });

    firebase
        .notifications()
        .getInitialNotification()
        .then((notificationOpen: NotificationOpen) => {
            if (notificationOpen) {
                // Get information about the notification that was opened
                const notification: Notification = notificationOpen.notification;  

                cb({
                    ...notification,
                    startedApp: true,
                });
            }
        })
        .catch(e => {
            log.error('getInitialNotification error', e);
        });

    return () => {
        //notificationDisplayedListener && this.notificationDisplayedListener();
        notificationListener && this.notificationListener();
        notificationOpenedListener && this.notificationOpenedListener();
    };
}
