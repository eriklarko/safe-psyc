// @flow

import React from 'react';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';
import { constants } from './constants.js';

type ActivityIndicatorProps = $PropertyType<typeof ActivityIndicator, 'props'>;
type Props = ActivityIndicatorProps & {
    size: 'small' | 'large',
    color: string,
};
export function ActivityIndicator(props: Props) {
    return <RNActivityIndicator {...props} />;
}
ActivityIndicator.defaultProps = {
    size: 'small',
    color: constants.colorGroup.primary.foreground,
};

