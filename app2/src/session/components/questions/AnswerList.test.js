// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import { getAllRenderedStrings } from '../../../../tests/react-testing-library-helpers.js';
import { AnswerList } from './AnswerList.js';

it('shows the answers', () => {
    const props = {
        answers: toMap(['ans1', 'ans2', 'ans3']),
        onAnswer: jest.fn(),
    };
    const component = testingLib.render(<AnswerList {...props} />);

    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining(['ans1', 'ans2', 'ans3']));
});

it('forwards taps on all answers', () => {
    const props = {
        answers: toMap(['a', 'b', 'c']),
        onAnswer: jest.fn(),
    };
    const component = testingLib.render(<AnswerList {...props} />);

    // find answer buttons from the accessibility label
    const answers = component.getAllByTestId(/answer/i);
    for (const answerTouchable of answers) {

        // the testID encodes the answer so we'll steal it from there
        const answer = answerTouchable.props.testID.substr('answer-'.length);

        testingLib.fireEvent.press(answerTouchable);
        expect(props.onAnswer).toHaveBeenCalledTimes(1);
        expect(props.onAnswer).toHaveBeenCalledWith(answer);

        props.onAnswer.mockClear();
    }
});

function toMap(strings: Array<string>): Map<string, string> {
    const m = new Map();
    for (const s of strings) {
        m.set(s, s);
    }
    return m;
}
