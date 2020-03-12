// @flow

import * as React from 'react';
import prettyFormat from 'pretty-format';

const { ReactTestComponent } = prettyFormat.plugins;

expect.extend({
    // received should be of type react-test-renderer.ReactTestInstance
    toHaveChild(received, child: React$ElementType) {
        const matchingChildren = received.findAllByType(child);
        const message = () => {
            const name = typeof child === 'string'
                            ? child
                            : child.name;

            return 'Could not find ' + (name || prettyFormat(child)) + ' in ' + stringifyComponent(received);
        };

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };

    },
});

function stringifyComponent(component): string {
    return prettyFormat(component, {
            plugins: [ReactTestComponent],
            printFunctionName: false,
            maxDepth: 5,
        });
}
