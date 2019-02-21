// @flow

import { PitchScreen } from './PitchScreen.js';
import { StandardButton } from '~/src/shared/components';
import { render } from '~/tests/cool-test-lib/render-utils.js';
import { mockNavigation } from '~/tests/mocks/navigation-mock.js';
import { getChildrenAndParent } from '~/tests/cool-test-lib/component-tree-utils.js';

const defaultProps = {
    navigation: mockNavigation(),
};

it('contains a skip button that navigates to the login screen', () => {
    const navigation = mockNavigation();
    const component = render(PitchScreen, { navigation: navigation }, defaultProps);

    clickSkipButton(component);

    expect(navigation).toHaveResetTo('Login');
});

function clickSkipButton(component) {
    const skipButton = getChildrenAndParent(component).filter(
        b => b.props && b.props.testID === 'skipButton'
    )[0];
    expect(skipButton).toBeDefined();

    skipButton.props.onPress();
}

it('persists the fact that the pitch was skipped', () => {
    const storageMock = {
        setValue: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const navigation = setupMockStorage(storageMock);
    const component = render(PitchScreen, { navigation: navigation }, defaultProps);

    clickSkipButton(component);

    expect(storageMock.setValue).toHaveBeenCalledWith('hasSeenThePitch', 'true');
});

it('redirects even if the storing fails', () => {
    const storageMock = {
        setValue: jest.fn().mockReturnValue(Promise.reject(new Error('foo'))),
    };

    const navigation = setupMockStorage(storageMock);
    const component = render(PitchScreen, { navigation: navigation }, defaultProps);

    clickSkipButton(component);

    expect(navigation.dispatch).toHaveBeenCalled();
});

function setupMockStorage(mock) {
    return Object.assign({}, mockNavigation(), {
        state: {
            params: {
                storage: mock,
            },
        },
    });
}
