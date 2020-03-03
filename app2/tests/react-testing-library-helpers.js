// @flow

import type { RenderResult } from '@testing-library/react-native';

export function getAllRenderedStrings(component: RenderResult): Array<string> {
    return component.queryAllByText(/.*/)
            .flatMap(t => t.props.children)
            .filter(t => typeof t === 'string');
}