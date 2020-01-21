// @flow
//
// A session is an ordered set of questions that keeps track of which questions
// have been answered and which ones have not.

export class Session<T>{
    _questions: Array<T>;
    _currentQuestionIndex: number;

    constructor(questions: Array<T>) {
        this._questions = questions;

        // start at -1 so that the first call to nextQuestion returns the 0th question.
        this._currentQuestionIndex = -1;
    }
    
    nextQuestion(): T {
        if (this._currentQuestionIndex + 1 < this._questions.length) {
            this._currentQuestionIndex++;
        }

        return this._questions[this._currentQuestionIndex];
    }
}