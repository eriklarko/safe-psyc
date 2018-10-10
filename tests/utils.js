// @flow

import { InteractionManager } from 'react-native';

type Done = (?Error) => void;
type Check = () => *;

export function checkNextTick(check: Check): Promise<*> {
    return new Promise((resolve, reject) => {
        InteractionManager.runAfterInteractions(() => {
            try {
                const v = check();
                if (v instanceof Promise) {
                    return v
                        .then(resolve)
                        .catch(reject);
                } else {
                    resolve(v);
                }
            } catch (e) {
                // $FlowFixMe
                reject(e);
            }
        });
    });
}

