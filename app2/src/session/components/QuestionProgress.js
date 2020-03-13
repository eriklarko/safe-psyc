// @flow

import React from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { constants } from '../../styles';

type Props = {
    current: number,
    total: number,
};
const borderRadius = constants.space() / 2;
export function QuestionProgress(props: Props) {
    const { current, total, ...restProps } = props;

    const progress = Math.max(current, 0) / total;
    const progressProps = Object.assign({
        progress: progress,
        color: constants.colorGroup.primary.background,
        width: null,
        height: constants.space(),
        borderRadius: borderRadius,
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

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
    },
};
