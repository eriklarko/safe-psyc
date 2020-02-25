// @flow
//
// Tests things that relates to how the SessionScreen interacts with the
// session report

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import moment from 'moment';
import { SessionScreen } from './SessionScreen.js';
import { Session, SessionReport } from './models';
import { props, MockTimeGiver, clickAnswer } from './test-helpers';
import type { TQuestion } from './SessionScreen.js';

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
    const timer = new MockTimeGiver();
    const report = new SessionReport(timer.getNextTime);
    timer.setNextTime(moment('2020-01-01 00:00:00'));
    timer.autoAdvanceBy(5, 'minutes');

    const component = testingLib.render(<SessionScreen
        {...props({
            session: session,
            report: report,
        })}
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
