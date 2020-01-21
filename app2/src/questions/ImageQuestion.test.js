// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import { Image } from 'react-native';
import { Text } from '../styles';
import { ImageQuestion } from './ImageQuestion.js';

it('shows an image', () => {
    const component = renderWithProps({
        image: { uri: './test-image.png' },
    });

    const imageComponent = component.getByRole('image');
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
    const props = Object.assign({}, defaultProps, {
        answers: ['a', 'b', 'c'],
        onAnswer: jest.fn(),
    });
    const component = testingLib.render(<ImageQuestion {...props} />);

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

const defaultProps = {
    image: { uri: './test-image.png' }, 
    text: 'foo', 
    answers: [], 
    onAnswer: jest.fn(), 
}
function renderWithProps(overrideProps) {
    const props = Object.assign({}, defaultProps, overrideProps);
    return testingLib.render(<ImageQuestion {...props} />);
}

function getAllRenderedStrings(component): Array<string> {
    return component.queryAllByText(/.*/)
            .map(t => t.props.children);
}