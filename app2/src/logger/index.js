// @flow
//
// This file represents the default way to log things in this app. All logs
// shoud be structured, but where those logs end up is up to the implementation
// of the default logger defined here.

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

// things that can be logged. either something that can be turned into a string
// or a map from something stringable to something stringable.
// e.g.
//  let foo: Loggable = "hello"       // strings are stringable
//  foo = 1                           // numbers are also stringable
//  foo = { 'a': 1, 2: 'b' }          // maps from stringable to stringable work great
export type Loggable = Stringable | {[Stringable]: Stringable};

// setLogger can be used to change the default logger. It was introduced to
// disable logging in tests to make the output less noisy.
export function setLogger(newLogger: StructuredLogger) {
    logger = newLogger;
}

export let logger = new StdoutLogger();
