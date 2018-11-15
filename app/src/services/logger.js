// @flow

import { firebaseApp } from '~/src/services/firebase.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { vsprintf } from 'sprintf-js';

interface LocalLogger {
    log(any): void;
    error(any): void;
}
interface RemoteLogger {
    log(string): void;
    recordError(Error): void;
    logEvent(eventName: string, params?: Object): void,
}
export class Logger {
    local: LocalLogger;
    remote: RemoteLogger;

    constructor(local: LocalLogger, remote: RemoteLogger) {
        this.local = local;
        this.remote = remote;
    }

    debug(msg: string, ...args: Array<mixed>) {
        this._log(this.local.log, msg, args);
    }

    info(msg: string, ...args: Array<mixed>) {
        this._log(this.local.log, msg, args);
    }

    warn(msg: string, ...args: Array<mixed>) {
        this.warning(msg, ...args);
    }

    warning(msg: string, ...args: Array<mixed>) {
        this._log(this.local.log, '[WARNING] ' + msg, args);
    }

    error(msg: string, ...args: Array<mixed>) {
        this._log(this.local.error, msg, args);
    }

    _log(localF, formatString: string, args: Array<mixed>) {
        const msg = vsprintf(formatString, args);
        localF(msg);
        this.remote.log(msg);

        args.forEach(a => {
            if (a instanceof Error) {
                this.remote.recordError(a);
            }
        });
    }

    event(eventName: string, params?: Object) {
        this.remote.logEvent(eventName, params);
    }
}

class FirebaseLogger implements RemoteLogger {

    userBackend: typeof userBackendFacade;
    crashlytics: Object;
    analytics: Object;

    constructor() {
        this.crashlytics = firebaseApp.crashlytics();
        this.analytics = firebaseApp.analytics();
        this.userBackend = userBackendFacade;

        this.analytics.setAnalyticsCollectionEnabled(true);

        this.userBackend.onAuthStateChange( user => {
            const userIdentifier = user
                ? user.uid
                : "";

            this.crashlytics.setUserIdentifier(userIdentifier);
        });
    }

    log(message: string) {
        this.crashlytics.log(message);
    }

    recordError(error: Error) {
        this.crashlytics.recordError(1, error.message);
    }

    logEvent(eventName, params) {
        this.analytics.logEvent(eventName, params);
    }
}

export const log = new Logger(console, new FirebaseLogger());
