// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    Button,
} from 'react-native';
import { constants } from '../styles/constants.js';

const largeTextButtonStyle = {
    ...constants.largeText,
    color: constants.notReallyWhite,
    alignSelf: 'center',
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const standardButtonDefaultStyles = {
    container: {
        borderRadius: constants.mediumRadius,
        backgroundColor: constants.primaryColor,
    },
    text: {
        ...constants.normalText,
        color: constants.notReallyWhite,
        textAlign: 'center',
        padding: constants.space,
    },
};
type StandardButtonProps = {
    onPress: () => *,
    title: string,
    containerStyle?: Object,
    textStyle?: Object,
};
type StandardButtonContext = {
    buttonContainerStyle?: Object,
    buttonTextStyle?: Object,
};
export function StandardButton(
    props: StandardButtonProps,
    context: StandardButtonContext
) {
    const { title, containerStyle, textStyle, ...restProps } = props;

    return (
        <TouchableOpacity
            style={[
                standardButtonDefaultStyles.container,
                context.buttonContainerStyle,
                containerStyle,
            ]}
            {...restProps}
        >
            <Text
                style={[
                    standardButtonDefaultStyles.text,
                    context.buttonTextStyle,
                    textStyle,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
StandardButton.contextTypes = {
    buttonContainerStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
type LargeButtonProps = { title: string, style?: Object };
export function LargeButton(props: LargeButtonProps) {
    const { title, style, ...restProps } = props;

    const defaultStyle = {
        backgroundColor: constants.primaryColor,
        paddingVertical: 1 * constants.space,
        elevation: 2,
    };
    const concreteStyle = style
        ? Object.assign({}, defaultStyle, style)
        : defaultStyle;

    return (
        <TouchableHighlight style={concreteStyle} {...restProps}>
            <Text style={largeTextButtonStyle}>{title}</Text>
        </TouchableHighlight>
    );
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const heroContainerStyle = {
    backgroundColor: constants.hilightColor2,
    padding: 3 * constants.space,
    borderRadius: 10,
    elevation: 2,
};
type HeroButtonProps = {
    title: any,
};
export function HeroButton(props: HeroButtonProps) {
    const { title, ...restProps } = props;
    const content =
        typeof title === 'string' ? (
            <Text style={largeTextButtonStyle}>{title.toUpperCase()}</Text>
        ) : (
            title
        );

    return (
        <TouchableHighlight style={heroContainerStyle} {...restProps}>
            {content}
        </TouchableHighlight>
    );
}
