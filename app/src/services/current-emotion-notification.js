// @flow

import { Platform, Alert, PushNotificationIOS } from 'react-native';
import { log } from '~/src/services/logger.js';
import { resetTo } from '~/src/navigation-actions.js';
import firebase from 'react-native-firebase';
import moment from 'moment';
import cronParser from 'cron-parser';

type Channel = { channelId: string };

const pamNotificationId = 'pam-notifictaion';

let _channel = null;
function initialize(): Promise<Channel> {
    return new Promise( (resolve, reject) => {
        if (_channel) {
            resolve(_channel);
        }

        return getPermissions()
            .then( () => createChannel() )
            .then( channel => {
                _channel = channel;
                resolve(channel);
            })
            .catch( e => reject(e) );
    });
}

function getPermissions() {
    return firebase.messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
                // user has permissions
                return true;
            } else {
                // user doesn't have permission
                return firebase.messaging().requestPermission();
            }
        });
}

function createChannel(): Promise<Channel> {
    const channel = new firebase
        .notifications
        .Android
        .Channel('current-emotion-question-channel', 'How are you feeling questions channel', firebase.notifications.Android.Importance.Max)

    // Create the channel
    return firebase.notifications().android.createChannel(channel)
        .then( () => channel);
}

export function scheduleNotification(): Promise<mixed> {
    return initialize()
        .then( channel => {
            return cancelNotification()
                .then( () => channel );
        })
        .then( channel => {
            log.debug('Scheduling local current emotion notification');

            const notification = createNotification(channel);

            const nextFireDate = getNextFireDate(notification.data.schedule);
            return firebase.notifications().scheduleNotification(notification, {
                fireDate: nextFireDate.getTime(),
            });
        });
}

export function cancelNotification(): Promise<void> {
    log.debug('Cancelling current emotion notification');

    return firebase
        .notifications()
        .cancelNotification(pamNotificationId);
}

function createNotification(channel) {
    return new firebase.notifications.Notification()
        .setNotificationId(pamNotificationId)
        .setTitle('How are you feeling right now?')
        .setData({
            // Value from App.js
            route: 'CurrentFeeling',
            // “At minute 0 past every hour from 8 through 22.”
            schedule: '0 8-22 * * *',
            channelId: channel.channelId,
        })
        .android.setChannelId(channel.channelId)
        .android.setAutoCancel(true);
}

function getNextFireDate(cronExpr: string): Date {
    const interval = cronParser.parseExpression(cronExpr);
    return interval.next().toDate();
}

export function TEST_fire_notification_now(): Promise<void> {

    return initialize()
        .then( channel => {
            const notification = createNotification(channel);
            firebase.notifications().displayNotification(notification)
        });
}
