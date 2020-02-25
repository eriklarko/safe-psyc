// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import testRenderer from 'react-test-renderer';
import { getAllRenderedStrings } from '../../../../tests/react-testing-library-helpers.js';
import { Image } from 'react-native';
import { ImageQuestion } from './ImageQuestion.js';

const defaultProps = {
    image: { uri: './test-image.png' },
    text: 'foo',
    answers: [],
    onAnswer: jest.fn(),
};

it('shows an image', () => {
    const props = Object.assign({}, defaultProps, {
        image: { uri: './test-image.png' },
    });
    const component = testRenderer.create(<ImageQuestion {...props} />).root;

    const imageComponent = component.findByType(Image);
    expect(imageComponent).toBeDefined();
    expect(imageComponent.props.source).toEqual({ uri: './test-image.png' });
});

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

        const answer = answerTouchable.props.testID.substr('answer-'.length);

        testingLib.fireEvent.press(answerTouchable);
        expect(props.onAnswer).toHaveBeenCalledTimes(1);
        expect(props.onAnswer).toHaveBeenCalledWith(answer);

        props.onAnswer.mockClear();
    }
});

function renderWithProps(overrideProps) {
    const props = Object.assign({}, defaultProps, overrideProps);
    return testingLib.render(<ImageQuestion {...props} />);
}
