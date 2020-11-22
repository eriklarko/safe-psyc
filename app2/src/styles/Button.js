// @flow

import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Text.js';
import { combineStyles } from './helpers.js';
import { constants } from './constants.js';

import type { AccessibilityRole } from 'react-native/Libraries/Components/View/ViewAccessibility.js';

type ViewProps = $PropertyType<typeof View, 'props'>
type ViewStyle = $PropertyType<ViewProps, 'style'>
type TouchableOpacityProps = $PropertyType<typeof TouchableOpacity, 'props'>;
type Props = TouchableOpacityProps & {
    title: string,

    disabled?: boolean,

    containerStyle?: ViewStyle,
    textStyle?: ViewStyle,

    accessibilityRole?: AccessibilityRole,
};
export function Button(props: Props) {
    const { title, containerStyle, textStyle, disabled, accessibilityRole, ...restProps } = props;

    const defaultStyles = disabled
        ? disabledStyles
        : enabledStyles;

    return (
        <TouchableOpacity
            style={combineStyles(defaultStyles.container, containerStyle)}
            disabled={disabled}
            accessibilityRole={accessibilityRole || 'button'}
            {...restProps}
        >
            <Text style={[defaultStyles.text, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const enabledStyles = createStylesWithColors(constants.colorGroup.primary);
const disabledStyles = createStylesWithColors(constants.colorGroup.primary.disabled);
function createStylesWithColors(colorGroup) {
    return StyleSheet.create({
        container: {
            borderRadius: 5000, // try to make the button always have rounded sides, regardless of the height of the btn
            backgroundColor: colorGroup.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: colorGroup.foreground,
            textAlign: 'center',
            padding: constants.space(1),
        },
    });
}
