// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, Button } from 'react-native';
import { constants } from '~/src/styles/constants.js';

type StyleContext = {
    buttonContainerStyle?: View.propTypes.style,
    buttonTextStyle?: View.propTypes.style,
};
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const standardButtonDefaultStyles = {
    enabled: {
        container: {
            borderRadius: 5000,
            backgroundColor: constants.primaryColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            ...constants.normalText,
            color: constants.notReallyWhite,
            textAlign: 'center',
            padding: constants.space(1),
        },
    },

    disabled: {
        container: {
            borderRadius: 5000,
            backgroundColor: constants.disabledColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            ...constants.normalText,
            color: constants.notReallyWhite,
            textAlign: 'center',
            padding: constants.space(1),
        },
    },
};
type StandardButtonProps = {
    onPress: () => *,
    disabled?: boolean,
    title: string | ({ textStyle: View.propTypes.style}) => Object,
    containerStyle?: View.propTypes.style,
    textStyle?: View.propTypes.style,
};
export function StandardButton(props: StandardButtonProps, context: StyleContext) {
    const { title, containerStyle, textStyle, disabled, ...restProps } = props;

    const defaultStyles = disabled
        ? standardButtonDefaultStyles.disabled
        : standardButtonDefaultStyles.enabled;

    return (
        <TouchableOpacity
            style={[
                defaultStyles.container,
                context.buttonContainerStyle,
                containerStyle,
            ]}
            disabled={disabled}
            {...restProps}
        >
            {contents()}
        </TouchableOpacity>
    );

    function contents() {
        if (typeof title === 'string') {
            return <Text style={[defaultStyles.text, context.buttonTextStyle, textStyle]}>
                {title}
            </Text>
        } else {
            // react-native requires components to be capitalized
            const Title = title;

            return <Title textStyle={[defaultStyles.text, context.buttonTextStyle, textStyle]} />;
        }
    }
}
StandardButton.contextTypes = {
    buttonContainerStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const secondaryButtonStyles = {
    container: {
    },
    text: {
        ...constants.normalText,
        textDecorationLine: 'underline',
        textAlign: 'center',
        padding: constants.space(),
    },
};
type SecondaryButtonProps = {
    onPress: () => *,
    title: string,
    containerStyle?: View.propTypes.style,
    textStyle?: View.propTypes.style,
};
export function SecondaryButton(props: SecondaryButtonProps, context: StyleContext) {
    const { title, onPress, containerStyle, textStyle } = props;
    return <TouchableOpacity
        onPress={onPress}
        style={[ secondaryButtonStyles.container, context.buttonContainerStyle, containerStyle ]}
    >
        <Text style={[ secondaryButtonStyles.text, context.buttonTextStyle, textStyle ]}>
            {title}
        </Text>
    </TouchableOpacity>
}
SecondaryButton.contextTypes = {
    buttonContainerStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const largeTextButtonStyle = {
    ...constants.largeText,
    color: constants.notReallyWhite,
    alignSelf: 'center',
    textAlign: 'center',
};
const largeButtonContainerStyle = {
    backgroundColor: constants.primaryColor,
    paddingVertical: constants.space(),
};

type LargeButtonProps = {
    title: string,
    containerStyle?: View.propTypes.style,
    textStyle?: View.propTypes.style,
};
export function LargeButton(props: LargeButtonProps, context: StyleContext) {
    const { title, containerStyle, textStyle, ...restProps } = props;

    return (
        <TouchableOpacity style={[largeButtonContainerStyle, context.buttonContainerStyle, containerStyle]} {...restProps}>
            <Text style={[largeTextButtonStyle, context.buttonTextStyle, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}
LargeButton.contextTypes = {
    buttonContainerStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const heroContainerStyle = {
    enabled: {
        backgroundColor: constants.hilightColor2,
        padding: constants.space(3),
        borderRadius: 10,
        elevation: 2,
    },
    disabled: {
        backgroundColor: constants.defaultTextColor,
        padding: constants.space(3),
        borderRadius: 10,
        elevation: 2,
    },
};
type HeroButtonProps = {
    title: any,
    style?: Object,
    disabled?: boolean,
};
export function HeroButton(props: HeroButtonProps) {
    const { title, style, disabled, ...restProps } = props;
    const content =
        typeof title === 'string' ? (
            <Text style={largeTextButtonStyle}>{title.toUpperCase()}</Text>
        ) : (
            title
        );

    const defaultStyles = disabled
        ? heroContainerStyle.disabled
        : heroContainerStyle.enabled;

    return (
        <TouchableOpacity
            style={[defaultStyles, style]}
            disabled={disabled}
            {...restProps}
        >
            {content}
        </TouchableOpacity>
    );
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const squarePrimaryDefaultStyle = {
    borderWidth: constants.space(0.5),
    borderColor: 'transparent',
};
export function SquarePrimaryButton(props: LargeButtonProps) {
    const { containerStyle, ...rest } = props;

    return <LargeButton
        containerStyle={[squarePrimaryDefaultStyle, containerStyle]}
        {...rest}
    />
}

const squareSecondaryDefaultStyle = {
    borderColor: constants.primaryColor,
    borderWidth: constants.space(0.5),
    backgroundColor: 'transparent',
};
export function SquareSecondaryButton(props: LargeButtonProps) {
    const { containerStyle, ...rest } = props;

    return <LargeButton
        containerStyle={[squareSecondaryDefaultStyle, containerStyle]}
        {...rest}
    />
}

