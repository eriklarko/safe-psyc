// @flow
//
// This file sets up the environment the tests are run in; log to /dev/null,
// mock out react-navigation stuff, make custom matchers available to the
// tests, etc...

export * from './react-navigation-mocks.js';
export * from './custom-jest-matchers';

// Stop logging in tests.
// This can be overridden in tests like this
//     import { setLogger, StdoutLogger } from '../logger';
//     setLogger(new StdoutLogger());
import { setLogger, NopLogger } from '../src/logger';
setLogger(new NopLogger());
