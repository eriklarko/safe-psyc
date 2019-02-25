// @flow

import * as navActions from './navigation-actions.js';
import { mockNavigation } from '~/tests/mocks/navigation-mock.js';

describe('onUserLoggedOut', () => {
    it('resets to pitch if file system marker not set', () => {
        return doNav({
            expectedRoute: 'Pitch',
            hasSeenThePitch: Promise.resolve('false'),
        });
    });

    it("resets to pitch if there's an error reading the file system", () => {
        return doNav({
            expectedRoute: 'Pitch',
            hasSeenThePitch: Promise.reject(new Error('foo')),
        });
    });

    it('resets to login if file system marker is set', () => {
        return doNav({
            expectedRoute: 'Login',
            hasSeenThePitch: Promise.resolve('true'),
        });
    });

    type Conf = {
        expectedRoute: string,
        hasSeenThePitch: Promise<string>,
    };

    function doNav(conf: Conf) {
        const storage = {
            getValue: () => conf.hasSeenThePitch,
            setValue: jest.fn(),
        };
        const navigation = mockNavigation();
        const { dispatch } = navigation;

        return navActions.onUserLoggedOut(storage).then(() => {
            expect(dispatch).toHaveBeenCalledTimes(1);

            const arg = dispatch.mock.calls[0][0];
            expect(arg.index).toBe(0);
            expect(arg.actions).toEqual([{ routeName: conf.expectedRoute }]);
        });
    }
});
