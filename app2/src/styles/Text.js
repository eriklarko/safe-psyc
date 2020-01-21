// @flow

import * as React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

type TextProps = React.ElementProps<typeof RNText>;
export type TextStyle = $PropertyType<TextProps, 'style'>;

const defaultStyle = StyleSheet.create({
    rnText: {
        textTransform: 'none', // used in tests to test style overrides
    },
});

export function Text(props: {
    style?: TextStyle,
    children?: React.Node,
}) {
    const style = Object.assign({}, defaultStyle.rnText, props.style);
    return <RNText style={style}>
        {props.children}
    </RNText>
}