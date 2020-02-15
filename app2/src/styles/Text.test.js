// @flow

import 'react-native';
import * as React from 'react';
import renderer from 'react-test-renderer';

import { Text as RNText, StyleSheet } from 'react-native';
import { Text } from './Text.js';

import type { TextStyle } from './Text.js';

it('adds default styles', () => {
    const defaultStyle = getTextStyle(<Text />);
    expect(defaultStyle).toHaveProperty('textTransform');
});

it('overrides styles', () => {
    const defaultStyle = getTextStyle(<Text />);
    expect(defaultStyle).not.toBeUndefined();

    const overrideStyle = {
        textTransform: 'uppercase', // should override the default
    };

    // check that it has textTransform so that we can override it
    expect(defaultStyle).toHaveProperty('textTransform');

    // then check that default != override value
    // $FlowFixMe: flow doesn't like defaultStyle.propertyName, but I do
    expect(overrideStyle.textTransform).not.toBe(defaultStyle.textTransform);

    const actualStyle = getTextStyle(<Text style={ overrideStyle } />);
    expect(actualStyle).toMatchObject(overrideStyle);
});

it('adds new styles', () => {
    const defaultStyle = getTextStyle(<Text />);
    expect(defaultStyle).not.toBeUndefined();

    const overrideStyle = {
        opacity: 0.1337,
    };

    // check that the default style doesn't set the color as this test
    // is about adding new styles.
    expect(defaultStyle).not.toHaveProperty('opacity');

    const actualStyle = getTextStyle(<Text style={ overrideStyle } />);
    expect(actualStyle).toMatchObject(overrideStyle);
});

it('forwards unknown props', () => {
    const component = renderer.create(<Text foo='bar' />);
    const rnText = component.root.findByType(RNText);

    expect(rnText.props).toEqual(expect.objectContaining({ foo: 'bar' }));
});

function getTextStyle(node: React.Element<any>): ?TextStyle {
    const component = renderer.create(node);
    const rnText = component.root.findByType(RNText);

    // $FlowFixMe: some internal DangerouslyImpreciseStyle warning
    return StyleSheet.flatten(rnText.props.style);
}