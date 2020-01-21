// @flow

import * as React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { constants } from './constants.js';

type Props = {
    style?: TextStyle,
    children?: React.Node,
}

type TextProps = React.ElementProps<typeof RNText>;
export type TextStyle = $PropertyType<TextProps, 'style'>;

const defaultStyles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: constants.defaultFontFamily,
        color: constants.primaryTextColor,
        lineHeight: 16 * 1.5,

        textTransform: 'none', // used in tests to test style overrides
    },
    largeText: {
        fontSize: 26,
        fontFamily: constants.defaultFontFamily,
        color: constants.primaryTextColor,
        lineHeight: 26 * 1.5,
    },
});

export function Text(props: Props) {
    const { style, ...restProps } = props;

    // Calculate the style property to pass to the react-native text component.
    let concreteStyle = defaultStyles.text;
    if (style) { // If custom styles are passed in through props.style we combine them with the defaults
        concreteStyle = [defaultStyles.text, style];
    }

    return <RNText style={concreteStyle} {...restProps}>
        {props.children}
    </RNText>
}

export function LargeText(props: Props) {
    return <RNText style={[defaultStyles.largeText, props.style]}>
        {props.children}
    </RNText>
}