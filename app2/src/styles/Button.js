// @flow

import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Text.js';
import { constants } from './constants.js';

type ButtonProps = {|
    title: string,
    onPress: () => void,

    disabled?: boolean,

    containerStyle?: View.propTypes.style,
    textStyle?: View.propTypes.style,
|};
export function Button(props: ButtonProps) {
    const { title, containerStyle, textStyle, disabled, ...restProps } = props;

    const defaultStyles = disabled
        ? disabledStyles
        : enabledStyles;

    return (
        <TouchableOpacity
            style={[defaultStyles.container, containerStyle]}
            disabled={disabled}
            {...restProps}
        >
            <Text style={[defaultStyles.text, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const enabledStyles = createStylesWithColors(constants.primaryForegroundColor, constants.primaryBackgroundColor);
const disabledStyles = createStylesWithColors(constants.disabledForegroundColor, constants.disabledBackgroundColor);

function createStylesWithColors(foreground, background) {
    return StyleSheet.create({
        container: {
            borderRadius: 5000, // try to make the button always have rounded sides, regardless of the height of the btn
            backgroundColor: background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: foreground,
            textAlign: 'center',
            padding: constants.space(1),
        },
    });
}