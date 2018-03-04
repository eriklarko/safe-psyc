// @flow

import moment from 'moment';
import { knuthShuffle } from 'knuth-shuffle';

import { answerService } from '~/src/services/answer-service.js';
import { emotionService } from '~/src/services/emotion-service.js';
import { ReferencePointService } from '~/src/services/reference-point-service.js';
import { generateEyeQuestion, generateIntensityQuestion } from '~/src/utils/question-utils.js';
import { answerBackendFacade } from '~/src/services/answer-backend.js';
import { numberOfQuestionsService } from '~/src/services/number-of-questions-service.js';

import type { Emotion } from '~/src/models/emotion.js';
import type { Question, EyeQuestion, IntensityQuestion } from '~/src/models/questions.js';
import type { AnswerService } from '~/src/services/answer-service.js';
import type { EmotionService } from '~/src/services/emotion-service.js';
import type { AnswerBackendFacade } from '~/src/services/answer-backend.js';
import type { NumberOfQuestionsService } from '~/src/services/number-of-questions-service.js';

type Answer = {
    correct: boolean,
    when: moment$Moment,
};

export const beginningOfTime = moment('2000-01-01 00:00:00'); // close enough ¯\_(ツ)_/¯

export class SpacedRepetitionSessionService {

    _answerBackendFacade: AnswerBackendFacade;
    _answerService: AnswerService;
    _emotionService: EmotionService;
    _referencePointService: ReferencePointService;
    _numQuestionsService: NumberOfQuestionsService;

    constructor(
        answerBackendFacade: AnswerBackendFacade,
        answerSrv: AnswerService,
        emotionSrv: EmotionService,
        numQuestionsService: NumberOfQuestionsService,
    ){

        this._answerBackendFacade = answerBackendFacade;
        this._answerService = answerSrv;

        this._emotionService = emotionSrv;
        this._referencePointService = new ReferencePointService(this.getEmotionPool());

        this._numQuestionsService = numQuestionsService;

        this._answerService.setAnswerPool(this.getEmotionPool());
    }

    getQuestions(): Promise<Array<Question>> {
        // TODO: I need to bring in unanswered questions at some point

        return this._answerBackendFacade.getLastTwoAnswersToAllQuestions()
            .then( allAnswers => enhanceWithDueDates(allAnswers))
            .then( dueDates => sortByDueDate(dueDates))
            .then( dueDates => enhanceWithQuestionNumbers(this._numQuestionsService, dueDates))
            .then( ({ dueDates, nums }) => selectQuestions(dueDates, this.getEmotionPool(), nums))
            .then( questions => questions.map(qi => {
                switch(qi.questionType) {
                    case 'eye-question': return generateEyeQuestion(qi.emotion, this._answerService);
                    case 'intensity':

                        const { question, isValid } =  generateIntensityQuestion(qi.emotion, this._referencePointService);
                        // TODO: Gotta use isValid somewhere, but the questions are selected before all this. If I get isValid: false I have to select another question since this is unrecoverable.

                        return question;
                    default: throw new Error('Unknown question type: ', qi.questionType);
                }
            }))
        //.then( questions => knuthShuffle(questions));
    }

    getEmotionPool(): Array<Emotion> {
        return this._emotionService.getEmotionPool();
    }
}

function enhanceWithDueDates(allAnswers: Map<string, Array<*>>): Array<*> {

    const dueDates = [];
    allAnswers.forEach( answers => {
        if (answers.length < 1) {
            return;
        }

        const emotion = answers[0].emotion;
        const questionType = answers[0].questionType;

        const dueDate = calculateDueDate(answers);
        dueDates.push({ emotion, questionType, dueDate });
    })

    return dueDates;
}

export function calculateDueDate(lastTwoAnswersToOneEmotion: $ReadOnlyArray<Answer>): moment$Moment {
    const hasNotBeenAnswered = lastTwoAnswersToOneEmotion.length === 0;
    if (hasNotBeenAnswered) {
        return beginningOfTime;
    }

    const answersCopy = [...lastTwoAnswersToOneEmotion];
    const answersSortedByTimeDesc = answersCopy.sort((a, b) => {
        // $FlowFixMe
        return b.when - a.when;
    });

    const lastAnswerWasIncorrect = !answersSortedByTimeDesc[0].correct;
    if (lastAnswerWasIncorrect) {
        return beginningOfTime;
    }

    // Coming here also means that the only answer was correct
    const hasBeenAnsweredExactlyOnce = lastTwoAnswersToOneEmotion.length === 1;
    if (hasBeenAnsweredExactlyOnce) {
        return moment(beginningOfTime).add(1, 'days');
    }

    const lastCorrectAnswerDate = answersSortedByTimeDesc[0].when;
    const secondLastCorrectAnswerDate = answersSortedByTimeDesc[1].when;

    // $FlowFixMe
    const lastIntervalMs = lastCorrectAnswerDate - secondLastCorrectAnswerDate;
    const msToAdd = lastIntervalMs * 1.2;

    return moment(lastCorrectAnswerDate).add(msToAdd, 'milliseconds');
}

function sortByDueDate(dueDates) {
    return dueDates.sort((a,b) => a.dueDate - b.dueDate);
}

function enhanceWithQuestionNumbers(numQuestionsService, dueDates) {
    return numQuestionsService.getNumberOfQuestionsPerType()
        .then( nums => ({ dueDates, nums }) )
}

function selectQuestions(dueDates, emotionPool, nums): Array<{ emotion: Emotion, questionType: string }> {

    const newQuestionCutoff = moment().add(8, 'days'); // This is incredibly arbitrary :)

    console.log("selecting with dueDates: ",dueDates.map(qi => qi.emotion.name + ": " + qi.dueDate.format()));

    dueDates = dueDates.filter(qi => qi.dueDate.isBefore(newQuestionCutoff));

    console.log("after cutoff ", dueDates.map(qi => qi.emotion.name + ": " + qi.dueDate.format()));

    // find a due date for unanswered questions and remove all items in dueDates with a date
    const eyeQuestions = dueDates
        .filter(qi => qi.questionType === 'eye-question')
        .slice(0, nums.eye);
    const intensityQuestions = dueDates
        .filter(qi => qi.questionType === 'intensity')
        .slice(0, nums.intensity);

    const eyesLeft = nums.eye - eyeQuestions.length;
    const intensityLeft = nums.intensity - intensityQuestions.length;

    console.log(eyesLeft, ' eyes left');
    console.log(intensityLeft, ' intensity left');

    const newEyes = getRandomElementsFromArray(
            eyesLeft,
            emotionPool,
            eyeQuestions.map(qi => qi.emotion),
        )
        .map(e => ({ emotion: e, questionType: 'eye-question' }));

    const newIntensity = getRandomElementsFromArray(
            intensityLeft,
            emotionPool,
            intensityQuestions.map(qi => qi.emotion),
        )
        .map(e => ({ emotion: e, questionType: 'intensity' }));

    return eyeQuestions
        .concat(newEyes)
        .concat(intensityQuestions)
        .concat(newIntensity);
}

function getRandomElementsFromArray(numElements: number, array: Array<Emotion>, not: Array<Emotion>): Array<Emotion> {
    const poolCopy = array.slice();
    const notNames = not.map(e => e.name);

    const elements = [];
    for (let i = 0; i < numElements && poolCopy.length > 0; i++) {
        const rnd = Math.floor(Math.random() * poolCopy.length);
        const element = poolCopy[rnd];

        if (!notNames.includes(element.name)) {
            elements.push(element);
        }

        poolCopy.splice(rnd, 1);
    }

    return elements;
}

export const spacedRepetitionSessionService = new SpacedRepetitionSessionService(
    answerBackendFacade,
    answerService,
    emotionService,
    numberOfQuestionsService,
);
