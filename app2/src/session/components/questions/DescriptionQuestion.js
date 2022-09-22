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
import { Text, constants } from '../../../styles';
import { getShuffledAnswers } from './shuffledAnswers.js'
import { AnswerList } from './AnswerList.js';
import type { Emotion } from '../../../shared/models';
import type { TQuestion } from '../../models';

type Props = {
    question: TQuestion,
    onAnswer: (answer: Emotion)=>void,
};

export function DescriptionQuestion(props: Props) {
    const text = props.question.text
    const answers = getShuffledAnswers(props.question)

    return <View style={styles.wrapper}>
        <Text style={styles.questionText}>{text}</Text>
        <AnswerList
            answers={toAnswerMap(answers)}
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
        paddingHorizontal: constants.space(4),
    },
    questionText: {
        marginVertical: constants.space(2),
        fontSize: 23,
    },
});
