// @flow

import type { Screen } from '../../src/navigation/react-navigation/screens.js';

expect.extend({
    toHaveNavigatedTo(received, route, params) {
        const { calls } = received.dispatch.mock;
        const numCalls = calls.length;

        for (const call of calls) {
            const { routeName: actualRouteName, params: actualParams } = call[0];

            const paramsCorrect = params
                ? this.utils.stringify(params) === this.utils.stringify(actualParams)
                : true;

            if (actualRouteName === route && paramsCorrect) {
                return {
                    pass: true,
                };
            }
        }

        const a = call => call[0].routeName + ' - ' + this.utils.stringify(call[0].params);
        return {
            pass: false,
            message: () => `${this.utils.matcherHint('.not.toBe')}\n\n` +

              'Expected navigation frame:\n' +
              `  ${this.utils.printExpected(route + ' - ' + this.utils.stringify(params))}\n` +
              'Received:\n' +
              `  ${this.utils.printReceived(calls.map(a).join('\n'))}\n`
        }
    },

    toHaveResetTo(received, route: Screen) {
        const { calls } = received.dispatch.mock;
        const numCalls = calls.length;

        if (numCalls !== 1) {
            return {
                pass: false,
                message: () => 'expected mock to have been called one time, it was called ' + numCalls + ' times',
            };
        }

        const args = calls[0][0];

        // check that the navigation action has index 0, meaning it's on the
        // top of the navigation stack
        if (args.index !== 0) {
            return {
                pass: false,
                message: () => 'expected index to be 0, it was ' + args.index,
            };
        }

        // check that the navigation action on the top of the stack only puts
        // one screen on the stack. react-navigation calls these actions too
        // which is a little confusing
        if (args.actions.length !== 1) {
            return {
                pass: false,
                message: () => 'expected actions to be an array with one item, it was [' + args.actions.map(a => JSON.stringify(a)).join(', ') + ']',
            };
        }

        const msgConstructor = (actual) => () => `${this.utils.matcherHint('.not.toBe')}\n\n` +
                  'Expected to have reset to:\n' +
                  `  ${this.utils.printExpected(this.utils.stringify(route))}\n` +
                  'Received:\n' +
                  `  ${this.utils.printReceived(this.utils.stringify(actual))}\n`;


        if (Array.isArray(route)) {
            const actualRoutes = args.actions.map(a => a.routeName);
            return {
                pass: actualRoutes.every(r => actualRoutes.indexOf(r) === route.indexOf(r)),
                message: msgConstructor(actualRoutes),
            };
        }

        if (args.actions[0].routeName !== route) {
            return {
                pass: false,
                message: msgConstructor(args.actions[0].routeName),
            };
        }

        return {
            pass: true,
        };
    },
});
