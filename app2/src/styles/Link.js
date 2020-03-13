// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from './Text.js';
import { constants } from './constants.js';

type Props = {
    prefix?: string,
    linkText: string,
    onLinkPress: () => void,
    postfix?: string,
};

const vertSpace = constants.space(0.5);
const colorGroup = constants.colorGroup.primary;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        paddingVertical: vertSpace,
    },
    pill: {
        backgroundColor: colorGroup.background,
        color: colorGroup.foreground,

        borderRadius: constants.gridSize,

        paddingVertical: vertSpace,
        paddingHorizontal: 2 * vertSpace,
    },
})
;
export function Link(props: Props) {
    const { prefix, linkText, onLinkPress, postfix } = props;

    return (
        <Text style={styles.container}>
            {prefix}
            <Pill text={linkText} onPress={onLinkPress} />
            {postfix}
        </Text>
    );
}

function Pill(props) {
    const { text, onPress } = props;
    return <Text style={styles.pill} onPress={onPress} >
        {text}
    </Text>;
}

