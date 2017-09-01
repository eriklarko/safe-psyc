// @flow

import type { Question } from '../models/questions';

class AnswerServiceImpl {

    _answerPool: Array<string> = [];

    getAnswersTo(question: Question, numAnswers: number): Array<string> {
        const answers = this._getRandomAnswersFromPool(numAnswers - 1);

        if (numAnswers > 0) {
            answers.push(question.answer);
        }
        return answers;
    }

    _getRandomAnswersFromPool(numAnswers: number): Array<string> {
        const poolCopy = this._answerPool.slice();

        const answers = [];
        for (let i = 0; i < numAnswers && poolCopy.length > 0; i++) {
            const rnd = Math.floor(Math.random() * poolCopy.length);

            const answer = poolCopy[rnd];
            answers.push(poolCopy[rnd]);

            poolCopy.splice(rnd, 1);
        }

        return answers;
    }

    setAnswerPool(pool: Array<string>) {
        this._answerPool = pool;
    }
}

export const answerService = new AnswerServiceImpl();