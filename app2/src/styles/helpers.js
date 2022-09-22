// @flow

export function combineStyles(base: *,...overrides: Array<*>): * {
    // store all valid overrides
    const styles = overrides.filter(o => o !== null && o !== undefined);
    if (styles.length === 0) {
        return base;
    }

    // add `base` to the beginning of the `styles` array
    styles.unshift(base);
    return styles;
}
