// @flow
//
// A component allowing a user to send a bug report

import * as React from 'react';
import { View } from 'react-native';
import type { Screen } from '../navigation';

// Since these props are exported it makes sense to not allow unplanned
// properties by using {| ... |} instead of just { ... }. This is mostly a
// guess but it feels safer than allowing anything in an app-public type.
export type Props = {|
    screen?: { // the screen that linked to the report, this is presumably where the bug occured
        name: Screen,
        props: ?Object,
        state: ?Object,
    },
    header?: string, // like the subject of an email
|};

export function Report(props: Props) {
    // TODO: implement
    return <View />;
}
