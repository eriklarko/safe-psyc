// @flow

import * as React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { combineStyles } from './helpers.js';
import { constants } from './constants.js';

type TextProps = $PropertyType<typeof RNText, 'props'>;
export type TextStyle = $PropertyType<TextProps, 'style'>;

type Props = TextProps & {
    style?: TextStyle,
    children?: React.Node,
}

const colorGroup = constants.colorGroup.primary;
const defaultStyles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: constants.defaultFontFamily,
        color: colorGroup.foreground,
        lineHeight: 16 * 1.5,

        textTransform: 'none', // used in tests to test style overrides
    },
    largeText: {
        fontSize: 26,
        fontFamily: constants.defaultFontFamily,
        color: colorGroup.foreground,
        lineHeight: 26 * 1.5,
    },
});

export function Text(props: Props) {
    const { style, ...restProps } = props;

    return <RNText style={combineStyles(defaultStyles.text, style)} {...restProps}>
        {props.children}
    </RNText>;
}

export function LargeText(props: Props) {
    return <RNText style={combineStyles(defaultStyles.largeText, props.style)}>
        {props.children}
    </RNText>;
}
