// @flow

import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';
import { navigateToQuestionDetails } from '../navigation-actions.js';

import type { Question, EyeQuestion } from '../models/questions.js';
import type { Navigation } from '../navigation-actions.js';
import type moment from 'moment';

const detailsContainerStyle = {
    flex: 1,
    padding: constants.space,
    backgroundColor: constants.notReallyWhite,
};
const detailsImageStyle = {
    height: 200,
};

export type DataPoints = {
    correct: Array<moment$Moment>,
    incorrect: Array<{
        question: Question,
        when: moment$Moment,
    }>,
};
type Props = {
    question: Question,
    dataPoints: DataPoints,
    navigation: Navigation<*>,
};
export function QuestionDetails(props: Props) {
    const image = props.question.image
        ? <View>
            <Image source={{ uri: props.question.image }}
                resizeMode='cover'
                style={ detailsImageStyle }/>
            <VerticalSpace multiplier={2} />
          </View>
        : undefined;

    const details = props.dataPoints.correct.length + props.dataPoints.incorrect.length < 4
        ? <StandardText>You haven't encountered this emotion enough to give any stats</StandardText>
        : <View style={{ flexDirection: 'row' }}>
            <ConfusionList
                style={{ flex: 2 }}
                dataPoints={ props.dataPoints }
                navigation={ props.navigation } />

            <StrengthMeter
                style={ constants.flex1 }
                dataPoints={ props.dataPoints } />
        </View>

    return <View style={ detailsContainerStyle }>
        <StandardText style={ constants.largeText }>{ props.question.answer }</StandardText>
        <VerticalSpace />

        { image }

        { details }
    </View>
}

const filledMeterStyle = {
    width: constants.space * 4,
    height: constants.space * 20,
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
    return <View style={ filledMeterStyle }>
        <View style={ {...unfilledMeterStyle, ...{ height: (100 - percent)+'%'}} } />
    </View>
}

function ConfusionList(props) {
    const { navigation, ...restProps } = props;
    const { correct, incorrect } = props.dataPoints;

    if (incorrect.length < 4) {
        return null;
    }

    const data = new Map();
    incorrect.forEach(i => data.set(i.question.answer, {
        question: i.question,
        key: i.question.answer,
    }));
    return <View {...restProps} >
        <StandardText>You sometimes get this confused with...</StandardText>
        <VerticalSpace />
        <FlatList
            data={ Array.from(data.values()) }
            renderItem={ renderRow } />
    </View>

    function renderRow(props: { item: { question: Question }}) {
        const { question } = props.item;
        const navigate = () => navigateToQuestionDetails(navigation, question);
        return <StandardText onPress={ navigate }>{ question.answer }</StandardText>
    }
}
