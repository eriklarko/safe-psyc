// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import { getAllRenderedStrings } from '../../tests/react-testing-library-helpers.js';
import { AnswerList } from './AnswerList.js';

it('shows the answers', () => {
    const props = {
        answers: ['ans1', 'ans2', 'ans3'],
        onAnswer: jest.fn(),
    };
    const component = testingLib.render(<AnswerList {...props} />);

    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining(['ans1', 'ans2', 'ans3']));
});

it('forwards taps on all answers', () => {
    const props = {
        answers: ['a', 'b', 'c'],
        onAnswer: jest.fn(),
    };
    const component = testingLib.render(<AnswerList {...props} />);

    // find answer buttons from the accessibility label
    const answers = component.getAllByLabelText(/answer/i);
    for (const answerTouchable of answers) {

        // the accessibility label needs to contain the actual answer too, lets use that
        // to get the value we expect.
        const answer = answerTouchable.props.accessibilityLabel.substr('answer '.length);

        testingLib.fireEvent.press(answerTouchable);
        expect(props.onAnswer).toHaveBeenCalledTimes(1);
        expect(props.onAnswer).toHaveBeenCalledWith(answer);

        props.onAnswer.mockClear();
    }
})