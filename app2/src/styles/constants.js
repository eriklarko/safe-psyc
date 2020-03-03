// @flow

import { StyleSheet } from 'react-native';

const gridSize: number = 12;
export const constants = {
    defaultFontFamily: 'Lato',

    primaryTextColor: '#666666',

    primaryForegroundColor: '#FAFAFF',
    primaryBackgroundColor: '#fdb807',

    primaryHighlightColor: '#1cc7d0',

    disabledForegroundColor: '#FAFAFF',
    disabledBackgroundColor: '#CCC',

    positiveColor: '#2dde98',
    negativeColor: '#ff4f81',

    // used to divide the whole UI into a grid
    gridSize,
    space: function(multiplier: number = 1) {
        return gridSize * multiplier;
    },

    styles: StyleSheet.create({
        flex1: {
            flex: 1,
        },
    }),
};
