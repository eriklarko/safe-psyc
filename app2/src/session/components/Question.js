// @flow
//
// "Routes" a generic TQuestion to its concrete question component
// implementation.

import * as React from 'react';
import { knuthShuffle } from 'knuth-shuffle';
import { ImageQuestion, DescriptionQuestion } from './questions';
import type { TQuestion } from '../models';
import type { Emotion } from '../../shared/models';

type Props = {
    question: TQuestion,
    onAnswer: (answer: Emotion)=>void,
}

export function Question(props: Props) {

    switch (props.question.type) {
        case 'image':
            return <ImageQuestion
                        image={props.question.image}
                        text={props.question.text}
                        answers={getAnswers(props.question)}
                        onAnswer={props.onAnswer}
                   />;
        case 'description':
            return <DescriptionQuestion
                        text={props.question.text}
                        answers={getAnswers(props.question)}
                        onAnswer={props.onAnswer}
                   />;
        default:
            // TODO: Log af, we never want this to happen in prod. Should probably contain an escape hatch to the next question or something.
            return `unknown question type ${props.question.type}`;
    }
}

function getAnswers(question: TQuestion): Array<Emotion> {
    // The typedefs for knuthShuffle returns `any`, making flow unable to
    // detect incorrect types in its inputs. To make this file mor type-safe
    // the `answers` array is defined separately and set to an `Array<Emotion>`
    const answers: Array<Emotion> = [question.correctAnswer, ...question.incorrectAnswers];
    return knuthShuffle(answers);
}
