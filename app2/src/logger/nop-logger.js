// @flow
//
// A logger that logs to /dev/null

import type { Loggable, Stringable } from './index.js';

export class NopLogger {

    log(first: Loggable, ...keyvals: Array<Stringable>) {
        // no operation
    }
}