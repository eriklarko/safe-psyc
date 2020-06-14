// @flow

import { Home } from '../../home';
import { Loading } from '../../loading';
import { Session } from '../../session';
import { Report } from '../../report';
import { AnimationTest } from '../../styles/animation-test';

export type Screen = $Keys<typeof screens>;

export const initialScreen: Screen = 'Loading';
export const screens = {
    AnimationTest: {
        screen: AnimationTest,
    },
    Loading: {
        screen: Loading,
    },
    Home: {
        screen: Home,
    },
    EmotionDetails: {
        screen: Home,
    },
    Session: {
        screen: Session,
    },
    Report: {
        screen: Report,
    },
};
