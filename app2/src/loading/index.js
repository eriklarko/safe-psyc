// @flow

import React from 'react';
import { navigator } from '../navigation';
import { ScreenWrapper, Text } from '../styles';
import { logger } from '../logger';

type Props = {};
type State = {};
export class Loading extends React.Component<Props, State> {

    load(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Any async loading that needs to be done should go in here
            setTimeout(resolve, 2000);
        });
    }

    componentDidMount() {
        this.load()
            .then(() => {
                console.log("loading done, resetting to home")
                navigator.resetToHome();
            })
            .catch(e => {
                logger.log("msg", "loading failed", "error", e)
            });
    }

    render() {
        return <ScreenWrapper>
            <Text>Loading</Text>
        </ScreenWrapper>
    }
}