// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import { ImageQuestionIncorrectAnswerOverlayContents } from './ImageQuestionIncorrectAnswerOverlayContents.js';
import { Image } from 'react-native';
import { newQuestionWithImage } from '../../test-helpers';

it('shows the image of the answer in the overlay if the image exists', () => {
    const askedQuestion = newQuestionWithImage();
    const answer = askedQuestion.incorrectAnswers[0];

    const component = renderer.create(<ImageQuestionIncorrectAnswerOverlayContents {...{
        question: askedQuestion,
        answer: answer,
    }} />).root;

    const images = component.findAllByType(Image).map(img => img.props.source.uri);
    expect(images).toEqual(expect.arrayContaining([answer.image]));
});

it("doesn't show the image of the answer in the overlay if the image doesn't exists", () => {
    const askedQuestion = newQuestionWithImage();
    const answer = askedQuestion.incorrectAnswers[0];

    // unset the image to guarantee that the question has no image
    askedQuestion.image = null;

    expect(askedQuestion.correctAnswer.image).not.toEqual(answer.image);

    const component = testingLib.render(<ImageQuestionIncorrectAnswerOverlayContents {...{
        question: askedQuestion,
        answer: answer,
    }} />);

    expect(component).not.toHaveChild(Image);
});

it('has a link to the emotion details in the overlay', () => {
    const question = newQuestionWithImage()
    const answer = question.incorrectAnswers[0];
    const navigationMock = mockNavigation();

    const component = testingLib.render(<ImageQuestionIncorrectAnswerOverlayContents {...{
        answeredCorrectly: false,
        question: question,
        answer: answer,
    }} />);

    const helpLink = findChildren(component, Link).filter(c => {
        return c.props.linkText.indexOf(answer.name) >= -1;
    })[0];
    expect(helpLink).toBeDefined();

    helpLink.props.onLinkPress();
    expect(navigationMock).toHaveNavigatedTo('EmotionDetails', {
        emotion: answer,
    });
});

