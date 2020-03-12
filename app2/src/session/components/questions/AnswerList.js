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
import { Button, combineStyles } from '../../../styles';

type ViewProps = React.ElementProps<typeof View>;
export type ViewStyle = $PropertyType<ViewProps, 'style'>;

type Props<T> = {
    // The answer in a map from an arbitrary type to the string shown to the
    // user. It's **very** important that this structure is ordered so that
    // the answers are shown in the order the caller expects. JavaScript's
    // Maps are guaranteed to return the insertion order when iterated.
    // See key-order here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    answers: Map<T, string>,
    onAnswer: (T)=>void,

    style?: ViewStyle,
}
export function AnswerList<T>(props: Props<T>) {
    return <View style={combineStyles(styles.wrapper, props.style)}>
        { mapAnswersToButtons(props) }
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
            />
        );
    }

    return buttons;
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
});
