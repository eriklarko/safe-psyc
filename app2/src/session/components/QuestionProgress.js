// @flow

import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { Text, constants } from '../../styles';

type Props = {
    current: number,
    total: number,
};
export function QuestionProgress(props: Props) {
    const { current, total, ...restProps } = props;

    const progress = Math.max(current, 0) / total;
    const progressProps = Object.assign({
        progress: progress,
        color: constants.colorGroup.primary.foreground,
        width: null,
        height: constants.space()/2,
        borderWidth: progress === 0 ? 1 : 0, // show outline using border if progress is 0
        borderRadius: 1000,
        animated: true,
        useNativeDriver: true,

        testID: 'progress',
    }, restProps);
    return (
        <View style={styles.container}>
            <Progress.Bar {...progressProps} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
