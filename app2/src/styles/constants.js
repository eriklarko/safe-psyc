// @flow

const gridSize: number = 12;
export const constants = {
    defaultFontFamily: 'Lato',

    primaryTextColor: '#666',
    primaryBackgroundColor: '#fdb807',
    primaryHighlightColor: '#1cc7d0',

    positiveColor: '#2dde98',
    negativeColor: '#ff4f81',

    disabledBackgroundColor: '#CCC',

    // used to divide the whole UI into a grid
    gridSize,
    space: function(multiplier: number = 1) {
        return gridSize * multiplier;
    },
}