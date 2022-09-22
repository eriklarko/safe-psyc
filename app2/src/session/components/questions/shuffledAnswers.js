// @flow
import { knuthShuffle } from 'knuth-shuffle';
import type { TQuestion } from '../../models';
import type { Emotion } from '../../../shared/models';

export function getShuffledAnswers(question: TQuestion): Array<Emotion> {
    // The typedefs for knuthShuffle returns `any`, making flow unable to
    // detect incorrect types in its inputs. To make this file more type-safe
    // the `answers` array is defined separately and set to an `Array<Emotion>`
    const answers: Array<Emotion> = [question.correctAnswer, ...question.incorrectAnswers];
    return knuthShuffle(answers);
}
