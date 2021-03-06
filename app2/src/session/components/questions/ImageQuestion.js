// @flow
//
// ImageQuestion represents a type of question where the user is shown an image
// and is asked to answer which emotion is associated with the image.
//
// It looks something like
// +---------------+
// |    +-----+    |
// |    | o o |    |
// |    |  l  |    |
// |    +-----+    |
// |               |
// |     happy     |
// |      sad      |
// +---------------+

import * as React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from '../../../styles';
import { AnswerList } from './AnswerList.js';
import type { ImageThatNeedsToBeLoaded } from '../../../shared/images';
import type { Emotion } from '../../../shared/models';

type Props = {
    image: ImageThatNeedsToBeLoaded,
    text: string,

    answers: Array<Emotion>,
    onAnswer: (answer: Emotion)=>void,
};
export function ImageQuestion(props: Props) {
    return <View style={styles.wrapper}>
        <Text>{props.text}</Text>
        <Image
            accessibilityRole='image'
            source={props.image}/>

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
    image: {
        flex : 1,

        // make the image fill its container by setting width and height to undefined
        width: undefined,
        height: undefined,

        // always show the whole image, even if it doesn't scale properly
        resizeMode: 'contain',
    },
});
