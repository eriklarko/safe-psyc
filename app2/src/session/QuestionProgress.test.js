// @flow

import * as React from 'react';
import * as Progress from 'react-native-progress';
import * as testingLib from '@testing-library/react-native';
import { QuestionProgress } from './QuestionProgress.js';

it('shows 0% progress on the first question', () => {
    const component = testingLib.render(<QuestionProgress current={0} total={10} />);

    const progress = getProgress(component);
    expect(progress).toBe(0);
});

it('shows 0% progress before the first question', () => {
    const component = testingLib.render(<QuestionProgress current={-1} total={10} />);

    const progress = getProgress(component);
    expect(progress).toBe(0);
});

it('shows 10% progress on the second question of 10', () => {
    const component = testingLib.render(<QuestionProgress current={1} total={10} />);

    const progress = getProgress(component);
    expect(progress).toBe(0.1);
});

it('shows 90% progress before the last question is answered', () => {
    const component = testingLib.render(<QuestionProgress current={9} total={10} />);

    const progress = getProgress(component);
    expect(progress).toBe(0.9);
});

it('shows 100% progress after the last question is answered', () => {
    const component = testingLib.render(<QuestionProgress current={10} total={10} />);

    const progress = getProgress(component);
    expect(progress).toBe(1);
});

function getProgress(component): number {
    const progressBar = component.getByTestId('progress');
    return progressBar.props.progress;
}
