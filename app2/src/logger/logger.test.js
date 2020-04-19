// @flow

import { Logger } from './logger.js';

it('logs a string as a map', () => {
    const { mockBackend, logger }  = newMockedLogger();
    
    logger.log('foo');

    const actual = getLoggedMap(mockBackend);
    expect(actual.get('message')).toEqual('foo');
});

it('logs objects nicely', () => {
    const { mockBackend, logger }  = newMockedLogger();
    
    logger.log({'key1': 'foo', 'key2': 'bar'});

    const actual = getLoggedMap(mockBackend);
    expect(actual.get('key1')).toEqual('foo');
    expect(actual.get('key2')).toEqual('bar');
});

it('serializes errors with message and call stack', () => {
    const { mockBackend, logger } = newMockedLogger();
    
    const error = new Error('hello');
    logger.log({'error': error});

    const actual = getLoggedMap(mockBackend);
    expect(actual.get('error')).toEqual(expect.stringContaining(error.message));
    expect(actual.get('error')).toEqual(expect.stringMatching(/logger\.test\.js/));
});

function newMockedLogger() /*{logger: Logger, mockBackend: *}*/ {
    const mockBackend = {
        log: jest.fn(),
    };
    return {
        logger: new Logger(mockBackend),
        mockBackend: mockBackend,
    }
}

function getLoggedMap(mockBackend): Map<string, string> {
    const calls = mockBackend.log.mock.calls
    if (!calls) {
        throw new Error('log wasn\'t called at least once');
    }

    return calls[0][0];
}

describe('call stack', () => {
    it('is logged as __callstack', () => {
        const { mockBackend, logger }  = newMockedLogger();

        logger.log('something');

        const callStack = getCallStackAsArray(getLoggedMap(mockBackend));
        // check that the top of the call stack is from this file. it should come
        // from the `logger.log('something')` call above.
        expect(callStack[0]).toEqual(expect.stringMatching(/logger\.test\.js/));
    });

    it('overrides __callback if set by caller', () => {
        const { mockBackend, logger }  = newMockedLogger();

        logger.log({msg: 'hello', '__callstack': 'foo'});

        const callStack = getCallStackAsArray(getLoggedMap(mockBackend));
        expect(callStack).not.toEqual(expect.arrayContaining([
            expect.stringContaining('foo'),
        ]));
    })

    function getCallStackAsArray(args: Map<string, string>): Array<string> {
        const callStack = args.get('__callstack');
        if (!callStack) {
            const callStackString = JSON.stringify(callStack) || 'n/a';
            throw new Error('no __callstack property was logged, ' + callStackString);
        }
        return callStack.split(',');
    }
})
