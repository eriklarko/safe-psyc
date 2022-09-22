// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import { getAllRenderedStrings } from '../../../../tests/react-testing-library-helpers.js';
import { DescriptionQuestion } from './DescriptionQuestion.js';
import { newEmotionWithName, newEmotionsWithNames } from '../../../shared/models/test-helpers';
import { newDescriptionQuestion } from '../../test-helpers';

const defaultProps = {
    question: newDescriptionQuestion(),
    onAnswer: jest.fn(),
};

it('shows the question text', () => {
    const question = newDescriptionQuestion();
    question.text = 'some question text'

    const component = renderWithProps({ question: question });
    expect(component.getByText('some question text')).toBeDefined();
});

it('shows the answers', () => {
    const question = newDescriptionQuestion();
    question.correctAnswer = newEmotionWithName('ans1')
    question.incorrectAnswers = newEmotionsWithNames('ans2', 'ans3')

    const component = renderWithProps({ question: question });
    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining(['ans1', 'ans2', 'ans3']));
});

it('forwards taps on all answers', () => {
    const props = {
        onAnswer: jest.fn(),
    };
    const component = renderWithProps(props);

    // find answer buttons by testID
    const answers = component.getAllByTestId(/answer/i);
    for (const answerTouchable of answers) {

        // read the expected answer from the testID. this isn't great but it works :)
        const answer = answerTouchable.props.testID.substr('answer-'.length);

        testingLib.fireEvent.press(answerTouchable);
        expect(props.onAnswer).toHaveBeenCalledTimes(1);
        // check that the correct emotion was passed to the onAnswer callback
        expect(props.onAnswer).toHaveBeenCalledWith(expect.objectContaining({name: answer}));

        props.onAnswer.mockClear();
    }
});

function renderWithProps(overrideProps) {
    const props = Object.assign({}, defaultProps, overrideProps);
    return testingLib.render(<DescriptionQuestion {...props} />);
}
