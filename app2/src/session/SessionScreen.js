// @flow
//
// SessionScreen is a full-screen react component that renders questions in a
// session and notifies a listener when all questions have been answered or
// skipped.
//
// It handles the reporting of correct and incorrect answers, calls
// report.startLookingAtQuestion when a new question is shown and invokes
// onSessionFinished when there are no more questions to be answered.

import * as React from 'react';
import { SessionReport } from './session-report.js';
import { ImageQuestion, DescriptionQuestion } from '../questions';
import { knuthShuffle } from 'knuth-shuffle';

import type { Session } from './session.js';
import type { ImageThatNeedsToBeLoaded } from '../questions';

type Props = {
    // the set of questions to be answered
    session: Session<TQuestion>,

    // the callback invoked when all question have been answered or skipped
    onSessionFinished: (SessionReport<TQuestion, string>) => void,

    // used only by tests to provide a report with mockable timestamps and such.
    report?: SessionReport<TQuestion, string>,
}

type State = {
    // This is a little dirty but necessary because of
    // report.startLookingAtQuestion :(
    //
    // On the first render no question is shown, but after onComponentDidMount
    // is called report.startLookingAtQuestion is invoked the first question
    // is shown.
    //
    // Subsequent questions are all handled by the _newQuestion method. The
    // 'finished' state should never be shown but contains an escape hatch to
    // the report screen if something goes wrong.
    currentQuestion: 'not-started' | TQuestion | 'finished',

    // the report passed to the onSessionFinished callback
    report: SessionReport<TQuestion, string>,
}

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

export class SessionScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            currentQuestion: 'not-started',
            report: props.report || new SessionReport(),
        };
    }

    // componentDidMount is called after the first render and the user sees the
    // 'not-started' screen. That screen isn't terribly useful so instead we
    // trigger this._newQuestion() to show the first question.
    componentDidMount() {
        this._newQuestion();
    }

    // should be called when a new question is ready to be shown to the user
    _newQuestion() {
        // update the state with the session's current question
        this.setState({
            currentQuestion: this.props.session.currentQuestion(),

        }, () => {
            // when the component has been re-rendered from the the setState
            // call above we're sure the question is shown to the user and we
            // can safely call startLookingAtQuestion. The if-statement is here
            // to make flow happy as this.state.currentQuestion can technically
            // be a string, but we know from the setState call that it will
            // always be a real question.
            if (typeof (this.state.currentQuestion) !== 'string') {
                this.state.report.startLookingAtQuestion(this.state.currentQuestion);
            }
        });
    }

    // Moves the session forward one question and re-renders the component. If
    // there are no more questions props.onSessionFinished is invoked with the
    // report.
    _nextQuestion() {
        if (this.props.session.hasNextQuestion()) {
            this.props.session.nextQuestion();
            this._newQuestion();
        } else {
            this.setState({ currentQuestion: 'finished' });
            this.props.onSessionFinished(this.state.report);
        }
    }

    // registers the answer in the report and moves to the next question if
    // applicable. It's an arror function property because of `this` :(
    _onAnswer = (answer: string) => {
        const question = this.props.session.currentQuestion();
        if (answer === question.correctAnswer) {
            this.state.report.registerCorrectAnswer(question);
            this._nextQuestion();

        } else {
            const questionReport = this.state.report.registerIncorrectAnswer(question, answer);
            if (questionReport.answers.length >= 3) {
                // the user has reached the max attempts on the question and
                // it's time to move on.
                this._nextQuestion();
            }
        }
    }

    render() {
        switch (this.state.currentQuestion) {
            case 'not-started':
                // TODO: improve, add button to force component out of this state. with logs
                return 'Loading...';

            case 'finished':
                // TODO: improve, add button to force component out of this state. with logs
                return 'Done! You should have been redirected to the session report...';

            default:
                return <Question
                         question={this.state.currentQuestion}
                         onAnswer={this._onAnswer}
                       />
        }
    }
}

// "Routes" a generic TQuestion to its concrete question component
// implementation.
function Question(props: {
                            question: TQuestion,
                            onAnswer: (answer: string)=>void,
                         }) {

    switch (props.question.type) {
        case 'image':
            return <ImageQuestion
                        image={props.question.image}
                        text={props.question.text}
                        answers={getAnswers(props.question)}
                        onAnswer={props.onAnswer}
                   />
        case 'description':
            return <DescriptionQuestion
                        text={props.question.text}
                        answers={getAnswers(props.question)}
                        onAnswer={props.onAnswer}
                   />
        default:
            // TODO: Log af, we never want this to happen in prod. Should probably contain an escape hatch to the next question or something.
            return `unknown question type ${props.question.type}`;
    }
}

function getAnswers(question: TQuestion): Array<string> {
    return knuthShuffle([question.correctAnswer, ...question.incorrectAnswers]);
}