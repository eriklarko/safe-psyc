// @flow

import type { Emotion, ImageThatNeedsToBeLoaded } from '../../shared/models';

// TQuestion represent all possible question types in the session
export type TQuestion = TImageQuestion | TDescriptionQuestion;

export type TImageQuestion = {
    type: 'image',
    image: ImageThatNeedsToBeLoaded,
    text: string,
    incorrectAnswers: Array<Emotion>,
    correctAnswer: Emotion,

    toString(): string,
};

export type TDescriptionQuestion = {
    type: 'description',
    text: string,
    incorrectAnswers: Array<Emotion>,
    correctAnswer: Emotion,

    toString(): string,
};
