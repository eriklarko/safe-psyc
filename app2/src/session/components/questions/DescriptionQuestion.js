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
import { Text } from '../../../styles';
import { AnswerList } from './AnswerList.js';
import type { Emotion } from '../../../shared/models';

type Props = {
    text: string,

    answers: Array<Emotion>,
    onAnswer: (answer: Emotion)=>void,
};

export function DescriptionQuestion(props: Props) {
    return <View style={styles.wrapper}>
        <Text>{props.text}</Text>

        <AnswerList
            answers={toAnswerMap(props.answers)}
            onAnswer={props.onAnswer}
        />
    </View>;
}

function toAnswerMap(answers: Array<Emotion>): Map<Emotion, string> {
    const m = new Map();
    for (const answer of answers) {
        m.set(answer, answer.name);
    }
    return m;
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
});
