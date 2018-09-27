// @flow

import { firebase } from '~/src/services/firebase.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { log } from '~/src/services/logger.js';
import { settings } from '~/src/utils/settings.js';

import type { Storage } from '~/src/services/storage.flow.js';

// Can be used store simple key-value pairs that will be available
// across devices if the user is logged in
export class AccountStorage {

    getValue(name: string): Promise<string> {
        return userBackendFacade.getUserOrReject('get-value')
            .then( user => {
                console.log("user", user);
                const path = 'user-data/' + user.uid + '/storage/' + name;
                return firebase
                    .database()
                    .ref(path)
                    .once('value')
                    .then( snap => {
                        return snap.val() || settings[name].default;
                    });
            });
    }

    setValue(name: string, value: string): Promise<void> {
        return userBackendFacade.getUserOrReject('set-value')
            .then( user => {

                log.debug('Persisting %s = %s', name, value);

                const toWrite = {
                    name: name,
                    value: value,
                };

                const path = 'user-data/' + user.uid + '/storage/' + name;
                const ref = firebase.database().ref(path)

                return new Promise((resolve, reject) => {
                    ref.set(value,
                        (error) => error
                            ? reject(error)
                            : resolve(ref.key)
                    );
                });
            });
    }
}
export const accountStorage = new AccountStorage();

function thenableToPromise(resolve, reject): (?Object) => void {
    return err => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    };
}

