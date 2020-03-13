// @flow

import { StyleSheet } from 'react-native';

const gridSize: number = 12;
export const constants = {
    // used to divide the whole UI into a grid
    gridSize,
    space: function(multiplier: number = 1) {
        return gridSize * multiplier;
    },

    defaultFontFamily: 'Lato',

    colorGroup: {
        primary: {
            background: '#FAFAFF',
            foreground: '#666',
            highlight: '#1cc7d0',

            disabled: {
                background: '#CCC',
                foreground: '#FAFAFF',
            },
        },
        positive: {
            background: '#2dde98',
            foreground: '#FAFAFF',
        },
        negative: {
            background: '#ff4f81',
            foreground: '#FAFAFF',
        },
    },

    styles: StyleSheet.create({
        flex1: {
            flex: 1,
        },
    }),
};
