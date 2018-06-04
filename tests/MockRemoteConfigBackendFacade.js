// @flow

import type { RemoteConfigBackendFacade } from '~/src/services/remote-config-backend.js';
import type { RemoteConfig } from '~/src/services/number-of-questions-service.js';


const defaultConfig: RemoteConfig =  {
    numberOfQuestionsPerSession: 10,

    eyeQuestionsFactor: 8,
    intensityQuestionsFactor: 1,
    wordQuestionsFactor: 1,
};
export function newRemoteConfigBackendMock(config?: $Shape<RemoteConfig>) {
    const concreteConfig = Object.assign({}, defaultConfig, config);

    const configMock: RemoteConfigBackendFacade = ({
        getEyeQuestionsFactor: () => Promise.resolve(concreteConfig.eyeQuestionsFactor),
        getIntensityQuestionsFactor: () => Promise.resolve(concreteConfig.intensityQuestionsFactor),
        getWordQuestionsFactor: () => Promise.resolve(concreteConfig.wordQuestionsFactor),

        getNumberOfQuestionsPerSession: () => Promise.resolve(concreteConfig.numberOfQuestionsPerSession),
    }: any);

    return configMock;
}
