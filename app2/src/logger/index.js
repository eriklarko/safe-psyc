// @flow

import { StdoutLogger } from './stdout-logger.js';
export * from './nop-logger.js';
export * from './stdout-logger.js';

// implemented by all loggers
export interface StructuredLogger {
    // allows
    //    log({msg: 'hello', foo: 1 })
    //
    // and
    //    log('msg', 'hello', 'foo', 'bar')
    //    log('msg', 'hello', 'foo', 1)
    //
    // and technically the following which should probably be avoided
    //    log({msg: 'hello', foo: 'bar' }, 'baz', 'lol')
    //
    log(first: Loggable, ...keyvals: Array<Stringable>): void;
}

// things that can be converted to a string
export interface Stringable {
    toString(): string
}

// things that can be logged
export type Loggable = Stringable | {[Stringable]: Stringable};

export function setLogger(newLogger: StructuredLogger) {
    logger = newLogger;
}

export let logger = new StdoutLogger();