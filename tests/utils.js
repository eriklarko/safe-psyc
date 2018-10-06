// @flow

import { InteractionManager } from 'react-native';

type Done = (?Error) => void;
type Check = () => void;

export function checkNextTick(check: Check): Promise<void> {
    return new Promise((resolve, reject) => {
        InteractionManager.runAfterInteractions(() => {
            try {
                const v = check();
                if (v instanceof Promise) {
                    return v
                        .then(resolve)
                        .catch(reject);
                } else {
                    resolve();
                }
            } catch (e) {
                // $FlowFixMe
                reject(e);
            }
        });
    });
}

