// @flow

import firebase from 'react-native-firebase';
import { log } from '~/src/services/logger.js';
import cronParser from 'cron-parser';
import type { rnfNotification, NotificationOpen } from 'react-native-firebase';

type Notification = {
    ...rnfNotification,
    startedApp: bool,
};
export function addNotificationListener(cb: (Notification) => void) {

    let notificationListener: ?Function = null;
    let notificationOpenedListener: ?Function = null;
    let notificationDisplayedListener: ?Function = null;

    notificationDisplayedListener = firebase
        .notifications()
        .onNotificationDisplayed( (notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.

            const { data } = notification;
            if (data.schedule) {
                const nextFireDate = getNextFireDate(data.schedule);
                log.debug('rescheduling notifcation %s at %s', notification.notificationId, nextFireDate);
                notification = notification
                                .android
                                .setChannelId(data.channelId);
                return firebase.notifications().scheduleNotification(notification, {
                    fireDate: nextFireDate.getTime(),
                })
                .catch( e => {
                    log.error('failed rescheduling notification: %s', e);
                });
            }
        });

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
        notificationDisplayedListener && this.notificationDisplayedListener();
        notificationListener && this.notificationListener();
        notificationOpenedListener && this.notificationOpenedListener();
    };
}

function getNextFireDate(cronExpr: string): Date {
    const interval = cronParser.parseExpression(cronExpr);
    return interval.next().toDate();
}
