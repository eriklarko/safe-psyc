// @flow

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

/**
 *  Rotates an image in random ways making it look like a loading spinner.
 *
 *  It works by chaining a random sequence of animations together;
 *      the value returned by getRandomAnimationSequence is the degrees to rotate the image
 *      the animation is the sequence of things that change the value making the image rotate
 */
export function LoadingAnimation(props: {}) {
    const { value, animation } = getRandomAnimationSequence();

    const [rotationValue] = useState(value);
    React.useEffect(() => animation.start(
        f => console.log('anim done, finished:', f)
    ), [animation]);

    const rotationStyle = {
        transform: [{
            rotate: rotationValue.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
        }],
    };

    return <Animated.View style={[styles.outerCircle, rotationStyle]}>
        <View style={styles.eye} />
    </Animated.View>;
}

function getRandomAnimationSequence() {
    // always start with a spin
    const seq = [spinAnimation()];

    // then add ten random ones
    for (let i = 0; i < 0; i++) {
        //if (Math.random() < 0.7) {
            //seq.push(spinAnimation());
        //} else {
            seq.push(springAnimation());
        //}
    }

    return {
        // combine the animation values into one by adding and subtracting them
        value: combineAnimatedValues(seq.map(s => s.value)),

        // add all animations in a looping sequence
        animation: Animated.loop(
            Animated.sequence(seq.map(o => o.animation)),
            /*{
                iterations: -1, // infinite
            },*/
        ),
    };
}

// chains animation values together, alternating the direction
function combineAnimatedValues(values) {
    let val = values[0];
    for (let i = 1; i < values.length; i++) {
        if (i % 2 == 0) {
            val = Animated.add(val, values[i]);
        } else {
            val = Animated.subtract(val, values[i]);
        }
    }

    return val;
}

function spinAnimation(maxLoops?: number) {
    const value = new Animated.Value(0);
    const loops = rndNum(1, maxLoops || rndNatNum(1, 5));

    return {
        value: value,
        animation: Animated.timing(
            value,
            {
                toValue: 360 * loops,
                duration: 2000,
                useNativeDriver: true,
            }
        ),
    };
}

function springAnimation() {
    const value = new Animated.Value(0);

    const maxLoops = 1;
    const loops = rndNum(0.1, maxLoops);

    return {
        value: value,
        animation: Animated.spring(
            value,
            {
                bounciness: 10,

                toValue: 360 * loops,
                useNativeDriver: true,
            },
        ),
    };
}

function rndNatNum(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min;
}

function rndNum(min: number, max: number): number {
    return (Math.random() * max) + min;
}

const styles = StyleSheet.create({
    outerCircle: {
        width: 100,
        height: 100,

        borderRadius: 50,    // width/2
        borderColor: 'cyan',
        borderWidth: 5,
    },
    eye: {
        marginLeft: 75,
        marginTop: 40,
        width: 10,
        height: 10,         // same as width
        borderRadius: 5,    // width/2

        backgroundColor: 'blue',
    },
});
