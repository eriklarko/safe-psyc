// @flow

import type { Emotion } from '../../shared/models';
import type { ImageThatNeedsToBeLoaded } from '../../shared/images';

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
