// @flow

import { Alert } from 'react-native';
import moment from 'moment';

import { accountStorage } from '~/src/features/settings/account-storage.js';
import { SettingsKeys } from '~/src/features/settings/settings.js';

import { log } from '~/src/services/logger.js';
import { setNavigationStack, resetTo } from '~/src/navigation-actions.js';
import { routes } from '~/src/routes.js';

import type { AccountStorage } from '~/src/features/settings/account-storage.js';
import type { CurrentEmotionBackendFacade } from '~/src/features/current-emotion/current-emotion-backend.js';


export function navigateToCurrentFeelingOrHome(
    emotionBackend: CurrentEmotionBackendFacade,
    settingsBackend: AccountStorage,

): Promise<*> {
    return emotionBackend
        .getLastEmotionAnswer()
        .then(answer => {
            if (answer) {
                const eightHoursAgo = moment().subtract(8, 'hours');
                const haveAlreadyAnswered = eightHoursAgo.isBefore(answer.when);

                return haveAlreadyAnswered;
            } else {
                return false;
            }
        })
        .then(haveAlreadyAnswered => {
            return settingsBackend.getValue(SettingsKeys.ASK_CURR_EM_Q)
                .then (wantsToBeAsked => {
                    return {
                        haveAlreadyAnswered,
                        wantsToBeAsked,
                    };
                });
        })
        .then(context => {
            const { haveAlreadyAnswered, wantsToBeAsked } = context;
            const shouldAskHowTheUserIsFeeling = !haveAlreadyAnswered && wantsToBeAsked;

            if (shouldAskHowTheUserIsFeeling) {
                setNavigationStack([
                    { route: routes.Home },
                    {
                        route: routes.CurrentFeeling,
                        params: {
                            skippable: true,
                        },
                    },
                ]);
            } else {
                resetTo(routes.Home);
            }
        })
        .catch(e => {
            log.error('Unable to navigate onSessionFinished', e);
            Alert.alert('ERROR', 'Unable to navigate onSessionFinished.\n' + e);
        });
}

