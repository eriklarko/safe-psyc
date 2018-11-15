// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from '~/src/components/lib/Texts.js';
import { constants } from '~/src/styles/constants.js';
import type { Question } from '~/src/models/questions.js';

type Props = {
    question: Question,
};

export function WordQuestionRow(props: Props) {
    return (
        <View>
            <StandardText>{props.question.correctAnswer.description}</StandardText>
            <StandardText style={{
                ...constants.smallText,

                alignSelf: 'flex-end',
                marginTop: constants.space(1),
                maxWidth: '50%',
            }}>
                {props.question.correctAnswer.name}
            </StandardText>
        </View>
    );
}
