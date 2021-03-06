// @flow

import React from 'react';
import { View, Image } from 'react-native';
import { StandardText, VerticalSpace } from '~/src/shared/components';

import { VerticalAnswerList } from '../VerticalAnswerList.js';
import { constants } from '~/src/styles/constants.js';
import { navigate } from '~/src/navigation-actions.js';
import { routes } from '~/src/routes.js';
import { quote } from '~/src/utils/images.js';

import type { WordQuestion } from '~/src/models/questions.js';
import type { Emotion } from '~/src/models/emotion.js';

type Props = {
    question: WordQuestion,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: Emotion) => void,
};

export class EmotionWordQuestionComponent extends React.Component<Props, {}> {
    render(){
        const props = this.props;
        const { question } = props;

        return (
            <View style={constants.colApart}>
                <View style={constants.flex1} testID='question-text'>

                    <StandardText>
                        Select the emotion best described by
                    </StandardText>

                    <IndentedCursiveText text={question.correctAnswer.description} />

                </View>

                <VerticalAnswerList
                    answers={question.answers}
                    correctAnswer={question.correctAnswer}
                    onCorrectAnswer={props.onCorrectAnswer}
                    onWrongAnswer={props.onWrongAnswer}
                    onHelp={toEmotionDetails}
                />
            </View>
        );
    }
}

function IndentedCursiveText(props: { text: string }) {
    const styles = {
        container: {
            flex: 1,
            flexDirection: 'row',

            marginTop: constants.space(2),
        },
        image: {
            tintColor: constants.primaryColor,
        },
        text: {
            flex: 1,

            marginLeft: constants.space(2),
            marginTop: constants.space(1),

            fontStyle: 'italic',
        },
    };

    return <View style={styles.container}>
        <Image
            source={quote}
            style={styles.image}
        />
        <StandardText style={styles.text}>
            { props.text }
        </StandardText>
    </View>
}

function toEmotionDetails(emotion) {
    navigate(routes.EmotionDetails, { emotion: emotion });
}
