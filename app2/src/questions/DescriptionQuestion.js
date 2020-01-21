// @flow
//
// DescriptionQuestion represents a type of question where the user is shown a
// description of an emotion and is asked to answer which emotion is associated
// with the description.
//
// It looks something like
// +-------------+
// |  felt when  |
// |   laughing  |
// |             |
// |    happy    |
// |     sad     |
// +-------------+

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from '../styles';
import { AnswerList } from './AnswerList.js';
import type { ImageThatNeedsToBeLoaded } from './images.js';

type Props = {
    text: string,

    answers: Array<string>,
    onAnswer: (answer: string)=>void,
};

export function DescriptionQuestion(props: Props) {
    return <View style={styles.wrapper}>
        <Text>{props.text}</Text>

        <AnswerList 
            answers={props.answers}
            onAnswer={props.onAnswer}
        />
    </View>
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
});
