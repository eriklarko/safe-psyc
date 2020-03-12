// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';
import { Question } from './Question.js';
import { DescriptionQuestion } from './questions/DescriptionQuestion.js';
import { newDescriptionQuestion } from '../test-helpers';
import type { Emotion } from '../../shared/models';
import type { TDescriptionQuestion } from '../models';

it('shuffles the answers', () => {
    // This test first renders the component and checks the order of the
    // answers, then it does the same a bunch of times hoping that one of the
    // re-renders will have a different order. Also, all Star Wars references
    // are strictly on purpose.

    // set up the first render and answer order check
    const descQuestion = newDescriptionQuestion();
    const firstOrder = renderQuestionAndReturnAnswerOrder(descQuestion);

    // save the order as a string for easy array order comparisons
    const firstOrderAsString = firstOrder.join(',');
    let lastOrderAsString = firstOrderAsString;

    // re-render the component a bunch of times and check if the answer order
    // is different from the first render.
    for (let i = 0; i < 100; i++) {
        const lastOrder = renderQuestionAndReturnAnswerOrder(descQuestion);
        lastOrderAsString = lastOrder.join(',');

        if (lastOrderAsString !== firstOrderAsString) {
            break; // a new order was found, no need to keep testing
        }
    }

    // I do the assertion on the order strings instead of just checking if some
    // boolean value indicating that the order was different to make the output
    // a little nicer.
    expect(lastOrderAsString).not.toBe(firstOrderAsString);
});

function renderQuestionAndReturnAnswerOrder(question: TDescriptionQuestion): Array<string> {
    const component = renderer.create(
        <Question
            question={question}
            onAnswer={jest.fn()} />
    ).root;

    return component
            .findByType(DescriptionQuestion)
            .props.answers
            .map(emotion => emotion.name);
}
