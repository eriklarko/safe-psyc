// @flow

import { Platform, Alert, PushNotificationIOS } from 'react-native';
import { log } from '~/src/services/logger.js';
import { resetTo } from '~/src/navigation-actions.js';
import firebase from 'react-native-firebase';
import moment from 'moment';

// Having all PAM notifications have the same ID makes sure only one is active
// at any time. I have no idea if there are any restrictions on this ID though.
// ONLY WORKS ON ANDROID. No idea how to do the same on iOS :(
const pamNotificationId = "1337";

type Channel = { channelId: string };

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
        .Channel('test-channel', 'Test Channel', 5) // TODO: document importance shit
        .setDescription('My apps test channel');

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
                    .map(datetime => scheduleDailyRepeatingNotificationAt(channel, datetime));
            return Promise.all(promises);
        });
}

export function cancelNotification(): Promise<void> {
    log.debug('Cancelling current emotion notification');
    return firebase.notifications().cancelNotification(pamNotificationId);
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

    return datetimes;
}

function scheduleDailyRepeatingNotificationAt(channel: Channel, datetime: moment$Moment): Promise<void> {
    log.debug('Scheduling local notification for %j', datetime);

    const notification = new firebase.notifications.Notification()
        .setNotificationId(pamNotificationId)
        .setTitle('My notification title')
        .setBody('My notification body')
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
                .setNotificationId(pamNotificationId)
                .setTitle('My notification title')
                .setBody('My notification body')
                .android.setAutoCancel(true)
                .android.setChannelId(channel.channelId)
                .setData({
                    route: 'CurrentFeeling',
                });

            firebase.notifications().displayNotification(notification)
        });
}
