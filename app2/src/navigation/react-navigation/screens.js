// @flow

import { Home } from '../../home';
import { Loading } from '../../loading';

export type Screen = $Keys<typeof screens>;

export const initialScreen: Screen = 'Loading';
export const screens = {
    Loading: {
        screen: Loading,
    },
    Home: {
        screen: Home,
    },
    EmotionDetails: {
        screen: Home,
    },
};
