// @flow

import * as testingLib from '@testing-library/react-native';
import type { Session, TQuestion } from '../models';
import type { Emotion } from '../../shared/models';

export function clickAnswer(sessionComponent: *, answer: Emotion) {
    const ans = sessionComponent.getByTestId('answer-' + answer.name);
    testingLib.fireEvent.press(ans);
}

export function clickCorrectAnswer(sessionComponent: *, session: Session<TQuestion>) {
    clickAnswer(sessionComponent, session.currentQuestion().correctAnswer);
}

export function clickIncorrectAnswer(sessionComponent: *, session: Session<TQuestion>) {
    const q = session.currentQuestion();

    // find a truly incorrect answer
    let incorrectAns = null;
    for (const a of q.incorrectAnswers) {
        if (a !== q.correctAnswer) {
            incorrectAns = a;
        }
    }
    if (incorrectAns == null) {
        const correct = q.correctAnswer.name;
        const incorrect = q.incorrectAnswers.map(e => e.name).join(', ');
        throw new Error(`current question had no incorrect answers (correct: ${correct}; incorrect: ${incorrect}`);
    }

    // click the incorrect answer
    clickAnswer(sessionComponent, incorrectAns);
}
