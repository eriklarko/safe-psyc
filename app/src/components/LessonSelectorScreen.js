// @flow

import React from 'react';
import { LessonSelector } from './LessonSelector.js';
import { log } from '~/src/services/logger.js';

import type { Navigation } from '~/src/navigation-actions.js';

type Props = {
    navigation: Navigation<*>,
};
type State = {};
export class LessonSelectorScreen extends React.Component<Props, State> {

    render() {
        return <LessonSelector />
    }
}
