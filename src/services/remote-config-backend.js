// @flow

import { firebaseApp } from '~/src/services/firebase.js';
import { log } from '~/src/services/logger.js';

const defaults = {
    numQuestionsPerSession: 10,

    eyeQuestionsFactor: 8,
    intensityQuestionsFactor: 1,
    wordQuestionsFactor: 1,
};
export class RemoteConfigBackendFacade {
    load(): Promise<void> {
        this._enableDevMode();
        this._setDefaults();
        return this._fetch();
    }

    _enableDevMode() {
        if (__DEV__) {
            log.debug('Enabling firebase remote config developer mode');
            firebaseApp.config().enableDeveloperMode();
        }
    }

    _setDefaults() {
        firebaseApp.config().setDefaults(defaults);
    }


    _fetch() {
        return firebaseApp
            .config()
            .fetch()
            .then(() => {
                return firebaseApp.config().activateFetched();
            })
            .then(activated => {
                if (activated) {
                    log.info('Updated the remote config!');
                } else {
                    log.debug('The remote config was not updated');
                }
            });
    }

    getNumberOfQuestionsPerSession(): Promise<number> {
        return this._getNumber('numQuestionsPerSession', 'number of questions per session');
    }

    getEyeQuestionsFactor(): Promise<number> {
        return this._getNumber('eyeQuestionsFactor', 'eye questions factor');
    }

    getIntensityQuestionsFactor(): Promise<number> {
        return this._getNumber('intensityQuestionsFactor', 'intensity questions factor');
    }

    getWordQuestionsFactor(): Promise<number> {
        return this._getNumber('wordQuestionsFactor', 'word questions factor');
    }

    _getNumber(key: string, description: string): Promise<number> {
        return this._getValue(key)
            .then(rawNumber => {
                const n = Number(rawNumber);
                if (Number.isNaN(n)) {
                    log.warn(
                        "Unable to parse %s, '%s' was not a number",
                        description,
                        rawNumber,
                    );

                    return defaults[key];
                }

                return n;
            });
    }

    _getValue(key: string): Promise<string> {
        return firebaseApp
            .config()
            .getValue(key)
            .then(snapshot => {
                return snapshot.val();
            });
    }
}

export const remoteConfigBackendFacade = new RemoteConfigBackendFacade();
