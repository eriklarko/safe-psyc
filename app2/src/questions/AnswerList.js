// @flow
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, combineStyles } from '../styles';

type ViewProps = React.ElementProps<typeof View>;
export type ViewStyle = $PropertyType<ViewProps, 'style'>;

type Props = {
    answers: Array<string>,
    onAnswer: (string)=>void,

    style?: ViewStyle,
}
export function AnswerList(props: Props) {
    return <View style={combineStyles(styles.wrapper, props.style)}>
        {props.answers.map(answer =>
            <Button
                key={'answer'+ answer}
                accessibilityLabel={'answer ' + answer }

                title={answer}
                onPress={() => props.onAnswer(answer)}
            />
        )}
    </View>
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
});