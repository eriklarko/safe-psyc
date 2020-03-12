// @flow

import uuid from 'uuid';

type Conf = {
    prefix: string | Array<string>,
}

export function uniqueString(conf?: Conf): string {
    const prefix = generatePrefix(conf);
    return prefix + '-' + getAndIncrementCount(prefix);
}

function generatePrefix(conf?: Conf): string {
    if (conf) {
        if (typeof conf.prefix === 'string') {
            return conf.prefix;
        } else {
            return conf.prefix.join('-');
        }
    }

    return uuid.v4();
}

const counters = {};
function getAndIncrementCount(prefix: string): number {
    if (!counters[prefix]) {
        counters[prefix] = 0;
    }

    return counters[prefix]++;
}

export function uniqueStrings(num: number, conf: Conf): Array<string> {
    const s = [];
    for (let i = 0; i < num; i++) {
        s.push(uniqueString(conf));
    }
    return s;
}
