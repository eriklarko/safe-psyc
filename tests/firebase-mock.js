export const rnfbmock = function() {
    return {
        messaging: () => {
            return {
                hasPermission: () => Promise.resolve(),
                requestPermission: () => Promise.resolve(),
            }
        },

        notifications: notifications,

        app: () => {
            return {
                auth: () => ({
                    onAuthStateChanged: () => {},
                }),
                database: () => {},
                crashlytics: () => {},
                analytics: () => ({
                    setAnalyticsCollectionEnabled: () => {},
                }),
                config: () => ({
                    enableDeveloperMode: () => {},
                    setDefaults: () => {},
                    fetch: () => Promise.resolve(),
                    activateFetched: () => {},
                    getValue: () => Promise.resolve({
                        val: () => {},
                    }),
                }),
            }
        },
    }
};
function notifications() {
    return {
        cancelNotification: () => Promise.resolve(),
        android: {
            createChannel: () => Promise.resolve(),
        },
        scheduleNotification: () => Promise.resolve(),
    };
}
notifications.Android = {
    Channel: () => ({
        setDescription: () => ({}),
    }),
};

class rnfbnotif {

    setNotificationId() {
        return this;
    }
    setTitle() {
        return this;
    }
    setBody() {
        return this;
    }
    setData() {
        return this;
    }

    android = {
        setAutoCancel: () => {
            return this;
        },
        setChannelId:  () => {
            return this;
        },
    }
}
notifications.Notification = rnfbnotif;

