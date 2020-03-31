// @flow
//
// Tests things that relates to how the SessionScreen interacts with the
// session report

import * as React from 'react';
import * as testingLib from '@testing-library/react-native';
import moment from 'moment';
import { SessionScreen } from './SessionScreen.js';
import { Session, SessionReport } from './models';
import { props, MockTimeGiver, newArbitraryQuestion, clickAnswer } from './test-helpers';
import type { TQuestion } from './models';

it('generates a correct report', () => {
    // ---- ASSEMBLE
    const q1 = newArbitraryQuestion();
    const q2 = newArbitraryQuestion();
    const q3 = newArbitraryQuestion();
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
    // ---- DONE WITH ASSEMBLY


    // ---- ACT ----
    // answer q1, all wrong
    clickAnswer(component, q1.incorrectAnswers[0]);
    clickAnswer(component, q1.incorrectAnswers[0]);
    clickAnswer(component, q1.incorrectAnswers[0]);

    // answer q2, first wrong - then correct
    clickAnswer(component, q2.incorrectAnswers[0]);
    clickAnswer(component, q2.correctAnswer);

    // answer q3 correctly on the first try
    clickAnswer(component, q3.correctAnswer);
    // ---- DONE WITH ACT ----


    // ---- ASSERT ----

    // reset the timer so that calls to getNextTime() returns the same sequence
    // of times as when clicking the answers. This makes building the expected
    // objects much easier.
    timer.setNextTime(moment('2020-01-01 00:00:00'));

    // check that we have three incorrect answers on q1
    expect(report.getResult(q1)).toEqual({
        startTime: timer.getNextTime(),
        answers: [{
            answer: q1.incorrectAnswers[0],
            isCorrect: false,
            time: timer.getNextTime(),
        },{
            answer: q1.incorrectAnswers[0],
            isCorrect: false,
            time: timer.getNextTime(),
        },{
           answer: q1.incorrectAnswers[0],
            isCorrect: false,
            time: timer.getNextTime(),
        }],
    });

    // check that we have one incorrect and one correct answer on q2
    expect(report.getResult(q2)).toEqual({
        startTime: timer.getNextTime(),
        answers: [{
            answer: q2.incorrectAnswers[0],
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
