// @flow

import { newArbitraryEmotion, newArbitraryEmotions } from '../../shared/models/test-helpers';
import { uniqueString } from '../../shared/text/test-helpers';

import type { TQuestion, TDescriptionQuestion, TImageQuestion } from '../models';

export function newArbitraryQuestion(): TQuestion {
    return newDescriptionQuestion();
}

export function newDescriptionQuestion(): TDescriptionQuestion {
    const question = uniqueString({prefix: 'question'});
    return {
        type: 'description',
        text: question,
        correctAnswer: newArbitraryEmotion({prefix: question}),
        incorrectAnswers: newArbitraryEmotions(2, {prefix: question}),
    };
}

export function newQuestionWithImage(): TImageQuestion {
    const question = uniqueString({prefix: 'img-question'});
    const correctAnswer = newArbitraryEmotion({prefix: question});
    return {
        type: 'image',
        image: correctAnswer.image || { uri: uniqueString({prefix:[question, 'img']}) },
        text: uniqueString({prefix:[question, 'text']}),
        correctAnswer: correctAnswer,
        incorrectAnswers: newArbitraryEmotions(2, {prefix: question}),
    };
}

export function arbitraryQuestionSetOfSize(numQuestions: number): Set<TQuestion> {
    const set = new Set();
    while (set.size < numQuestions) {
        set.add(newArbitraryQuestion());
    }
    return set;
}
