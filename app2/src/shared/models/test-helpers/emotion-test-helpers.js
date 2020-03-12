// @flow

import { uniqueString } from '../../text/test-helpers';
import type { Emotion } from '../emotion.js';

type Conf = {
    prefix: string,
}

export function newEmotionWithName(name: string): Emotion {
    return {
        name: name,
        image: { uri: name + '-img' },
    };
}

export function newEmotionsWithNames(...names: Array<string>): Array<Emotion> {
    return names.map(name => newEmotionWithName(name));
}

export function newArbitraryEmotion(conf?: Conf): Emotion {
    let prefix = 'emotion';
    if (conf) {
        prefix = [conf.prefix, prefix];
    }

    const emotionId = uniqueString({prefix:prefix});
    return newEmotionWithName(emotionId);
}

export function newArbitraryEmotions(num: number, conf?: Conf): Array<Emotion> {
    const emos = [];
    for (let i = 0; i < num; i++) {
        emos.push(newArbitraryEmotion(conf));
    }
    return emos;
}
