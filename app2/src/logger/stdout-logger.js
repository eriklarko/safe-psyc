// @flow

import type { Loggable, Stringable } from './index.js';

export class StdoutLogger {

    log(first: Loggable, ...keyvals: Array<Stringable>) {
        keyvals.unshift(first);
        console.log(...keyvals)
    }
}
