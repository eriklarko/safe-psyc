// @flow
//
// Defines an image with a tap listener

import * as React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { combineStyles } from './helpers.js';

import type { PreloadedImage } from '../shared/models';
import type { AccessibilityRole } from 'react-native/Libraries/Components/View/ViewAccessibility.js';

type TouchableOpacityProps = React.ElementProps<typeof TouchableOpacity>;
type ImageProps = React.ElementProps<typeof Image>;
type ImageStyle = $PropertyType<ImageProps, 'style'>;
type Props = TouchableOpacityProps & {
    onPress: () => void,
    image: PreloadedImage,
    disabledImage?: PreloadedImage,
    disabled?: boolean,
    accessibilityRole?: AccessibilityRole,
    style?: ImageStyle,
};

export function ImageButton(props: Props) {
    const { onPress, image, disabledImage, disabled, accessibilityRole, style, ...restProps } = props;

    const imageSource = disabled
        ? disabledImage
        : image;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            accessibilityRole={accessibilityRole || 'button'}
            {...restProps}
        >
            <Image source={imageSource} style={combineStyles(defaultStyles.image, style)} />
        </TouchableOpacity>
    );
}

const defaultStyles = StyleSheet.create({
    image: {
    },
});
