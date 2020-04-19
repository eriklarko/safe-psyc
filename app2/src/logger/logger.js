// @flow
//
// A facade over logging backends making sure that important logic such as
// getting where the message was logged and exception renderering can be shared
// across logging backends. Examples of logging backends include
//      stdout; which just logs to standard out using console.log
//      firebase; which sends the logs to firebase
//
//  Note that logging `__callStack: anything` will get overwritten with the real
//  call stack.

import type { LoggingBackend, Loggable } from './index.js';

export class Logger {
    backend: LoggingBackend

    constructor(backend: LoggingBackend) {
        this.backend = backend;
    }

    // allows
    //    log({msg: 'hello', foo: 1 })
    //
    // I wonder if it might be a bit of a security hole to allow object here...
    log(toLog: Loggable): void {
        // convert the thing to log to Map<string, string>
        const logMap = this._stringifyLoggable(toLog);

        // add __callstack key with stringified call stack to the map
        this._addCallStack(logMap);

        // log it
        this.backend.log(logMap);
    }

    _stringifyLoggable(toLog: Loggable): Map<string, string> {
        const preparedLog = new Map();
        if (typeof toLog === 'object') {
            for (const [key, value] of Object.entries(toLog)) {
                preparedLog.set(key, this._stringify(value));
            }

        } else {
            preparedLog.set('message', toLog.toString());
        }

        return preparedLog;
    }

    _stringify(p: mixed): string {
        if (typeof p === 'string') {
            return p;
        }

        if (p instanceof Error) {
            return p.message + p.stack;
        }

        // JSON.stringify returns undefined when passing in "pure" values like
        // JSON.stringify(function(){}) or JSON.stringify(undefined) so we'll
        // need to make sure it's a string. Technically we shouldn't need this
        // as we only accept Loggables in the public API, but flow can be hard
        // to please and this is safe enough.
        return JSON.stringify(p) || '__invalid';
    }

    _addCallStack(log: Map<string, string>): void {
        log.set('__callstack', this._getCallStack().join('\n'));
    }

    // get the place in the code that invoked the log method.
    // this is too heavy for a logging method... Perhaps it should only be
    // called on bad errors or something.
    _getCallStack(): Array<string> {
        return new Error().stack
            // the stack is a string where each line is a function call
            .split('\n')

            // the first lines are
            //   1. the string "Error"
            //   2. this._getCallStack (this method)
            //   3. this._addCallStack (the method calling this method)
            //   4. this.log
            // we'll skip these by removing them from the array
            .slice(4)

            // remove any starting and trailing whitespace
            .map(l => l.trim());
    }
}
