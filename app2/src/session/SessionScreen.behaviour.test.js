// @flow

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import moment from 'moment';
import { SessionScreen } from './SessionScreen.js';
import { Session } from './session.js';
import { SessionReport } from './session-report.js';
import { MockedTimeGiver } from './session-report-test-helpers.js';

import type { TQuestion } from './SessionScreen.js';

it('calls onSessionFinished with the correct report when all questions are finished', () => {
    const session = new Session(new Set([{
        type: 'description',
        text: 'what is the meaning of life?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    }]));
    const report = new SessionReport();
    const onSessionFinished = jest.fn();

    // render the component
    const component = testingLib.render(<SessionScreen
        session={session}
        onSessionFinished={onSessionFinished}
        report={report}
    />);

    // answer the only question in the session
    clickCorrectAnswer(component, session);

    // and make sure onSessionFinished is called correctly
    expect(onSessionFinished).toHaveBeenCalledTimes(1);
    expect(onSessionFinished).toHaveBeenCalledWith(report);
});

it('moves to the next question on a correct answer', () => {
    const q1 = {
        type: 'description',
        text: 'what is the meaning of life?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    };
    const q2 = {
        type: 'description',
        text: 'what is 41+1?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    };

    const session = new Session<TQuestion>(new Set([q1, q2]));
    const component = testingLib.render(<SessionScreen
        session={session}
        onSessionFinished={jest.fn()}
    />);

    clickCorrectAnswer(component, session);
    expect(session.currentQuestion()).toBe(q2);
});

it('moves to the next question if there are three incorrect answers', () => {
    const q1 = {
        type: 'description',
        text: 'what is the meaning of life?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    };
    const q2 = {
        type: 'description',
        text: 'what is 41+1?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    };

    const session = new Session<TQuestion>(new Set([q1, q2]));
    const component = testingLib.render(<SessionScreen
        session={session}
        onSessionFinished={jest.fn()}
    />);

    // first attempt
    clickIncorrectAnswer(component, session);
    expect(session.currentQuestion()).toBe(q1); // should still be on q1

    // second attempt
    clickIncorrectAnswer(component, session);
    expect(session.currentQuestion()).toBe(q1); // should still be on q1

    // third attempt
    clickIncorrectAnswer(component, session);
    // after having answered wrong three times we should have moved on to q2
    expect(session.currentQuestion()).toBe(q2);
});

it('generates a correct report', () => {
    const q1 = {
        type: 'description',
        text: 'what is the meaning of life?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    };
    const q2 = {
        type: 'description',
        text: 'what is 41+1?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    };
    const q3 = {
        type: 'description',
        text: 'what is 41 + (sin2v+cos2v)?',
        incorrectAnswers: ['43', '44'],
        correctAnswer: '42',
    };

    const session = new Session<TQuestion>(new Set([q1, q2, q3]));

    // set up the report we'll assert on later in the test.
    const timer = new MockedTimeGiver();
    const report = new SessionReport(timer.getNextTime);
    timer.setNextTime(moment('2020-01-01 00:00:00'));
    timer.autoAdvanceBy(5, 'minutes');

    const component = testingLib.render(<SessionScreen
        session={session}
        onSessionFinished={jest.fn()}
        report={report}
    />);

    // answer q1
    clickAnswer(component, '44'); // incorrect
    clickAnswer(component, '44'); // incorrect
    clickAnswer(component, '44'); // incorrect

    // answer q2
    clickAnswer(component, '44'); // incorrect
    clickAnswer(component, '42'); // correct

    // answer q3
    clickAnswer(component, '42'); // correct

    // reset the timer so that calls to getNextTime() returns the same sequence
    // of times as when clicking the answers.
    timer.setNextTime(moment('2020-01-01 00:00:00'));

    // check that we have three incorrect answers on q1
    expect(report.getResult(q1)).toEqual({
        startTime: timer.getNextTime(),
        answers: [{
            answer: '44',
            isCorrect: false,
            time: timer.getNextTime(),
        },{
            answer: '44',
            isCorrect: false,
            time: timer.getNextTime(),
        },{
            answer: '44',
            isCorrect: false,
            time: timer.getNextTime(),
        }],
    });

    // check that we have one incorrect and one correct answer on q2
    expect(report.getResult(q2)).toEqual({
        startTime: timer.getNextTime(),
        answers: [{
            answer: '44',
            isCorrect: false,
            time: timer.getNextTime(),
        },{
            isCorrect: true,
            time: timer.getNextTime(),
        }],
    });

    // check that we have only one correct answer on q3
    expect(report.getResult(q3)).toEqual({
        startTime: timer.getNextTime(),
        answers: [{
            isCorrect: true,
            time: timer.getNextTime(),
        }],
    });
});

function clickAnswer(sessionComponent: testingLib.RenderResult, answer: string) {
    const ans = sessionComponent.getByTestId('answer-' + answer);
    testingLib.fireEvent.press(ans);
}

function clickCorrectAnswer(sessionComponent: testingLib.RenderResult, session: Session<TQuestion>) {
    clickAnswer(sessionComponent, session.currentQuestion().correctAnswer);
}

function clickIncorrectAnswer(sessionComponent: testingLib.RenderResult, session: Session<TQuestion>) {
    const q = session.currentQuestion();

    // find a truly incorrect answer
    let incorrectAns = null;
    for (const a of q.incorrectAnswers) {
        if (a !== q.correctAnswer) {
            incorrectAns = a;
        }
    }
    if (incorrectAns == null) {
        throw new Error(`current question had no incorrect answers (correct: ${q.correctAnswer}; incorrect: ${q.incorrectAnswers.join(', ')}`);
    }

    // click the incorrect answer
    clickAnswer(sessionComponent, incorrectAns);
}