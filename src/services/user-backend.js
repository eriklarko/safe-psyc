// @flow

import { firebase } from '~/src/services/firebase.js';
import { log } from '~/src/services/logger.js';
import { removeFrom } from '~/src/utils/array-utils.js';

//////////////////////////////////////////////////////////
//////////////////// AUTH LISTENERS //////////////////////
//////////////////////////////////////////////////////////
let loggedInUser = null;
const onLoggedInListeners = [];
const onLoggedOutListeners = [];


let listenersRegistered = false;
function registerAuthListeners() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            log.debug('onAuthStateChange - user logged in');
            loggedInUser = user;

            onLoggedInListeners.forEach(l => l());
        } else {
            log.debug('onAuthStateChange - user logged out');
            loggedInUser = null;

            onLoggedOutListeners.forEach(l => l());
        }
    });

    listenersRegistered = true;
}
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

export type User = {
    uid: string,
    email: string,
};
export class UserBackendFacade {
    createNewUser(email: string, password: string): Promise<{ email: string }> {
        email = email.trim();
        return firebase
            .auth()
            .createUserAndRetrieveDataWithEmailAndPassword(email, password)
            .then(user => {
                log.debug('Created user');
                return user;
            })
            .catch(function(error) {
                log.error('Failed creating user, %j', error);
                throw error;
            });
    }

    login(email: string, password: string): Promise<void> {
        email = email.trim();

        if (email.length === 0) return Promise.reject(new Error("Empty email"));
        if (password.length === 0) return Promise.reject(new Error("Empty password"));

        return firebase
            .auth()
            .signInAndRetrieveDataWithEmailAndPassword(email, password)
            .then(function() {
                log.debug('Login successful');
            })
            .catch(function(error) {
                log.error('Failed logging in, %j', error);
                throw error;
            });
    }

    logOut(): Promise<void> {
        return firebase
            .auth()
            .signOut()
            .then(() => {
                log.debug('User logged out');
            })
            .catch(e => {
                log.error('Failed logging out, %j', e);
                throw e;
            });
    }

    resetPassword(email: string): Promise<void> {
        email = email.trim();
        return firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                log.debug('Password reset sent');
            })
            .catch(e => {
                log.error('Failed sending password reset, %j', e);
                throw e;
            });
    }

    onUserLoggedIn(callback: () => void): () => void {
        onLoggedInListeners.push(callback);
        if (!listenersRegistered) {
            registerAuthListeners();
        }

        return () => {
            removeFrom(onLoggedInListeners, callback);
        };
    }

    onceUserLoggedIn(callback: () => void) {
        const unregister = this.onUserLoggedIn(() => {
            callback();
            unregister();
        });
    }

    onUserLoggedOut(callback: () => void) {
        onLoggedOutListeners.push(callback);
        if (!listenersRegistered) {
            registerAuthListeners();
        }

        return () => {
            removeFrom(onLoggedOutListeners, callback);
        };
    }

    onceUserLoggedOut(callback: () => void) {
        const unregister = this.onUserLoggedOut(() => {
            callback();
            unregister();
        });
    }

    getLoggedInUser(): ?User {
        return loggedInUser;
    }

    getUserOrThrow(component: string): User {
        const user = this.getLoggedInUser();

        if (!user) {
            const err = new Error('Unauthorized write attempt');
            log.error('Not logged in - %s, %s', component, err);
            throw err;
        }

        return user;
    }

    getUserOrReject(component: string): Promise<User> {
        return new Promise( resolve => {
            const user = this.getUserOrThrow(component);
            resolve(user);
        });
    }
}

export const userBackendFacade = new UserBackendFacade();
