// @flow

import React from 'react';
import renderer from 'react-test-renderer';

import { VerticalSpace } from './VerticalSpace.js';
import { constants } from './constants.js';

it('defaults to multiplier 1', () => {
    const style = getStyle(<VerticalSpace />);
    expect(style).toBeDefined();

    const multiplier = style.height / constants.gridSize;
    expect(multiplier).toBe(1);
});

it('returns the EXACT SAME style object', () => {
    const firstStyle = getStyle(<VerticalSpace />);
    const secondStyle = getStyle(<VerticalSpace />);

    expect(firstStyle).toBe(secondStyle);
});

function getStyle(node) {
    const component = renderer.create(node);

    // $FlowFixMe: component.toJSON() can be undefined but that's fine
    return component.toJSON().props.style;
}
