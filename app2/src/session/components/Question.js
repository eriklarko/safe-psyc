// @flow
//
// "Routes" a generic TQuestion to its concrete question component
// implementation.

import * as React from 'react';
import { ImageQuestion, DescriptionQuestion } from './questions';
import type { TQuestion } from '../models';
import type { Emotion } from '../../shared/models';

// maps TQuestion.type to the component that should be used to render the question
const typeToComponentMap = {
    'image': ImageQuestion,
    'description': DescriptionQuestion,
}

type Props = {
    question: TQuestion,
    onAnswer: (answer: Emotion)=>void,
}
export function Question(props: Props) {
    const { question, onAnswer } = props;

    const QuestionComponent = typeToComponentMap[question.type]
    if (!QuestionComponent) {
        // TODO: Log af, we never want this to happen in prod. Should probably contain an escape hatch to the next question or something. Or we could render all questions before showing them, filtering out the ones that end up here
        return `unknown question type ${props.question.type}`;
    }

    return <QuestionComponent question={question} onAnswer={onAnswer} />
}
