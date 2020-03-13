// @flow

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { constants } from './constants.js';

const defaultStyle = StyleSheet.create({
    outermostContainer: {
        padding: constants.space(),
        flex: 1,
    },
});
type Props = {
    children?: React.Node,
}
export function ScreenWrapper(props: Props) {
    return <View style={defaultStyle.outermostContainer}>
        {props.children}
    </View>;
}