// @flow

import * as React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Button } from '../styles';
import type { ImageThatNeedsToBeLoaded } from './images.js';

type Props = {
    image: ImageThatNeedsToBeLoaded,
    text: string,

    answers: Array<string>,
    onAnswer: (answer: string)=>void,
};
export function ImageQuestion(props: Props) {
    return <View style={styles.wrapper}>
        <Image source={props.image}/>
        <Text>{props.text}</Text>

        <View style={styles.answerListWrapper}>
            {props.answers.map(answer =>
                <Text>{answer}</Text>
            )}
        </View>
    </View>
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
    answerListWrapper: {
        flex: 1,
    },
});