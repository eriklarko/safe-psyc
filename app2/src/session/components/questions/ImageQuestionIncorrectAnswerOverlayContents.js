// @flow

import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Text, Link, VerticalSpace } from '../../../styles';
import { capitalize } from '../../../shared/text';
import { navigator } from '../../../navigation';
import type { Emotion } from '../../../shared/models';

type Props = {
    answer: Emotion,
};
export function ImageQuestionIncorrectAnswerOverlayContents(props: Props) {
    const { answer } = props;
    const answerImage = answer.image;
    const navigateToEmotionDetails = () => navigator.toEmotionDetails(answer);

    if (!answerImage) {
        return (
            <Link
                linkText={capitalize(answer.name)}
                onLinkPress={navigateToEmotionDetails}
                postfix={' is unfortunately incorrect'}
            />
        );
    } else {
        return (
            <>
                <Text>That's unfortunately incorrect.</Text>
                <Link
                    linkText={capitalize(answer.name)}
                    onLinkPress={navigateToEmotionDetails}
                    postfix={' looks like this'}
                />
                <VerticalSpace />
                <Image
                    style={styles.answerImage}
                    resizeMode='contain'
                    source={ answerImage }
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    answerImage: {
        height: 100,
    },
});
