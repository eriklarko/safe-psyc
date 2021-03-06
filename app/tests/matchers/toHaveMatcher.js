// @flow

import { Component } from 'react';
import { getChildrenAndParent, findChildren, stringifyComponent } from '../cool-test-lib/component-tree-utils.js';

expect.extend({
    toHaveExactlyOneChild: function (received, childConstructor) {

        const matchingChildren = findChildren(received, childConstructor);

        let message;
        if (matchingChildren.length === 0) {
            message = () => 'Could not find ' + childConstructor.name + ' in ' + stringifyComponent(received);
        } else if (matchingChildren.length > 1) {
            message = () => 'Expected exactly one ' + childConstructor.name + ', found ' + matchingChildren.length;
        }

        return {
            pass: matchingChildren.length === 1,
            message: message,
        };
    },

    toHaveChild: function (received, childConstructor) {

        const matchingChildren = findChildren(received, childConstructor);
        const message = () => 'Could not find ' + childConstructor.name + ' in ' + stringifyComponent(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },

    toHaveChildMatching: function (received, childPredicate) {
        const components = getChildrenAndParent(received);

        const matchingChildren = components.filter(childPredicate);

        const message = () => 'Could not find a child matching the predicate in ' + stringifyComponent(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },

    toHaveChildWithProps: function (received, childConstructor, childProps) {
        const equals = this.equals;

        const components = getChildrenAndParent(received);
        const childProps_happyFlow = childProps;

        const matchingChildren = components.filter(c => {
            // $FlowFixMe
            const correctType = c && c.type === childConstructor;

            if (correctType && childProps_happyFlow) {
                const correctProps = Object.keys(childProps_happyFlow).every(
                    key => {
                        const hasProp = c.props.hasOwnProperty(key);
                        const prop = c.props[key];

                        let propValuesAreEqual = equals(c.props[key], childProps_happyFlow[key]);
                        if (typeof prop === 'function' && !propValuesAreEqual) {
                            propValuesAreEqual = prop.name === childProps_happyFlow[key].name;
                        }

                        return hasProp && propValuesAreEqual;
                    });
                return correctType && correctProps;
            }
            return correctType;
        });


        let propsMessage = '';
        if (childProps) {
            propsMessage = ' with props ' + JSON.stringify(childProps_happyFlow, null, 2);
        }
        const message = () => 'Could not find ' + childConstructor.name + propsMessage + ' in ' + stringifyComponent(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },
});

