// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import { Image } from 'react-native';
import { ImageQuestionIncorrectAnswerOverlayContents } from './ImageQuestionIncorrectAnswerOverlayContents.js';
import { newQuestionWithImage } from '../../test-helpers';
import { Link } from '../../../styles';
import { installMockNavigator } from '../../../navigation';

it('shows the image of the answer in the overlay if the image exists', () => {
    const askedQuestion = newQuestionWithImage();
    const answer = askedQuestion.incorrectAnswers[0];

    const component = renderer.create(<ImageQuestionIncorrectAnswerOverlayContents {...{
        question: askedQuestion,
        answer: answer,
    }} />).root;

    const images = component.findAllByType(Image).map(img => img.props.source);
    expect(images).toEqual(expect.arrayContaining([answer.image]));
});

it("doesn't show the image of the answer in the overlay if the image doesn't exists", () => {
    const askedQuestion = newQuestionWithImage();
    const answer = askedQuestion.incorrectAnswers[0];

    // unset the image to guarantee that the answer has no image
    delete answer.image;

    const component = renderer.create(<ImageQuestionIncorrectAnswerOverlayContents {...{
        question: askedQuestion,
        answer: answer,
    }} />);

    // expect no Image component. findByType throws if no mathcing children
    // could be found, or if it finds many. This should probably be a matcher
    // like
    //   expect(component).not.toHaveChild(Image);
    expect(() => component.root.findByType(Image)).toThrow();
});

it('has a link to the emotion details in the overlay', () => {
    const question = newQuestionWithImage()
    const answer = question.incorrectAnswers[0];
    const navigationMock = installMockNavigator();

    const component = renderer.create(<ImageQuestionIncorrectAnswerOverlayContents {...{
        answeredCorrectly: false,
        question: question,
        answer: answer,
    }} />);

    const helpLink = component.root.findAllByType(Link).filter(c => {
        return c.props.linkText.indexOf(answer.name) >= -1;
    })[0];
    expect(helpLink).toBeDefined();

    helpLink.props.onLinkPress();
    expect(navigationMock).toHaveNavigatedTo('EmotionDetails', {
        emotion: answer,
    });
});

