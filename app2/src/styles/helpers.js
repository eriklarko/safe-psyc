// @flow

export function combineStyles(base: *,...overrides: Array<*>): * {
    overrides = overrides.filter(o => o !== null && o !== undefined);
    if (overrides.length === 0) {
        return base;
    }

    overrides.unshift(base);
    return overrides;
}