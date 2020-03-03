// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import { Link } from './Link.js';
import { getAllRenderedStrings } from '../../tests/react-testing-library-helpers.js';

const defaultProps = {
    prefix: 'foo',
    linkText: 'bar',
    onLinkPress: jest.fn(),
    postFix: 'baz',
};

it('renders prefix, link text and postfix', () => {
    const props = Object.assign({}, defaultProps, {
        prefix: 'foo',
        linkText: 'bar',
        postfix: 'baz',
    });
    const component = testingLib.render(<Link {...props} />);

    const s = getAllRenderedStrings(component).sort();
    expect(s).toEqual(expect.arrayContaining(['foo', 'bar', 'baz'].sort()));
});

it('contains a touchable thing', () => {
    const onLinkPressMock = jest.fn();
    const props = Object.assign({}, defaultProps, {
        onLinkPress: onLinkPressMock,
    });

    const component = renderer.create(<Link {...props} />).root;
    expect(component.findByProps({onPress: onLinkPressMock })).toBeDefined();
});

it('invokes the callback then the touchable thing is pressed', () => {
    const onLinkPressMock = jest.fn();
    const linkText = 'bar';

    const props = Object.assign({}, defaultProps, {
            linkText,
            onLinkPress: onLinkPressMock,
        },
    );
    const component = renderer.create(<Link {...props} />).root;
    const touchable = component.findByProps({onPress: onLinkPressMock });

    expect(onLinkPressMock).not.toHaveBeenCalled();
    touchable.props.onPress();
    expect(onLinkPressMock).toHaveBeenCalledTimes(1);
});
