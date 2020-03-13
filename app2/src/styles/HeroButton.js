// @flow

import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LargeText } from './Text.js';
import { constants } from './constants.js';

type Props = {|
    title: string,
    onPress: ()=>void,

    disabled?: boolean;
|};

const colorGroup = constants.colorGroup.primary;
const styles = StyleSheet.create({
    enabled: {
        backgroundColor: colorGroup.highlight,
        padding: constants.space(3),
        borderRadius: 10,
        elevation: 2,
    },
    disabled: {
        backgroundColor: colorGroup.disabled.background,
        padding: constants.space(3),
        borderRadius: 10,
        elevation: 2,
    },

    textStyle: {
        alignSelf: 'center',
        textAlign: 'center',
    },
});

export function HeroButton(props: Props) {
    const { title, disabled, ...restProps } = props;

    const content = typeof title === 'string'
        ? <LargeText style={styles.textStyle}>{title.toUpperCase()}</LargeText>
        : title;

    const style = disabled
        ? styles.disabled
        : styles.enabled;

    return (
        <TouchableOpacity
            disabled={disabled}
            style={style}
            {...restProps}>
            {content}
        </TouchableOpacity>
    );
}
