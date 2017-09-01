// @flow

import reactElementToJSXString from 'react-element-to-jsx-string';

expect.extend({
    toHaveChild: function (received, childConstructor) {
        const children = getChildren(received);

        const matchingChildren = children.filter(c => {
            const correctType = c.type === childConstructor;
            return correctType;
        });

        const message = () => 'Could not find ' + childConstructor.name + ' in ' + reactElementToJSXString(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },

    toHaveChildMatching: function (received, childPredicate) {
        const children = getChildren(received);

        const matchingChildren = children.filter(childPredicate);

        const message = () => 'Could not find a child matching the predicate in ' + reactElementToJSXString(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },

    toHaveChildWithProps: function (received, childConstructor, childProps) {
        const equals = this.equals;

        const children = getChildren(received);
        const childProps_happyFlow = childProps;

        const matchingChildren = children.filter(c => {
            const correctType = c.type === childConstructor;

            if (correctType && childProps_happyFlow) {
                const correctProps = Object.keys(childProps_happyFlow).every(
                    key =>
                        c.props.hasOwnProperty(key) &&
                        equals(c.props[key], childProps_happyFlow[key])
                    );
                return correctType && correctProps;
            }
            return correctType;
        });


        let propsMessage = '';
        if (childProps) {
            propsMessage = ' with props ' + JSON.stringify(childProps, null, 2);
        }
        const message = () => 'Could not find ' + childConstructor.name + propsMessage + ' in ' + reactElementToJSXString(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },
});

function getChildren(component) {
    if (!component || !component.props || !component.props.children) {
        return [];
    }

    let children = component.props.children;
    if (!Array.isArray(children)) {
        children = [children];
    }

    const grandchildren = children.map(c => getChildren(c));
    const flattenedGrandChildren = [].concat.apply([], grandchildren);
    return children.concat(flattenedGrandChildren);
}