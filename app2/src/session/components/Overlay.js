// @flow
//
// Overlay is what's shown after an answer is given.

import * as React from 'react';
import { View } from 'react-native';
import { constants, Text, Button, VerticalSpace } from '../../styles';
import { ImageQuestionIncorrectAnswerOverlayContents } from './questions';
import type { TQuestion } from '../models';

type Props = {
    question: TQuestion,
    answer: string,
    onDismiss: ()=>void,
}

export function CorrectAnswerOverlay(props: Props) {
    return <Overlay backgroundColor={constants.positiveColor} onDismiss={props.onDismiss}>
        <Text>
            {props.answer + ' is correct!'}
        </Text>;
    </Overlay>
}

// This component works like the Question component in that it simply routes the
// generic TQuestion answer to the correct concrete implementation or defaults
// to a basic implementation.
export function IncorrectAnswerOverlay(props: Props) {
    const contents = function() {
        switch (props.question.type) {
            case 'image':
                return <ImageQuestionIncorrectAnswerOverlayContents
                    answer={props.answer}
                />;

            default:
                return <Text>
                    {props.answer + ' is unfortunately incorrect'}
                </Text>;
        }
    }();

    return <Overlay backgroundColor={constants.negativeColor} onDismiss={props.onDismiss}>
        {contents}
    </Overlay>
}

type OverlayProps = {
    children: *, // TODO: real type ploxx
    backgroundColor: string, // TODO: real type ploxx
    onDismiss: ()=>void,
};
function Overlay(props: OverlayProps) {
    return <View>
        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'relative',
        }}>
            <View style={constants.styles.flex1}>
                {props.children}
            </View>
            <View
                style={{
                    marginLeft: constants.space(),
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}>
                <FlagQuestionButton />
            </View>
        </View>
        <VerticalSpace multiplier={2} />
        <Button title={'Ok'} onPress={props.onDismiss} />
    </View>
}

function FlagQuestionButton() {
    return "F" // TODO: replace with impl from old app
}
