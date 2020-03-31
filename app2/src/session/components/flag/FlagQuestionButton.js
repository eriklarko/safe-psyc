// @flow

import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { constants, ActivityIndicator } from '../../../styles';
import { assets } from '../../../shared/images';
import { logger } from '../../../logger';
import type { TQuestion } from '../../models';

export type FlagQuestionBackendFacade = interface {
    flagQuestion(question: TQuestion): Promise<number>, // the number is the flag id
    unflagQuestion(flagId: number): Promise<void>,
};

type Props = {
    question: TQuestion,
    flagQuestionBackendFacade: FlagQuestionBackendFacade,
};
type State  = {
    status: 'not-submitted' | 'submitting' | 'success' | Error,
};
export class FlagQuestionButton extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            status: 'not-submitted',
        };
    }

    _flag = () => {
        // The withMockedAlert helper doesn't work When calling Alert.alert
        // within a promise for some reason - the `alert` property of the
        // `Alert` object doesn't get overridden. To get around that I resolve
        // the Alert.alert reference outside the promise instead and use this
        // variable within the promise.
        const alert = Alert.alert;

        const { question } = this.props;
        logger.log({msg: 'flagging question', question: question});

        this.setState({ status: 'submitting' }, () => {
            this.props.flagQuestionBackendFacade.flagQuestion(question)
                .then( flagId => {
                    logger.log({msg: 'successfully flagged question', question: question});

                    this.setState({ status: 'success' });
                    alert(
                        'Question flagged',
                        'An administrator will look at the question and make sure it is up to our standards',
                        [
                            {
                                text: 'Eh, I was just exploring!',
                                onPress: () => this._unflag(flagId),
                            },
                            {
                                text: 'Ok',
                            },
                        ],
                    );
                })
                .catch( e => {
                    console.log('in catch arm');
                    logger.log({msg: 'Unable to flag question', question: question, error: e});

                    this.setState({ status: e }, () => console.log('state is error naow'));
                    alert(
                        'Something went wrong',
                        'Unable to flag the question. This has been logged and someone will look into it',
                    );
                });
        });
    }

    _unflag = (id) => {
        // The withMockedAlert helper doesn't work When calling Alert.alert
        // within a promise for some reason - the `alert` property of the
        // `Alert` object doesn't get overridden. To get around that I resolve
        // the Alert.alert reference outside the promise instead and use this
        // variable within the promise.
        const alert = Alert.alert;

        logger.log({msg: 'unflagging question', question: this.props.question});
        this.setState({ status: 'submitting' }, () => {

            this.props.flagQuestionBackendFacade.unflagQuestion(id)
                .then( () => {
                    alert(
                        'All good!',
                        'The flagging was removed, it\'s like it never happened',
                    );

                    this.setState({ status: 'not-submitted' });
                })
                .catch( e => {
                    logger.log({msg: 'unable to unflag', flagId: id, error: e});

                    this.setState({ status: 'not-submitted' });
                    alert(
                        'Eh..',
                        'Unable remove the flagging, but this has been logged and the flag will be ignored :)',
                    );
                });
        });
    }

    render() {
        const { status } = this.state;
        console.log('status', status);

        if (status instanceof Error) {
            return <Image source={assets.mediumRoundedCross} style={styles.icon} />;

        } else if (status === 'submitting') {
            return <ActivityIndicator style={styles.placeholder} />;

        } else if (status === 'success') {
            return <Image source={assets.mediumCheckmark} style={styles.icon} />;

        } else {
            return <TouchableOpacity onPress={ this._flag } testID='btn'>
                    <Image source={assets.mediumFlag} style={styles.icon} />
            </TouchableOpacity>;
        }
    }
}

const placeholderStyle = {
    width: constants.space(3),
    height: constants.space(3),
};
const styles = StyleSheet.create({
    placeholder: placeholderStyle,
    icon: {
        ...placeholderStyle,
        tintColor: constants.colorGroup.primary.foreground,
    },
});
