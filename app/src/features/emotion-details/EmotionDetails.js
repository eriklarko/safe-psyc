// @flow

import React from 'react';
import { View, Image, FlatList } from 'react-native';
import moment from 'moment';

import { StandardText, VerticalSpace, Link } from '~/src/shared/components';
import { constants } from '~/src/styles/constants.js';
import { navigate } from '~/src/navigation-actions.js';
import { routes } from '~/src/routes.js';
import { capitalize, formatParagraph } from '~/src/utils/text-utils.js';
import { log } from '~/src/services/logger.js';

import type { AnswerType, IncorrectAnswer, IncorrectEyeAnswer } from '~/src/models/questions.js';
import type { Emotion } from '~/src/models/emotion.js';

const detailsContainerStyle = {
    flex: 1,
};
const detailsImageStyle = {
    height: 200,
};

export type DataPoints = {
    correct: Array<moment$Moment>,
    incorrect: Array<IncorrectAnswer>,
};
type Props = {
    emotion: Emotion,
    dataPoints: DataPoints,
};
export function EmotionDetails(props: Props) {
    const image = props.emotion.image ? (
        <View>
            <Image
                source={{ uri: props.emotion.image }}
                resizeMode="cover"
                style={detailsImageStyle}
            />
            <VerticalSpace multiplier={2} />
        </View>
    ) : (
        undefined
    );

    const stats = props.dataPoints.correct.length + props.dataPoints.incorrect.length < 4
        ? (
            <StandardText style={[constants.smallText, { textAlign: 'right' }]}>
                As you practice more you will be able to see some statistics about the emotion here.
            </StandardText>
        ) : (
            <View style={{ flexDirection: 'row' }}>
                <ConfusionList
                    style={{ flex: 2, paddingRight: constants.space() }}
                    dataPoints={props.dataPoints}
                />

                <StrengthMeter style={constants.flex1} dataPoints={props.dataPoints} />
            </View>
        );

    return (
        <View style={detailsContainerStyle}>
            <StandardText style={constants.largeText}>
                {capitalize(props.emotion.name)}
            </StandardText>
            <VerticalSpace />

            {image}

            <StandardText>{formatParagraph(props.emotion.description)}</StandardText>
            <VerticalSpace multiplier={2} />

            {stats}
        </View>
    );
}

const filledMeterStyle = {
    width: constants.space(4),
    height: constants.space(20),
    backgroundColor: constants.hilightColor2,
};
const unfilledMeterStyle = {
    width: filledMeterStyle.width,
    backgroundColor: 'lightgray',
};
type StrengthMeterProps = {
    dataPoints: {
        correct: Array<*>,
        incorrect: Array<*>,
    },
};
export function StrengthMeter(props: StrengthMeterProps) {
    const { correct, incorrect } = props.dataPoints;

    const factor = correct.length / (correct.length + incorrect.length);
    const percent = Math.floor(factor * 100);
    return (
        <View style={filledMeterStyle}>
            <View
                style={{
                    ...unfilledMeterStyle,
                    ...{ height: 100 - percent + '%' },
                }}
            />
        </View>
    );
}

type ConfusionListProps = {
    dataPoints: {
        correct: Array<*>,
        incorrect: Array<*>,
    },
};
// Render a list of emotions that the user often confuse with
// the emotion we're showing the details of. I.e. if we're
// showing the details of Angry and the user often answer
// Bitter and Despondent when shown the Angry image, this
// component will show a list with Bitter and Despondent.
function ConfusionList(props: ConfusionListProps) {
    const { dataPoints, ...restProps } = props
    const { correct, incorrect } = dataPoints;

    // $FlowFixMe
    const incorrectEmotions: Array<{
        answer: Emotion,
        when: moment$Moment,
    }> = filterOldAndEyeAnswers(incorrect);

    if (incorrectEmotions.length < 4) {
        return <View {...restProps} />;
    }

    const data = toFlatListData(incorrectEmotions);
    return (
        <View {...restProps}>
            <StandardText>You sometimes get this confused with</StandardText>
            <VerticalSpace />
            <FlatList data={Array.from(data.values())} renderItem={renderRow} />
        </View>
    );

    function filterOldAndEyeAnswers(answers: Array<IncorrectAnswer>) {
        const now = moment();
        const eyeAnswers = ((answers.filter(a => {
            return a.questionType === 'eye-question';
        }): Array<any>): Array<IncorrectEyeAnswer>);

        const scores = {};
        eyeAnswers.forEach(a => {
            if (scores[a.answer.name] === undefined) {
                scores[a.answer.name] = 0;
            }

            const daysSince = moment.duration(now.diff(a.when)).asDays();
            const timeScaledScore = scaleForTime(1, daysSince);

            scores[a.answer.name] += timeScaledScore;
        });

        return eyeAnswers.filter(a => {
            const score = scores[a.answer.name];
            return score >= 0.12;
        });
    }

    function scaleForTime(num: number, timeSince: number): number {
        const scale = sigmoid(-timeSince / 20);
        return num * scale;
    }

    function toFlatListData(answers) {
        const data = new Map();

        answers.forEach(i =>
            data.set(i.answer.name, {
                emotion: i.answer,
                key: i.answer.name,
            })
        );

        return data;
    }

    function renderRow(props: { item: { emotion: Emotion } }) {
        const { emotion } = props.item;
        const navigateToEmotionDetails = () => navigate(routes.EmotionDetails, { emotion: emotion });
        return <Link linkText={emotion.name} onLinkPress={navigateToEmotionDetails} />;
    }
}

function sigmoid(t) {
    return 1 / (1 + Math.pow(Math.E, -t));
}
