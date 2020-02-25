// @flow
//
// "Routes" a generic TQuestion to its concrete question component
// implementation.

import * as React from 'react';
import { knuthShuffle } from 'knuth-shuffle';
import { ImageQuestion, DescriptionQuestion } from './questions';
import type { TQuestion } from '../models';

type Props = {
    question: TQuestion,
    onAnswer: (answer: string)=>void,
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

function getAnswers(question: TQuestion): Array<string> {
    return knuthShuffle([question.correctAnswer, ...question.incorrectAnswers]);
}
