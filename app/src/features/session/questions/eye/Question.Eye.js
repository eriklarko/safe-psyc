// @flow

import React from 'react';
import { View, Image, Alert } from 'react-native';

import { VerticalAnswerList } from '../VerticalAnswerList.js';
import { VerticalSpace, StandardText, Link } from '~/src/shared/components';
import { constants } from '~/src/styles/constants.js';
import { navigateToEmotionDetails } from '~/src/navigation-actions.js';
import { capitalize } from '~/src/utils/text-utils.js';

import type { EyeQuestion } from '~/src/models/questions.js';
import type { Emotion } from '~/src/models/emotion.js';
import type { SpecificOverlayProps } from '../Question.js';

const containerStyle = {
    flex: 1,
    justifyContent: 'space-between',
};
const imageStyle = { height: 200 };

type Props = {
    question: EyeQuestion,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: Emotion) => void,
};
export function EyeQuestionComponent(props: Props) {
    const { question, onCorrectAnswer, onWrongAnswer } = props;

    return (
        <View style={containerStyle}>
            <View>
                <StandardText>
                    Which of the following emotions best describe what the person in the image is
                    feeling?
                </StandardText>
                <VerticalSpace multiplier={2} />

                <Image style={imageStyle} source={{ uri: question.image }} />
                <VerticalSpace multiplier={2} />
            </View>

            <VerticalAnswerList
                answers={question.answers}
                correctAnswer={question.correctAnswer}
                onCorrectAnswer={onCorrectAnswer}
                onWrongAnswer={onWrongAnswer}
                onHelp={toEmotionDetails}
            />
        </View>
    );

    function toEmotionDetails(emotion) {
        navigateToEmotionDetails(emotion);
    }
}

const overlayImageStyle = { height: 100 };
export function EyeQuestionOverlay(props: SpecificOverlayProps<Emotion>) {
    const { answeredCorrectly, answer } = props;
    const answerImage = answer.image;

    const toEmotionDetails = () => navigateToEmotionDetails(answer);

    if (answeredCorrectly) {
        return <StandardText style={{ width: '97%' }}>
            {capitalize(answer.name) + ' is correct!'}
        </StandardText>;
    } else if (!answerImage) {
        return (
            <View style={{ flex: 1, width: '97%'}}>
                <Link
                    linkText={capitalize(answer.name)}
                    onLinkPress={toEmotionDetails}
                    postfix={' is unfortunately incorrect'}
                />
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, width: '97%'}}>
                <StandardText>That's unfortunately incorrect.</StandardText>
                <Link
                    linkText={capitalize(answer.name)}
                    onLinkPress={toEmotionDetails}
                    postfix={' looks like this'}
                />
                <VerticalSpace />
                <Image
                    style={overlayImageStyle}
                    resizeMode="contain"
                    source={{ uri: answerImage }}
                />
            </View>
        );
    }
}
