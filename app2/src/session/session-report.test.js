// @flow

import { SessionReport } from './session-report.js';
import { MockedTimeGiver } from './session-report-test-helpers.js';
import moment from 'moment';

const arbitraryTime = moment('2000-01-01 00:00:00');

it('registers incorrect answers', () => {
    // start a report using the same arbitrary time for all time records.
    const report = new SessionReport(() => arbitraryTime);

    // define the question being asked
    const question = 'what is the meaning of life?';

    // the report requires a call to startLookingAtQuestion before answers are recorded
    report.startLookingAtQuestion(question);

    // answer wrong twice
    report.registerIncorrectAnswer(question, '41');
    report.registerIncorrectAnswer(question, '43');

    // and finally check that both incorrect answers are stored in the report
    const actual = report.getResult(question);
    expect(actual).toEqual({
        startTime: arbitraryTime,
        answers: [{
            answer: '41',
            isCorrect: false,
            time: arbitraryTime,
        },{
            answer: '43',
            isCorrect: false,
             time: arbitraryTime,
        }],
    });
});

it('returns the question report when asked to record an incorrect answer', () => {
    // start a report using the same arbitrary time for all time records.
    const report = new SessionReport(() => arbitraryTime);

    // define the question being asked
    const question = 'what is the meaning of life?';

    // the report requires a call to startLookingAtQuestion before answers are recorded
    report.startLookingAtQuestion(question);

    // answer wrong and check the report
    const firstReport = report.registerIncorrectAnswer(question, '41');
    expect(firstReport).toEqual({
        startTime: arbitraryTime,
        answers: [{
            answer: '41',
            isCorrect: false,
            time: arbitraryTime,
        }],
    });

    // answer wrong and check the report again
    const secondReport = report.registerIncorrectAnswer(question, '43');
    expect(secondReport).toEqual({
        startTime: arbitraryTime,
        answers: [{
            answer: '41',
            isCorrect: false,
            time: arbitraryTime,
        },{
            answer: '43',
            isCorrect: false,
             time: arbitraryTime,
        }],
    });
});

it('registers correct answers', () => {
    // start a report using the same arbitrary time for all time records.
    const report = new SessionReport(() => arbitraryTime);

    // define the question being asked
    const question = 'what is the meaning of life?';

    // the report requires a call to startLookingAtQuestion before answers are recorded
    report.startLookingAtQuestion(question);

    // answer correctly
    report.registerCorrectAnswer(question);

    // and finally check that both incorrect answers are stored in the report
    const actual = report.getResult(question);
    expect(actual).toEqual({
        startTime: arbitraryTime,
        answers: [{
            isCorrect: true,
            time: arbitraryTime,
        }],
    });
});

it('keeps time', () => {
    const startTime           = moment('2000-01-01 00:00:00');
    const incorrectAnswerTime = moment('2000-01-01 00:01:00');
    const correctAnswerTime   = moment('2000-01-01 00:02:00');

    const timer = new MockedTimeGiver();
    const report = new SessionReport(timer.getNextTime);

    // define the question being asked
    const question = 'what is the meaning of life?';

    // the report requires a call to startLookingAtQuestion before answers are recorded
    timer.setNextTime(startTime);
    report.startLookingAtQuestion(question);

    // answer incorrectly
    timer.setNextTime(incorrectAnswerTime);
    report.registerIncorrectAnswer(question, '41');

    // answer correctly
    timer.setNextTime(correctAnswerTime);
    report.registerCorrectAnswer(question);

    // and finally check that both incorrect answers are stored in the report
    const actual = report.getResult(question);
    expect(actual).toEqual({
        startTime: startTime,
        answers: [{
            answer: '41',
            isCorrect: false,
            time: incorrectAnswerTime,
        },{
            isCorrect: true,
            time: correctAnswerTime,
        }],
    });
});

it('throws an exception if startLookingAtQuestion is called more than once with the same question', () => {
    const report = new SessionReport();
    const question1 = 'is this the first question?';
    const question2 = 'is this the second question?';

    // make sure the two questions aren't the same
    expect(question1).not.toEqual(question2);

    // the first time we start looking at question1 should not throw
    expect(() => report.startLookingAtQuestion(question1)).not.toThrow();

    // the second time it should throw
    try {
        report.startLookingAtQuestion(question1);
        // $FlowFixMe: fail isn't defined in the jest types but is availble in the API
        fail('expected exception but none was thrown');
    } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual(expect.stringContaining('more than once'));
        expect(e.message).toEqual(expect.stringContaining(question1));
    }

    // test that new questions don't throw just because a previous one did
    expect(() => report.startLookingAtQuestion(question2)).not.toThrow();
});

it('throws exception if answer is recorded before startLookingAtQuestion is called', () => {
    const report = new SessionReport();
    const correctlyAnsweredQuestion = 'got right on the first try?';
    const incorrectlyAnsweredQuestion = 'first answer incorrect?';

    expect(() => report.registerCorrectAnswer(correctlyAnsweredQuestion)).toThrow(/correctanswer.*before startLookingAtQuestion/i);
    expect(() => report.registerIncorrectAnswer(incorrectlyAnsweredQuestion, 'foo')).toThrow(/incorrectanswer.*before startLookingAtQuestion/i);
});