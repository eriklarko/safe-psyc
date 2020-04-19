// @flow
//
// A logger that logs to /dev/null

import type { LoggingBackend } from './index.js';

export class NopLoggingBackend implements LoggingBackend {

    log(m: Map<string, string>): void {
        // no operation
    }
}
