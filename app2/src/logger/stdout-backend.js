// @flow

import type { LoggingBackend } from './index.js';

export class StdoutLoggingBackend implements LoggingBackend {

    log(m: Map<string, string>) {
        console.log(m);
    }
}
