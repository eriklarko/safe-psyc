// @flow

import moment from 'moment';

import { firebaseApp } from '~/src/services/firebase.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { log } from '~/src/services/logger.js';

type LastEmotionAnswer = {
    emotion: string,
    when: moment$Moment,
};

export class CurrentEmotionBackendFacade {
    registerCurrentEmotion(emotion: string, onComplete: (?Error) => void, id: ?string): string {
        const user = userBackendFacade.getUserOrThrow('registerCurrentEmotion');

        log.debug('Registering current emotion, %j', emotion);

        const toWrite = {
            emotion: emotion,
            when: moment().format('x'), // x is the unix timestamps in ms
        };

        const basePath = 'user-data/' + user.uid + '/current-emotions';
        if (id) {
            const ref = firebaseApp
                .database()
                .ref(basePath + '/' + id);

            ref.set(toWrite, onComplete);
            return ref.key;
        } else {
            return firebaseApp
                .database()
                .ref(basePath)
                .push(toWrite, onComplete)
                .key;
        }
    }

    getLastEmotionAnswer(): Promise<?LastEmotionAnswer> {
        log.debug('Reading last recorded feeling');

        return new Promise(resolve => {
            const user = userBackendFacade.getUserOrThrow('getLastEmotionAnswer');

            firebaseApp
                .database()
                .ref('user-data/' + user.uid + '/current-emotions')
                .orderByChild('when')
                .limitToLast(1)
                .once('value', snap => {
                    const firebaseWeirdValue = snap.val();
                    if (firebaseWeirdValue === null) {
                        resolve(null);
                    } else {
                        const firebaseWeirdKey = Object.keys(firebaseWeirdValue)[0];
                        const value = firebaseWeirdValue[firebaseWeirdKey];

                        resolve({
                            emotion: value.emotion,
                            when: moment(value.when, 'x'),
                        });
                    }
                });
        });
    }
}

export const currentEmotionBackendFacade = new CurrentEmotionBackendFacade();

