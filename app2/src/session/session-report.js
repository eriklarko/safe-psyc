// @flow
//
// A session report keeps track of how the user answered each question. How 
// many attempts it took to get the right answer and what the wrong answers
// were, in order.
//
// TODO: Should this class store the answers in THE CLAUD as answers come in?
//      If users cancel they might assume that the info gathered about them in the session will be thrown away
//      I can get more data for the spaced repetition algo if answered are stored as they come in
//      Error handling and retries?

import moment from 'moment';

type QuestionReport<AnsType> = {
    startTime: moment$Moment,
    answers: Array<Answer<AnsType>>,
}

type Answer<AnsType> = CorrectAnswer | IncorrectAnswer<AnsType>;

type CorrectAnswer = {|
    isCorrect: true,
    time: moment$Moment,
|};

type IncorrectAnswer<AnsType> = {|
    isCorrect: false,
    answer: AnsType,
    time: moment$Moment,
|};

// Used to mock time in tests
type TimeGiver = () => moment$Moment;

// The only requirement of questions at this time is that they can be
// represented as strings.
interface Stringable {
    toString(): string
}

export class SessionReport<QType: Stringable, AnsType: Stringable> {
    _answers: Map<QType, QuestionReport<AnsType>>;
    _time: TimeGiver;

    constructor(time?: TimeGiver) {
        // Use the given time constructor or fall back to moment.utc.
        this._time = time || moment.utc;

        this._answers = new Map();
    }

    // registers the time the user started looking at the question. An expection
    // is thrown if this method is called with the same question multiple times.
    // Question equality is defined by the sameValueZero algorithm, 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality
    startLookingAtQuestion(question: QType): void {
        if (this._answers.has(question)) {
            throw new Error(`called startLookingAtQuestion more than once for question ${question.toString()}`);
        }

        this._answers.set(question, {
            startTime: this._time(),
            answers: [],
        });
    }

    registerCorrectAnswer(question: QType): void {
        const questionReport = this._answers.get(question);
        if (!questionReport) {
            throw new Error('registerCorrectAnswer called before startLookingAtQuestion');
        }

        questionReport.answers.push({
            isCorrect: true,
            time: this._time(),
        });
    }

    registerIncorrectAnswer(question: QType, answer: AnsType): QuestionReport<AnsType> {
        const questionReport = this._answers.get(question);
        if (!questionReport) {
            throw new Error('registerIncorrectAnswer called before startLookingAtQuestion');
        }

        questionReport.answers.push({
            isCorrect: false,
            answer: answer,
            time: this._time(),
        });

        return questionReport;
    }

    getResult(question: QType): ?QuestionReport<AnsType> {
        return this._answers.get(question);
    }

    getAllResults(): Map<QType, QuestionReport<AnsType>> {
        return new Map(this._answers);
    }
}