// @flow
//
// This is the component navigated to when starting a session.
// Not sure yet if this component will fetch the questions in the session or if
// those will passed in as props. We'll see. For now it's all stubbed out just
// so that I can test it on a device.

import * as React from 'react';
import { Session } from './models/session.js';
import { SessionScreen } from './SessionScreen.js';

export function SessionRoot(props: {}) {
    const session = new Session(new Set([{
        type: 'description',
        text: 'which emotion is Pharrell Williams singing about?',
        correctAnswer: {
            name: 'happiness',
        },
        incorrectAnswers: [{
            name: 'anger',
        }, {
            name: 'joy',
        }],
    }]));
    const onSessionFinished = (report) => {
        console.log('SESSION FINISHED!', report);
    };
    const onAborted = () => {
        console.log('Session aborted');
    };

    return <SessionScreen
        session={session}
        onSessionFinished={onSessionFinished}
        onAborted={onAborted}
    />;
}
