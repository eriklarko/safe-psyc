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