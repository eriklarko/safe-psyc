// @flow

import { rnfbmock } from './mocks/firebase-mock.js';

jest.mock('react-native-firebase', () => {
    return new rnfbmock();
});

jest.mock('react-navigation', () => ({
    NavigationActions: {
        navigate: (obj) => obj,
    },
    StackActions: {
        reset: (obj) => obj,
    },
}));

jest.mock('../src/services/logger', () => {

    const log = {
        debug: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        event: jest.fn(),
    };
    return {
        log: log,
        Logger: () => log,
    };
});

require("./matchers/toHaveMatcher.js");
require("./matchers/duplicateMatcher.js");
require("./matchers/elementsOtherThanMatcher.js");
require("./matchers/containsStringMatcher.js");
require("./matchers/navigationMatcher.js");
require("./matchers/momentMatcher.js");

import { randomEmotions } from './emotion-utils.js';
import { answerService } from '../src/features/session/answer-service.js';
answerService.setAnswerPool(randomEmotions(5));
