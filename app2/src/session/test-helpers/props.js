// @flow

import { Session } from '../models/session.js';
import { newArbitraryQuestion } from './questions.js';
import type { Props } from '../SessionScreen.js';

const defaultProps: Props = {
    session: new Session(new Set([newArbitraryQuestion()])),

    // jest not defined and I can't import jest, but it is available...
    /* eslint-disable-next-line no-undef */
    onSessionFinished: jest.fn(),

    /* eslint-disable-next-line no-undef */
    onAborted: jest.fn(),
};

export function props(overrideProps?: $Shape<Props>): Props {
    return Object.assign(
        {},
        defaultProps,
        overrideProps,
    );
}
