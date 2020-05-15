// @flow

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Button } from 'react-native';
import { LoadingAnimation } from './loading-animation.js';

export function AnimationTest(props: {}) {
    const [show, setShow] = useState(true);

    if (show) {
        return <View>
            <Button title='unmount' onPress={ () => setShow(false)} />

            <View style={{ margin: 100, borderWidth: 1, borderColor:'black' }}>
                <LoadingAnimation  />
            </View>
        </View>;

    } else {
        return <View>
            <Button title='mount' onPress={ () => setShow(true)} />
        </View>;
    }
}

function FadeInText(props) {
    const [fadeAnim] = useState(new Animated.Value(0));  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim,         // Bind opacity to animated value
            }}
        >
            <Text>HELLO</Text>
        </Animated.View>
    );
}
