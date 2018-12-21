// @flow

import { log } from '~/src/services/logger.js';

export function scheduleNotification(): Promise<mixed> {
    return Promise.resolve();
}

export function cancelNotification(): Promise<void> {
    log.debug('Cancelling current emotion notification');

    return Promise.resolve();
}

