// @flow

import React from 'react';
import { navigator } from '../navigation';
import { ScreenWrapper, Text } from '../styles';
import { logger } from '../logger';

type Props = {
    // can be used to override the default loading promise in tests
    _testReplaceLoadFunc?: () => Promise<void>,
};
type State = {};
export class Loading extends React.Component<Props, State> {

    // because componentDidMount executes the async function load() we need
    // some way to know when that async operation has finished or else we
    // risk doing things in tests that happen after the test has finished.
    // _didMountPromise does exactly that and can be used like this in tests:
    //
    // it('does stuff', () => {
    //     const component = renderer.create(<Loading />);
    //     return component.getInstance()._didMountPromise
    //         .then( () => {
    //             expect(something).toBe(someting);
    //          });
    // });
    _didMountPromise: Promise<void>;

    load(): Promise<void> {
        // in tests we sometimes need more control of the loading promise
        if (this.props._testReplaceLoadFunc) {
            return this.props._testReplaceLoadFunc();
        }

        return new Promise((resolve, reject) => {
            // Any async loading that needs to be done should go in here
            setTimeout(resolve, 2000);
        });
    }

    componentDidMount() {
        this._didMountPromise = this.load()
            .then(() => {
                logger.log('msg', 'loading done, resetting to home');
                navigator.resetToHome();
            })
            .catch(e => {
                logger.log('msg', 'loading failed', 'error', e);
            });
    }

    render() {
        return <ScreenWrapper>
            <Text>Loading</Text>
        </ScreenWrapper>;
    }
}