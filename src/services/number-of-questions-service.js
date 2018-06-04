// @flow

import { remoteConfigBackendFacade } from '~/src/services/remote-config-backend.js';

import type { RemoteConfigBackendFacade } from '~/src/services/remote-config-backend.js';

type QuestionNumbers = {|
    eye: number,
    intensity: number,
    word: number,
|};

export type RemoteConfig = {
    eyeQuestionsFactor: number,
    intensityQuestionsFactor: number,
    wordQuestionsFactor: number,

    numberOfQuestionsPerSession: number,
};
export class NumberOfQuestionsService {

    _configBackendFacade: RemoteConfigBackendFacade

    constructor(configBackendFacade: RemoteConfigBackendFacade) {
        this._configBackendFacade = configBackendFacade;
    }

    getNumberOfQuestionsPerType(): Promise<QuestionNumbers> {
        return this._getConfig()
        .then( config => {

            const { numberOfQuestionsPerSession } = config;

            const percentages = factorsToPercentages(config);
            const numbers = percentagesToNumbers(percentages, numberOfQuestionsPerSession);
            const numbersSum = Object.keys(numbers).reduce( (a,b) => a + numbers[b], 0);

            if (numbersSum < numberOfQuestionsPerSession) {
                const maxKey = getKeyWithHighestValue(percentages);

                // $FlowFixMe: maxKey is obv a key in percentages and thus in numbers too
                numbers[maxKey] += numberOfQuestionsPerSession - numbersSum;
            }

            return numbers;
        });
    }

    _getConfig(): Promise<RemoteConfig> {
        return Promise.all([
            this._configBackendFacade.getEyeQuestionsFactor(),
            this._configBackendFacade.getIntensityQuestionsFactor(),
            this._configBackendFacade.getWordQuestionsFactor(),

            this._configBackendFacade.getNumberOfQuestionsPerSession(),
        ]).then( configs => {

            const eyeQuestionsFactor = configs[0];
            const intensityQuestionsFactor = configs[1];
            const wordQuestionsFactor = configs[2];
            const numberOfQuestionsPerSession = configs[3];

            return {
                eyeQuestionsFactor,
                intensityQuestionsFactor,
                wordQuestionsFactor,
                numberOfQuestionsPerSession,
            };
        });
    }
}

function factorsToPercentages(factors: RemoteConfig): QuestionNumbers {
    const {
        eyeQuestionsFactor,
        intensityQuestionsFactor,
        wordQuestionsFactor,
    } = factors;

    const totalFactors = eyeQuestionsFactor + intensityQuestionsFactor + wordQuestionsFactor;
    return {
        eye: eyeQuestionsFactor / totalFactors,
        intensity: intensityQuestionsFactor / totalFactors,
        word: wordQuestionsFactor / totalFactors,
    };
}

function percentagesToNumbers(percentages: QuestionNumbers, numberOfQuestions: number): QuestionNumbers {
    const numbers = {};
    for (const key in percentages) {
        const percentage = percentages[key];

        numbers[key] = Math.floor(numberOfQuestions * percentage);
    }
    // $FlowFixMe: the numbers object clearly has the same keys as the percentages object, but flow doesn't see this
    return numbers;
}

function getKeyWithHighestValue(obj) {
    let highestValue = Number.MIN_VALUE;
    let highestKey = "";

    for (const key in obj) {
        const value = obj[key];
        if (value > highestValue) {
            highestValue = value;
            highestKey = key;
        }
    }

    return highestKey;
}

export const numberOfQuestionsService = new NumberOfQuestionsService(remoteConfigBackendFacade);
