// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import { Loading } from '.';
import { installMockNavigator } from '../navigation';

it('redirects to home when successfully loaded', () => {
    const navigator = installMockNavigator();

    // render the loading screen, skipping any actual loading. Passing in the
    // _testReplaceLoadFunc prop makes the component call that function instead
    // of the real loading func. Using Promise.resolve makes the fake loading
    // instant
    const component = renderer.create(<Loading
        _testReplaceLoadFunc={Promise.resolve} />);

    return getDidMountPromise(component)
        .then( () => {
            expect(navigator).toHaveResetTo('Home');
        });
});

function getDidMountPromise(component): Promise<void> {
    /* $FlowFixMe: component.getInstance() returns a generic react component.
     * From context I know that `component` is always a <Loading /> component
     * which has the _didMountPromise.
     */
    return component.getInstance()._didMountPromise;
}
