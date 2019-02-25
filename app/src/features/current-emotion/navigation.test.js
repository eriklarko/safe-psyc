// @flow

import moment from 'moment';

import { navigateToCurrentFeelingOrHome } from './navigation.js';

import type { CurrentEmotionBackendFacade } from '~/src/features/current-emotion/current-emotion-backend.js';
import type { AccountStorage } from '~/src/features/settings/account-storage.js';

import { mockNavigation } from '~/tests/mocks/navigation-mock.js';


describe('navigateToCurrentFeelingOrHome', () => {
    it('should redirect to howrufeelin once per day', () => {
        // $FlowFixMe
        Date.now = jest.fn(() => new Date(Date.UTC(2017, 0, 1)).valueOf());

        const backendFacade = emotionBackendWithAnswerAt(
            moment().subtract(10, 'hours'),
            moment(),
        );
        const accountStorage = accountStorageWithWantToBeAsked(true);

        const navigation = mockNavigation();
        const { dispatch } = navigation;

        return navigateToCurrentFeelingOrHome(backendFacade, accountStorage)
            .then(() => {
                expect(dispatch).toHaveBeenCalledTimes(1);

                const action = dispatch.mock.calls[0][0];

                expect(action.index).toEqual(1);
                expect(action.actions.map(a => a.routeName)).toEqual(['Home', 'CurrentFeeling']);
            })
            .then(() => {
                dispatch.mockReset();
                return navigateToCurrentFeelingOrHome(backendFacade, accountStorage);
            })
            .then(() => {
                expect(dispatch).toHaveBeenCalledTimes(1);
                expect(dispatch.mock.calls[0][0].actions.map(a => a.routeName)).not.toContain(
                    'CurrentFeeling'
                );
            });
    });

    it('should navigate to the howrufeeling with the skippable param', () => {
        const backendFacade = emotionBackendWithAnswerAt(moment().subtract(10, 'hours'));
        const accountStorage = accountStorageWithWantToBeAsked(true);

        const navigation = mockNavigation();
        const { dispatch } = navigation;

        return navigateToCurrentFeelingOrHome(backendFacade, accountStorage).then(() => {
            expect(dispatch).toHaveBeenCalled();
            const params = dispatch.mock.calls[0][0].actions
                .filter(a => a.routeName === 'CurrentFeeling')
                .map(a => a.params)[0];

            expect(params).toEqual(expect.objectContaining({ skippable: true }));
        });
    });

    it('should not navigate to the howrufeelin if the user does not want to be asked', () => {
        const backendFacade = emotionBackendWithAnswerAt(moment().subtract(10, 'hours'));
        const accountStorage = accountStorageWithWantToBeAsked(false);

        const navigation = mockNavigation();
        return navigateToCurrentFeelingOrHome(backendFacade, accountStorage).then(() => {
            expect(navigation).toHaveResetTo("Home");
        });
    });

    function emotionBackendWithAnswerAt(...whens): CurrentEmotionBackendFacade {
        const fn = jest.fn();
        for (const when of whens) {
            fn.mockReturnValueOnce(
                new Promise(r => {
                    r({
                        when: when,
                    });
                })
            );
        }

        return (({
            getLastEmotionAnswer: fn,
        }: any): CurrentEmotionBackendFacade);
    }

    function accountStorageWithWantToBeAsked(wantsToBeAsked): AccountStorage {
        return (({
            getValue: jest.fn().mockResolvedValue(wantsToBeAsked),
        }: any): AccountStorage);
    }
});
