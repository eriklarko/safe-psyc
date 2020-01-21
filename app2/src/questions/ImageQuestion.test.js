// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import { Image } from 'react-native';
import { Text } from '../styles';
import { ImageQuestion } from './ImageQuestion.js';

it('shows an image', () => {
    const component = renderWithProps({
        image: { uri: './test-image.png' },
    }).root;

    const imageComponent = component.findByType(Image);
    expect(imageComponent).toBeDefined();
    expect(imageComponent.props.source).toEqual({ uri: './test-image.png' });
});

it('shows the question text', () => {
    const component = renderWithProps({
        text: 'some question text',
    }).root;

    expect(getAllRenderedStrings(component)).toContain('some question text');
});

it('shows the answers', () => {
    const component = renderWithProps({
        answers: ['ans1', 'ans2', 'ans3'],
    }).root;

    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining(['ans1', 'ans2', 'ans3']));
});

it('forwards taps on all answers', () => {
    expect(true).toBe(false);
})

const defaultProps = {
    image: { uri: './test-image.png' }, 
    text: 'foo', 
    answers: [], 
    onAnswer: jest.fn(), 
}
function renderWithProps(overrideProps) {
    const props = Object.assign({}, defaultProps, overrideProps);
    return renderer.create(<ImageQuestion {...props} />);

}

function getAllRenderedStrings(component): Array<string> {
    return component.findAllByType(Text)
            .map(t => t.props.children);
}