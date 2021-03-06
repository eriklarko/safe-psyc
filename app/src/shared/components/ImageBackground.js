// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground as ImgBg } from 'react-native';
import { constants } from '~/src/styles/constants.js';
import { stripes } from '~/src/utils/images.js';

const bgImageStyle = {
    width: '100%',
    height: '100%',
};
const contentStyle = {
    height: '100%',
    backgroundColor: 'rgba(253,184,7, 0.4)',
    flex: 1,
};

type Props = {
    image?: any,
    children: any,
};
export class ImageBackground extends React.Component<Props, {}> {

    getChildContext() {
        return {
            textStyle: {
                color: constants.darkTextColor,
                ...constants.textShadow,
            },
        };
    }

    render() {
        const { children, image } = this.props;

        // $FlowFixMe
        const img = image || stripes;

        return (
            <ImgBg source={img} resizeMode="cover" style={bgImageStyle}>
                <View style={contentStyle}>{children}</View>
            </ImgBg>
        );
    }
}

ImageBackground.childContextTypes = {
    textStyle: PropTypes.object,
};
