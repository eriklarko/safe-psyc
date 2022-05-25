// @flow
//
// This file represents the default way to log things in this app. All logs
// are structured, and where those logs end up is configurable using the
// LoggingBackend interface defined in this file.
//
// Usage example:
//   import { logger } from '../logger';
//
//   function logIn(username, password) {
//      logger.log({
//          msg: 'logging in',
//          user: username,
//      });
//   }
//
//   function doSomething() {
//      logger.log('doing something');
//   }

import { Logger } from './logger.js';
import { StdoutLoggingBackend } from './stdout-backend.js';
export * from './nop-backend.js';
export * from './stdout-backend.js';

// Things that can be logged. Either something that can be turned into a string
// or a map from something stringable to something stringable.
// e.g.
//  let foo: Loggable = "hello"       // strings are stringable
//  foo = 1                           // numbers are also stringable
//  foo = { 'a': 1, 2: 'b' }          // maps from stringable to stringable work great
export type Loggable = Stringable | {[Stringable]: Stringable};

// things that can be converted to a string
export interface Stringable {
    toString(): string
}

export interface LoggingBackend {
    log(message: Map<string, string>): void
}

// setLoggingBackend can be used to change the default log backend. It was
// introduced to disable logging in tests to make the output less noisy.
export function setLoggingBackend(newBackend: LoggingBackend) {
    logger = new Logger(newBackend);
}

export let logger = new Logger(new StdoutLoggingBackend());
