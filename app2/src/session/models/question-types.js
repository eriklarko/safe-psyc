// @flow

import type { ImageThatNeedsToBeLoaded } from '../../unsorted/images.js';

// TQuestion represent all possible question types in the session
export type TQuestion = TImageQuestion | TDescriptionQuestion;

type TImageQuestion = {
    type: 'image',
    image: ImageThatNeedsToBeLoaded,
    text: string,
    incorrectAnswers: Array<string>,
    correctAnswer: string,

    toString(): string,
}
type TDescriptionQuestion = {
    type: 'description',
    text: string,
    incorrectAnswers: Array<string>,
    correctAnswer: string,

    toString(): string,
}

