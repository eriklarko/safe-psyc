// @flow

import React from 'react';
import { View } from 'react-native';
import { constants } from './constants.js';

type Props = {
    multiplier?: number,
}

export function VerticalSpace(props: Props) {
    return <View style={getMemoizedStyle(props.multiplier)} />;
}

// premature optimaztion is the root of all components
const memoizedStyles = {};
export function getMemoizedStyle(multiplier: number = 1): Object {
    if (memoizedStyles[multiplier] === undefined) {
        memoizedStyles[multiplier] = {
            height: constants.space(multiplier),
        };
    }

    return memoizedStyles[multiplier];
}
