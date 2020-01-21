// @flow

import type { RenderResult } from '@testing-library/react-native';

export function getAllRenderedStrings(component: RenderResult): Array<string> {
    return component.queryAllByText(/.*/)
            .map(t => t.props.children);
}