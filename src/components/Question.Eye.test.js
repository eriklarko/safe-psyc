// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { EyeQuestionComponent } from './Question.Eye.js';

it('contains the image', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = render({ question: question });

    expect(component).toHaveChildMatching(child => {
        return child.props.source === require('test-image.png');
    });
});

it('contains the answer', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = render({ question: question });

    expect(JSON.stringify(component)).toContain(question.answer);
});

function render(props) {
    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<EyeQuestionComponent {...props} />);
    return shallowRenderer.getRenderOutput();
}
