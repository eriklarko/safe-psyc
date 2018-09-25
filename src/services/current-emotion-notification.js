// @flow

import { Platform, Alert, PushNotificationIOS } from 'react-native';
import { log } from '~/src/services/logger.js';
import { resetTo } from '~/src/navigation-actions.js';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';

// Having all PAM notifications have the same ID makes sure only one is active
// at any time. I have no idea if there are any restrictions on this ID though.
// ONLY WORKS ON ANDROID. No idea how to do the same on iOS :(
const pamNotificationId = "1337";

let isInitialized = false;
export function initialize() {
    if (isInitialized) {
        return;
    }

    isInitialized = true;
    PushNotification.configure({
        onNotification: onNotification,
        onRegister: function(token) {
            console.log( 'TOKEN:', token );
        },

        // ANDROID ONLY: GCM Sender ID (optional - not required for local
        // notifications, but is need to receive remote push notifications)
        senderID: "YOUR GCM SENDER ID",
    });
}

function onNotification(notification) {

    if (notification.id !== pamNotificationId) {
        log.warning("got unknown notification id %s - %s", notification.id, notification.message);
        return;
    }

    log.debug('processing current emotion notification');
    navigateToPAM();

    if (Platform.OS === 'ios') {
        // required on iOS only (see fetchCompletionHandler docs: 
        // https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
}

function navigateToPAM() {
    console.log('navigating');
    Alert.alert('whoo', 'booo');
    try {
        resetTo('CurrentFeeling');
        console.log('whoo');
        Alert.alert('whoo', 'navigated')
    } catch (e) {
        console.log('boo', e);
        Alert.alert('boo', e.message)
    }
}

export function scheduleNotification() {
    if (!isInitialized) {
        initialize();
    }

    cancelNotification();

    // react-native-push-notification doesn't support scheduling notifications
    // say every hour during daytime, so I need to emulate that by scheduling
    // many notifications instead. They will all use the same notification id
    // so they can be treated as one notification by the app
    const now = moment();
    generateOneDatetimePerWakingHour(truncateToDateOnly(now))
        .forEach(datetime => scheduleDailyRepeatingNotificationAt(datetime));
}

export function cancelNotification() {
    log.debug('Cancelling current emotion notification');
    PushNotification.cancelLocalNotifications({ id: pamNotificationId });
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

function scheduleDailyRepeatingNotificationAt(datetime: moment$Moment) {
    log.debug('Scheduling local notification for %j', datetime);
    PushNotification.localNotificationSchedule({
        id: pamNotificationId,

        title: "My Notification Title", // (optional)
        message: "My Notification Message", // (required)
        bigText: "debug " + datetime.format(), // (optional) default: none

        date: datetime.toDate(), // TODO: Is this in the phone's tz?
        repeatType: 'day', // (Android only) Repeating interval. Could be one of `week`, `day`, `hour`, `minute, `time`. If specified as time, it should be accompanied by one more parameter 'repeatTime` which should the number of milliseconds between each interval
    });
}
