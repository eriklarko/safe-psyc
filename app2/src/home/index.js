// @flow

import React from 'react';
import { ScreenWrapper, Text, HeroButton, VerticalSpace } from '../styles';
import { navigator } from '../navigation';

type Props = {};
export function Home(props: Props) {
    return <ScreenWrapper>
        <Text>HELLO</Text>
        <VerticalSpace />
        <HeroButton
            title='LEARN EMOS PLIIS'
            onPress={() => navigator.navigateTo('Session')}
        />
    </ScreenWrapper>;
}
