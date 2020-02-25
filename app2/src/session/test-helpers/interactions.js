// @flow

import * as testingLib from '@testing-library/react-native';
import type { Session, TQuestion } from '../models';

export function clickAnswer(sessionComponent: testingLib.RenderResult, answer: string) {
    const ans = sessionComponent.getByTestId('answer-' + answer);
    testingLib.fireEvent.press(ans);
}

export function clickCorrectAnswer(sessionComponent: testingLib.RenderResult, session: Session<TQuestion>) {
    clickAnswer(sessionComponent, session.currentQuestion().correctAnswer);
}

export function clickIncorrectAnswer(sessionComponent: testingLib.RenderResult, session: Session<TQuestion>) {
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
