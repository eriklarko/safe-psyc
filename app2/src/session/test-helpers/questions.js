// @flow

import type { TQuestion, TImageQuestion } from '../models';

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

export function newQuestionWithImage(): TImageQuestion {
    return {
        type: 'image',
        image: { uri: uniqueString('img') },
        text: uniqueString('text'),
        incorrectAnswers: uniqueStrings(2, 'ans'),
        correctAnswer: uniqueString('ans'),
    };
}

let counter = 0;
function uniqueString(prefix: string): string {
    return prefix + '-' + counter++;
}

function uniqueStrings(num: number, prefix: string): Array<string> {
    const s = [];
    for (let i = 0; i < num; i++) {
        s.push(uniqueString(prefix));
    }
    return s;
}