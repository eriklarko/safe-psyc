// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import { getAllRenderedStrings } from '../../tests/react-testing-library-helpers.js';
import { DescriptionQuestion } from './DescriptionQuestion.js';

it('shows the question text', () => {
    const component = renderWithProps({
        text: 'some question text',
    });

    expect(component.getByText('some question text')).toBeDefined();
});

it('shows the answers', () => {
    const component = renderWithProps({
        answers: ['ans1', 'ans2', 'ans3'],
    });

    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining(['ans1', 'ans2', 'ans3']));
});

it('forwards taps on all answers', () => {
    const props = {
        answers: ['a', 'b', 'c'],
        onAnswer: jest.fn(),
    };
    const component = renderWithProps(props);

    // find answer buttons from the accessibility label
    const answers = component.getAllByTestId(/answer/i);
    for (const answerTouchable of answers) {

        // the accessibility label needs to contain the actual answer too, lets use that
        // to get the value we expect.
        const answer = answerTouchable.props.testID.substr('answer-'.length);

        testingLib.fireEvent.press(answerTouchable);
        expect(props.onAnswer).toHaveBeenCalledTimes(1);
        expect(props.onAnswer).toHaveBeenCalledWith(answer);

        props.onAnswer.mockClear();
    }
})

const defaultProps = {
    text: 'foo', 
    answers: [], 
    onAnswer: jest.fn(), 
}
function renderWithProps(overrideProps) {
    const props = Object.assign({}, defaultProps, overrideProps);
    return testingLib.render(<DescriptionQuestion {...props} />);
}
