// @flow

import { firebase } from '~/src/services/firebase.js';
import { log } from '~/src/services/logger.js';
import { removeFrom } from '~/src/utils/array-utils.js';

export type User = {
    uid: string,
    email: ?string,
    isAnonymous: bool,
};
export class UserBackendFacade {

    _auth: Object;
    _onPromoteUserListener = [];

    constructor(auth: Object) {
        this._auth = auth;
    }

    createNewAnonymousUser(): Promise<void> {
        return this._auth
            .signInAnonymouslyAndRetrieveData()
            .then(user => {
                log.debug('Created anonymous user %j', user);
                return undefined;
            })
            .catch(function(error) {
                log.error('Failed creating anonymous user, %s', error);
                throw error;
            });
    }

    promoteAnonymousToNamed(email: string, password: string): Promise<User> {
        email = email.trim();

        // I should be creating the credential with
        //     const credential = this._auth.EmailAuthProvider.credential(email, password);
        // but firebase.auth doesn't have an EmailAuthProvider :(, so instead I copied it from
        // https://github.com/invertase/react-native-firebase/blob/24d16e4853151f92590fb24aebbc3b69927ecf96/lib/modules/auth/providers/EmailAuthProvider.js#L20
        const credential = {
            token: email,
            secret: password,
            providerId: 'password',
        };

        return this._auth
            .currentUser
            .linkAndRetrieveDataWithCredential(credential)
            .then( user => {
                log.debug("Anonymous account successfully upgraded, %j", user);
                this._onPromoteUserListener.forEach(l => l(user));
            })
            .catch( error => {
                log.error("Error upgrading anonymous account %s", error);
            });
    }

    addPromoteUserListener(cb: (User) => void): () => void {
        this._onPromoteUserListener.push(cb);
        return () => {
            removeFrom(this._onPromoteUserListener, cb);
        };
    }

    createNewUser(email: string, password: string): Promise<User> {
        email = email.trim();
        return this._auth
            .createUserAndRetrieveDataWithEmailAndPassword(email, password)
            .then(user => {
                log.debug('Created user');
                return user;
            })
            .catch(function(error) {
                log.error('Failed creating user, %s', error);
                throw error;
            });
    }

    login(email: string, password: string): Promise<void> {
        email = email.trim();

        if (email.length === 0) return Promise.reject(new Error("Empty email"));
        if (password.length === 0) return Promise.reject(new Error("Empty password"));

        return this._auth
            .signInAndRetrieveDataWithEmailAndPassword(email, password)
            .then(function() {
                log.debug('Login successful');
            })
            .catch(function(error) {
                log.error('Failed logging in, %s', error);
                throw error;
            });
    }

    logOut(): Promise<void> {
        return this._auth
            .signOut()
            .then(() => {
                log.debug('User logged out');
            })
            .catch(e => {
                log.error('Failed logging out, %s', e);
                throw e;
            });
    }

    resetPassword(email: string): Promise<void> {
        email = email.trim();
        return this._auth
            .sendPasswordResetEmail(email)
            .then(() => {
                log.debug('Password reset sent');
            })
            .catch(e => {
                log.error('Failed sending password reset, %s', e);
                throw e;
            });
    }

    onAuthStateChange(callback: (User) => void) {
        return this._auth.onAuthStateChanged(callback);
    }

    onceAuthStateChange(callback: (User) => void) {
        const unregister = this._auth.onAuthStateChanged( user => {
            callback(user);
            unregister();
        });
    }

    getLoggedInUser(): ?User {
        return this._auth.currentUser;
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

    isLoggedIn(): bool {
        return this.getLoggedInUser() !== null;
    }
}

export const userBackendFacade = new UserBackendFacade(firebase.auth());
