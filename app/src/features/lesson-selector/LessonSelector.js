// @flow

import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { StandardText } from '~/src/shared/components/Texts.js';
import { constants } from '~/src/styles/constants.js';
import { flag } from '~/src/utils/images.js';

const levels = [
    {
        type: 'lessons',
        lessons: [{
            name: "The eight base emotions",
            icon: flag,
        }],
    }, 
    {
        type: 'lessons',
        lessons: [{
            name: "The eight base emotions",
            icon: flag,
        },{
            name: "The eight base emotions",
            icon: flag,
        }],
    }, 
    {
        type: 'quiz',
        name: "LET'S DO AN EQ TEST",
        icon: flag,
    },
    {
        type: 'lessons',
        lessons: [{
            name: "The eight base emotions",
            icon: flag,
        },{
            name: "The eight base emotions",
            icon: flag,
        }],
    }, 
    {
        type: 'lessons',
        lessons: [{
            name: "The eight base emotions",
            icon: flag,
        },{
            name: "The eight base emotions",
            icon: flag,
        }],
    }, 
    {
        type: 'lessons',
        lessons: [{
            name: "The eight base emotions",
            icon: flag,
        },{
            name: "The eight base emotions",
            icon: flag,
        }],
    }, 
    {
        type: 'lessons',
        lessons: [{
            name: "The eight base emotions",
            icon: flag,
        },{
            name: "The eight base emotions",
            icon: flag,
        }],
    }, 
];
export function LessonSelector(props: {}) {
    return <ScrollView style={constants.padflex}>
        <Levels levels={levels} />
    </ScrollView>
}

function Levels(props: *) {
    const { levels } = props;
    const style = {
        flex: 1,
        flexDirection: 'column',
    };

    return <View style={style}>
        { 
            levels.map( (l, i) => {
                if (l.type === 'lessons') {
                    return <LessonLevel lessons={l.lessons} key={i} />
                } else if (l.type === 'quiz') {
                    return <QuizLevel quiz={l} key={i} />
                }
            }) 
        }
    </View>
}

function LessonLevel(props: *) {
    const style = {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    };

    return <View style={style}>
        { props.lessons.map( (l, i) => <Lesson lesson={l} key={i} />) }
    </View>
}

function Lesson(props: *) {
    const { lesson } = props;
    const style = {
        flexDirection: 'column',
        alignItems: 'center',
        width: 100,

        marginBottom: constants.space(3),
    };

    return <View style={style}>
        <Image source={lesson.icon} />
        <StandardText style={{ textAlign: 'center' }}>{lesson.name}</StandardText>
    </View>
}

function QuizLevel(props: *) {
    const { quiz } = props;
    const style = {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',

        marginBottom: constants.space(3),
    };
    console.log(props);

    return <View style={style}>
        <Image source={quiz.icon} />
        <StandardText style={{ textAlign: 'center' }}>{quiz.name}</StandardText>
    </View>
}
