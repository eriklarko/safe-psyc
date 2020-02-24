// @flow

import type { TQuestion } from '../SessionScreen.js';

export function newArbitraryQuestion(): TQuestion {
    return {
        type: 'description',
        text: 'what is the meaning of life?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    };
}

function newDescriptionQuestion(question, correctAnswer, incorrectAnswers): TQuestion {
    return {
        type: 'description',
        text: question,
        incorrectAnswers: incorrectAnswers,
        correctAnswer: correctAnswer,
    };
}

export function arbitraryQuestionSetOfSize(numQuestions: number): Set<TQuestion> {
    let questionIndex = 0;
    const set = new Set();
    while (set.size < numQuestions) {
        set.add(newDescriptionQuestion(
            'question' + questionIndex,
            '' + questionIndex,
            ['' + (questionIndex + 1), '' + (questionIndex + 2)],
        ));

        questionIndex++;
    }

    return set;
}