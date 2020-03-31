// @flow
//
// Overlay is the banner thing shown after an answer is given. It's responsible
// for most of the look and feel of the answer feedback, but can defer what's
// shown to the user to more specialized components if they can give a better
// UX for the given question type. For image questions e.g. the image associated
// with an incorrect answer can be shown.

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { constants, Text, Button, VerticalSpace } from '../../styles';
import { FlagQuestionButton } from './flag/FlagQuestionButton.js';
import { ImageQuestionIncorrectAnswerOverlayContents } from './questions';
import type { TQuestion } from '../models';
import type { Emotion } from '../../shared/models';

type Props = {
    question: TQuestion,
    answer: Emotion,
    onDismiss: ()=>void,
}

export function CorrectAnswerOverlay(props: Props) {
    return <Overlay
            question={props.question}
            colorGroup={constants.colorGroup.positive}
            onDismiss={props.onDismiss}>
        <Text>
            {props.answer.name + ' is correct!'}
        </Text>;
    </Overlay>;
}

export function IncorrectAnswerOverlay(props: Props) {
    const contents = function() {
        switch (props.question.type) {
            case 'image':
                return <ImageQuestionIncorrectAnswerOverlayContents
                    answer={props.answer}
                />;

            default:
                return <Text>
                    {props.answer.name + ' is unfortunately incorrect'}
                </Text>;
        }
    }();

    return <Overlay
            question={props.question}
            colorGroup={constants.colorGroup.negative}
            onDismiss={props.onDismiss}>
        {contents}
    </Overlay>;
}

type OverlayProps = {
    children: *, // TODO: real type ploxx
    question: TQuestion,
    colorGroup: { foreground: string, background: string }, // TODO: Not strings!
    onDismiss: ()=>void,
};
function Overlay(props: OverlayProps) {
    // TODO: Use real implementation :)
    const flagQuestionBackendFacade = {
        flagQuestion: () => Promise.resolve(1),
        unflagQuestion: () => Promise.resolve(),
    };

    return <View>

        <View style={styles.horizontalSpacer}>
            <View style={constants.styles.flex1}>
                {props.children}
            </View>

            <View style={styles.flagContainer}>
                <FlagQuestionButton
                    question={props.question}
                    flagQuestionBackendFacade={flagQuestionBackendFacade}
                />
            </View>
        </View>

        <VerticalSpace multiplier={2} />

        <Button title={'Ok'} onPress={props.onDismiss} />
    </View>;
}

const styles = StyleSheet.create({
    horizontalSpacer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // set relative pos so that flagContainer can use absolute pos with
        // the parent as 0,0
        position: 'relative',
    },
    flagContainer: {
        marginLeft: constants.space(),
        position: 'absolute',
        top: 0,
        right: 0,
    },
});
