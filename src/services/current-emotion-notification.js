// @flow

import { Platform, Alert, PushNotificationIOS } from 'react-native';
import { log } from '~/src/services/logger.js';
import { resetTo } from '~/src/navigation-actions.js';
import firebase from 'react-native-firebase';
import moment from 'moment';

type Channel = { channelId: string };

const pamNotificationIdPrefix = 'pam-notifictaion-';
const MAX_PAM_NOTIFICATIONS_PER_DAY = 100;

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

            // the notification lib doesn't support scheduling notifications
            // say every hour during daytime, so I need to emulate that by scheduling
            // many notifications instead. They will all use the same notification id
            // so they can be treated as one notification by the app

            const now = moment();
            const promises = generateOneDatetimePerWakingHour(truncateToDateOnly(now))
                .map((datetime, index) => 
                    scheduleDailyRepeatingNotificationAt(channel, datetime, index)
                );
            return Promise.all(promises);
        });
}

export function cancelNotification(): Promise<void> {
    log.debug('Cancelling current emotion notification');

    const promises = [];
    for (let i=0; i < MAX_PAM_NOTIFICATIONS_PER_DAY; i++) {
        promises.push(
            firebase.notifications().cancelNotification(pamNotificationIdPrefix + i)
        );
    }

    return Promise.all(promises)
        .then( () => {} );
}

function truncateToDateOnly(date) {
    date.milliseconds(0);
    date.seconds(0);
    date.minutes(0);
    date.hours(0);

    return date;
}

function generateOneDatetimePerWakingHour(date: moment$Moment): Array<moment$Moment> {
    // TODO: Make sure `date` is in the phone's timezone

    const datetimes = [];
    // TODO: The hours here should be configurable
    for(let i = 8; i <= 23; i++) {
        const d = moment(date);
        d.hours(i); // set hour to i
        datetimes.push(d);
    }

    // Make sure we don't have more than MAX_PAM_NOTIFICATIONS_PER_DAY
    // datetimes.
    datetimes.splice(MAX_PAM_NOTIFICATIONS_PER_DAY);
    return datetimes;
}

function scheduleDailyRepeatingNotificationAt(channel: Channel, datetime: moment$Moment, index: number): Promise<void> {
    log.debug('Scheduling local notification for %j', datetime);

    const id = pamNotificationIdPrefix + index.toString();
    const notification = new firebase.notifications.Notification()
        .setNotificationId(id)
        .setTitle('How are you feeling right now?')
        .setSubtitle(id)
        .setData({
            // Value from App.js
            route: 'CurrentFeeling',
        })
        .android.setChannelId(channel.channelId)
        .android.setAutoCancel(true);

    return firebase.notifications().scheduleNotification(notification, {
        fireDate: datetime.valueOf(),
        repeatInterval: 'day',
    });
}

export function TEST_fire_notification_now(): Promise<void> {

    return initialize()
        .then( channel => {
            console.log('adter init', channel);
            const notification = new firebase.notifications.Notification()
                .setTitle('How are you feeling right now?')
                .android.setAutoCancel(true)
                .android.setChannelId(channel.channelId)
                .setData({
                    route: 'CurrentFeeling',
                });

            firebase.notifications().displayNotification(notification)
        });
}
