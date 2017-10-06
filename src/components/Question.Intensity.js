// flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StandardText } from './Texts.js';
import { StandardButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { constants } from '../styles/constants.js';

import { SnapSlider } from './SnapSlider.js';

import type { IntensityQuestion } from '../models/questions.js';

type Props = {
    question: IntensityQuestion,
    onCorrectAnswer: () => void,
    onWrongAnswer: (answer: number) => void,
};
type State = {
    lastAnswer: number,
};

const containerStyle = {
    flex: 1,
    justifyContent: 'space-between',
};
export class IntensityQuestionComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            lastAnswer: 1,
        };
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.question !== this.props.question) {
            this.setState({
                lastAnswer: 1,
            });
        }
    }

    render() {
        const emotionName = this.props.question.correctAnswer.name;
        const referencePoints =  new Map();
        referencePoints.set(1, 'calm');
        referencePoints.set(3, 'irritated');
        referencePoints.set(5, 'angry');

        return <View style={ containerStyle }>
            <View>
                <StandardText>How intense is { emotionName }?</StandardText>
                <VerticalSpace multiplier={2} />
                <IntensityScale
                    onIntensityChosen={ this._onIntensityChosen.bind(this) }
                    referencePoints={ referencePoints }
                    selectedGroup={ this.state.lastAnswer }
                    />
            </View>

            <StandardButton
                onPress={ this._submit.bind(this) }
                title={ 'Submit' } />
        </View>
    }

    _onIntensityChosen(intensity: number) {
        this.setState({
            lastAnswer: intensity,
        });
    }

    _submit() {
        const answer = this.state.lastAnswer;
        const correctIntensity = this.props.question.correctAnswer.intensity;
        const correctGroup = intensityToGroup(correctIntensity);

        if (correctGroup === answer) {
            this.props.onCorrectAnswer();
        } else {
            this.props.onWrongAnswer(answer);
        }
    }
};

function intensityToGroup(intensity) {
    const quotient = Math.floor(intensity / 2);
    const remainder = intensity % 2;

    return Math.min(5, quotient + remainder);
}

type ScaleProps = {
    onIntensityChosen: (number) => void,
    referencePoints: Map<number, string>,
    selectedGroup: number,
};
export function IntensityScale(props: ScaleProps) {
    const items = [];
    for (let i = 1; i <= 5; i++) {
        items.push({
            value: i,
            label: props.referencePoints.get(i) || '',
        });
    }

    return <SnapSlider
        items={ items }
        value={ props.selectedGroup - 1 }
        onSlidingComplete={ (item) => props.onIntensityChosen(item.value) }
        />
}

export function IntensityQuestionOverlay(props: SpecificOverlayProps<number>) {
    const text = props.answeredCorrectly
        ? 'That\'s correct!'
        : 'That\'s sadly incorrect';

    return <StandardText>{ text }</StandardText>;
}
