// @flow
//
// A session is an ordered set of questions that keeps track of which questions
// have been answered and which ones have not.

// T specifies the question type. If the question is 
//   "what is the meaning of life?"
// T would be string.
// If the question is an object like
//   {
//        type: 'image',
//        image: 'happy-eyes.jpg',
//        correctAnswer: 'happy',
//        incorrectAnswers: ['sad', 'angry'],
//   }
// T would be that object type.
export class Session<T> {
    _questions: Array<T>;
    _currentQuestionIndex: number;

    constructor(questions: Set<T>) {
        if (questions.size < 1) {
            throw new Error('Need at least one question to create a session');
        }

        this._questions = [...questions];
        this._currentQuestionIndex = 0;
    }

    currentQuestion(): T {
        return this._questions[this._currentQuestionIndex];
    }

    hasNextQuestion(): boolean {
        return this._currentQuestionIndex + 1 < this._questions.length;
    }
    
    // Moves to the next question to be answered in this session. If there is no
    // next question an exception is thrown. Use hasNextQuestion to test
    // against this before calling nextQuestion
    nextQuestion(): T {
        if (this.hasNextQuestion()) {
            this._currentQuestionIndex++;
        } else {
            throw new Error(`attempted to get next question (index ${this._currentQuestionIndex+1} of ${this._questions.length})`);
        }

        return this.currentQuestion();
    }
}