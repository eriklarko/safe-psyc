// @flow

export function getAllRenderedStrings(component: *): Array<string> {
    return component.queryAllByText(/.*/)
            .flatMap(t => t.props.children)
            .filter(t => typeof t === 'string');
}
