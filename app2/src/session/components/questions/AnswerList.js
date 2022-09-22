// @flow
//
// Represents a list of possible answers to a question. It's modeled after the
// <select> tag in HTML, where each option has a key and a value. Unfortunately
// the key cannot be used for the react key and testID properties because they
// require strings and I want the option key to be an arbitrary object.
//
// In the case of each answer being an emotion, the key is the Emotion object
// and the value shown to the user is e.g. the emotion name.

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, VerticalSpace, combineStyles, constants } from '../../../styles';

// Getting this flow error:
//   Cannot instantiate $PropertyType because property props is missing in
//   React.AbstractComponentStatics
// But the exact same code works fine in Button.js so lets ignore it :(
// $FlowFixMe: see above
type ViewProps = $PropertyType<typeof View, 'props'>
type ViewStyle = $PropertyType<ViewProps, 'style'>;

type Props<T> = {
    // The answer in a map from an arbitrary type to the string shown to the
    // user. It's **very** important that this structure is ordered so that
    // the answers are shown in the order the caller expects. JavaScript's
    // Maps are guaranteed to return the insertion order when iterated.
    // See key-order here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    answers: Map<T, string>,
    onAnswer: (T)=>void,

    wrapperStyle?: ViewStyle,
    buttonContainerStyle?: ViewStyle,
    buttonTextStyle?: ViewStyle,
}
export function AnswerList<T>(props: Props<T>) {
    const buttons = mapAnswersToButtons(props)

    // I want space between each button, and specifying a margin on each button
    // leads to extra space either above the first button or below the last
    // button. To avoid that and make this component play nicer with other
    // components I opted for inserting a <Spacer /> component between the
    // buttons instead.
    const children = []
    for (let i = 0; i < buttons.length; i++) {
        children.push(buttons[i])

        if (i < buttons.length - 1){
            children.push(<VerticalSpace key={'spacer-' + i} multiplier={2} />)
        }
    }
    return <View style={combineStyles(styles.wrapper, props.wrapperStyle)}>
        { children }
    </View>;
}

function mapAnswersToButtons<T>(props: Props<T>) {
    const buttons = [];

    for (const [key, answer] of props.answers) {
        buttons.push(
            <Button
                key={'answer' + answer}
                testID={'answer-' + answer }

                title={answer}
                onPress={() => props.onAnswer(key)}
                containerStyle={combineStyles(styles.buttonContainer, props.buttonContainerStyle)}
                textStyle={combineStyles(styles.buttonText, props.buttonTextStyle)}
            />
        );
    }

    return buttons;
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'column',
    },
    buttonContainer: {
        padding: constants.space(1),
    },
    buttonText: {
    },
});
