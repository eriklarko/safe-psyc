// @flow

import React from 'react';
import { EmotionWordQuestionComponent } from './Question.Word.js';
import { VerticalAnswerList } from '~/src/features/session/questions/VerticalAnswerList.js';
import { answerService } from '../../answer-service.js';

import { findChild, findFirstByTestId, stringifyComponent } from '~/tests/cool-test-lib/component-tree-utils.js';
import { randomWordQuestion } from '~/tests/question-utils.js';
import { render } from '~/tests/cool-test-lib/render-utils.js';

const defaultProps = {
    onCorrectAnswer: () => {},
    onWrongAnswer: () => {},
};

it('contains the answer description', () => {
    const question = randomWordQuestion();
    const component = render(EmotionWordQuestionComponent, { question: question }, defaultProps);

    const questionTextComponent = findFirstByTestId(component, 'question-text');
    expect(questionTextComponent).toContainString(question.correctAnswer.description);
});

it('contains the answer', () => {
    const question = randomWordQuestion();
    const component = render(EmotionWordQuestionComponent, { question: question }, defaultProps);

    expect(getAnswers(component)).toContain(question.correctAnswer);
});

it('contains wrong answers', () => {
    const question = randomWordQuestion();
    const component = render(EmotionWordQuestionComponent, { question: question }, defaultProps);

    const answers = getAnswers(component);
    expect(answers).toContainElementsOtherThan(question.correctAnswer);
});

function getAnswers(root) {
    return findChild(root, VerticalAnswerList)
       .props.answers;
}
