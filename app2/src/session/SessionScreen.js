// @flow
//
// SessionScreen is a full-screen react component that renders a set of
// questions and notifies a listener when all questions have been answered or
// skipped.
//
// It handles the reporting of correct and incorrect answers, calls
// report.startLookingAtQuestion when a new question is shown and invokes
// onSessionFinished when there are no more questions to be answered.

import * as React from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { ImageButton, Button, Text, constants } from '../styles';
import { SessionReport } from './models';
import { Question, QuestionProgress } from './components';
import { assets } from '../shared/images';
import { logger } from '../logger';
import { navigator } from '../navigation';

import type { Session, TQuestion } from './models';
import type { Emotion } from '../shared/models';

export type Props = {
    // the set of questions to be answered
    session: Session<TQuestion>,

    // the callback invoked when all question have been answered or skipped
    onSessionFinished: (SessionReport<TQuestion, Emotion>) => void,

    // the callback invoked when the user wants to stop the session and discard
    // any answers given.
    onAborted: () => void,

    // used only by tests to provide a report with mockable timestamps and such.
    report?: SessionReport<TQuestion, Emotion>,

    // used only by tests to be able to mock the react-native BackHandler
    backHandler?: typeof BackHandler,
}

type State = {
    sessionState: 'not-started' | 'ongoing' | 'about-to-finish' | 'finished',

    currentQuestion: ?TQuestion,

    // the report passed to the onSessionFinished callback
    report: SessionReport<TQuestion, Emotion>,

    // the object responsible for handling the Android back button
    backHandler: typeof BackHandler,
}

export class SessionScreen extends React.Component<Props, State> {
    backHandlerListener = null;
    timerHandle = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            sessionState: 'not-started',
            currentQuestion: null,
            report: props.report || new SessionReport(),
            backHandler: props.backHandler || BackHandler,
        };
    }

    componentDidMount() {
        // componentDidMount is called after the first render and the user sees the
        // 'not-started' screen. That screen isn't terribly useful so instead we
        // trigger this._showCurrentQuestion() to show the first question.
        this._showCurrentQuestion();

        // add listener for the android back button. It should do the same as
        // the cancel button.
        this.backHandlerListener = this.state.backHandler.addEventListener('hardwareBackPress', this._cancel);
    }

    componentWillUnmount() {
        if (this.backHandlerListener) {
            this.backHandlerListener.remove();
        }

        this._clearTimer();
    }

    // When the last question is answered we don't want to redirect the user to
    // some other screen immediately, instead we wait a bit before calling
    // onSessionFinished. This logic should probably live in the component
    // creating this SessionScreen, but for now it's handled here.
    //
    // To avoid any leaks that could occur if the timer is started but not fired
    // before the component is unmounted this method is used to clean up the
    // references to the timer.
    _clearTimer() {
        if (this.timerHandle) {
            clearTimeout(this.timerHandle);
            this.timerHandle = null;
        }
    }

    // should be called when a new question is ready to be shown to the user.
    // note that this method does not change the current question, the
    // _nextQuestion method does that.
    _showCurrentQuestion() {
        // update the state with the session's current question
        this.setState({
            sessionState: 'ongoing',
            currentQuestion: this.props.session.currentQuestion(),

        }, () => {
            // when the component has been re-rendered from the the setState
            // call above we're sure the question is shown to the user and we
            // can safely call startLookingAtQuestion. The if-statement is here
            // to make flow happy as this.state.currentQuestion can technically
            // be null, but we know from the setState call that it will always
            // be a real question.
            if (this.state.currentQuestion) {
                this.state.report.startLookingAtQuestion(this.state.currentQuestion);
            } else {
                logger.log({
                    msg: 'SessionScreen invalid state; is ongoing but has no question to show',
                    state: this.state,
                });
            }
        });
    }

    // Moves the session forward one question and re-renders the component. If
    // there are no more questions the session is finished.
    _nextQuestion() {
        if (this.props.session.hasNextQuestion()) {
            // move the session forward
            this.props.session.nextQuestion();

            // and show the new question
            this._showCurrentQuestion();
        } else {
            this._finish();
        }
    }

    // Eventually finishes the session. It delays setting the state to finished
    // and calling onSessionFinished to avoid navigating away from the
    // SessionScreen too fast. See the comment on _clearTimer above.
    _finish = () => {

        this.setState({ sessionState: 'about-to-finish' }, () => {

            // delay setting state to finished and calling onSessionFinished
            this.timerHandle = setTimeout(() => {
                this._finishNow();

            }, 500); // set delay to 500ms
        });
    }

    // Finishes the session, calling onSessionFinished with the report.
    _finishNow = () => {
        this.setState({ sessionState: 'finished' });
        this.props.onSessionFinished(this.state.report);
    }

    // Aborts the session, any progress should be forgotten and thrown away
    _abort = () => {
        this.state.report.clear();
        this.setState({ sessionState: 'finished' });
        this.props.onAborted();
    }

    // registers the answer in the report and moves to the next question if
    // applicable. It's an arrow function property because of `this` :(
    _onAnswer = (answer: Emotion) => {
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

    // This method brings up the cancel dialog
    _cancel = () => {
        const message = 'Finish   - stop the session and store your results\n' +
                        'Abort    - stop the session and discard your results\n' +
                        'Continue - stay in the session';
        Alert.alert(
            'Abort session?',
            message,
            [{
                text: 'Finish',
                onPress: this._finishNow,
            }, {
                text: 'Abort',
                onPress: this._abort,
            }, {
                text: 'Continue',
                onPress: () => {}, // nop
            }],
            {
                cancelable: true,
            },
        );
    }

    render() {
        return <View style={styles.container}>
            {this._renderTopBar()}
            {this._renderMainContent()}
        </View>;
    }

    _renderTopBar() {
        const { session } = this.props;

        // set the progress to 100% if about to finish or finished. set it to
        // `current question / total number of questions` otherwise
        const currentQuestionIndex = ['about-to-finish', 'finished'].includes(this.state.sessionState)
            ? session.numberOfQuestions()
            : session.currentQuestionIndex();

        return <View style={styles.topBar}>
                <ImageButton
                    image={assets.mediumCross}
                    style={styles.cancelButton}
                    onPress={this._cancel}
                    testID='cancel-btn'
                />

                <QuestionProgress
                    current={currentQuestionIndex}
                    total={session.numberOfQuestions()} />
            </View>;
    }

    _renderMainContent() {
        const { sessionState, currentQuestion } = this.state;
        switch (sessionState) {
            case 'not-started':
                return <View>
                    <Text>It appears we're in an invalid state. Please retry or
                        report the issue using the buttons below
                    </Text>

                    <Button
                        title='retry'
                        onPress={() => this._showCurrentQuestion() } />

                    <Button
                        title='report'
                        onPress={() => {
                            navigator.openReportFlow({
                                screen: {
                                    name: 'Session',
                                    props: this.props,
                                    state: this.state,
                                },
                                header: 'Empty screen when starting new session',
                            });
                        }} />
                </View>;

            default:
                if (currentQuestion) {
                    return <Question
                             question={currentQuestion}
                             onAnswer={this._onAnswer}
                           />;

                } else {
                    return 'No question available. This is a bug, please report'; // TODO: add report flow
                }
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        margin: constants.space(),
        alignItems: 'center',
    },
    cancelButton: {
        marginEnd: constants.space(),
        width: constants.space(),
        height: constants.space(),
    },
});
