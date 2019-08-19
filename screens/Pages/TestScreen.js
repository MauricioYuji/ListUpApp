/**
 * Sample React Native App
 * httpss://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    Platform,
    ScrollView
} from 'react-native';
import SortableList from 'react-native-sortable-list';
import DragGame from '../../components/UI/DragGame';

const window = Dimensions.get('window');


const data = {
    0: {
        image: 'https://placekitten.com/200/240',
        text: 'Chloe',
    },
    1: {
        image: 'https://placekitten.com/200/201',
        text: 'Jasper',
    },
    2: {
        image: 'https://placekitten.com/200/202',
        text: 'Pepper',
    },
    3: {
        image: 'https://placekitten.com/200/203',
        text: 'Oscar',
    },
    4: {
        image: 'https://placekitten.com/200/204',
        text: 'Dusty',
    },
    5: {
        image: 'https://placekitten.com/200/205',
        text: 'Spooky',
    },
    6: {
        image: 'https://placekitten.com/200/210',
        text: 'Kiki',
    },
    7: {
        image: 'https://placekitten.com/200/215',
        text: 'Smokey',
    },
    8: {
        image: 'https://placekitten.com/200/220',
        text: 'Gizmo',
    },
    9: {
        image: 'https://placekitten.com/220/239',
        text: 'Kitty',
    },
};

export default class TestScreen extends Component {
    render() {
        return (
            <View style={styles.container}>

                <ScrollView style={styles.gameslide} horizontal={false}>
                    <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                    <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                    <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                    <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                    <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                    <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                    <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                </ScrollView>
                <SortableList
                    style={styles.list}
                    contentContainerStyle={styles.contentContainer}
                    data={data}
                    renderRow={this._renderRow} />
            </View>
        );
    }

    _renderRow = ({ data, active }) => {
        return <DragGame data={data} active={active} />
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',

        ...Platform.select({
            ios: {
                paddingTop: 20,
            },
        }),
    },

    title: {
        fontSize: 20,
        paddingVertical: 20,
        color: '#999999',
    },

    list: {
        flex: 1,
    },

    contentContainer: {
        width: window.width,

        ...Platform.select({
            ios: {
                paddingHorizontal: 30,
            },

            android: {
                paddingHorizontal: 0,
            }
        })
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        height: 80,
        flex: 1,
        marginTop: 7,
        marginBottom: 12,
        borderRadius: 4,


        ...Platform.select({
            ios: {
                width: window.width - 30 * 2,
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOpacity: 1,
                shadowOffset: { height: 2, width: 2 },
                shadowRadius: 2,
            },

            android: {
                width: window.width - 30 * 2,
                elevation: 0,
                marginHorizontal: 30,
            },
        })
    },

    image: {
        width: 50,
        height: 50,
        marginRight: 30,
        borderRadius: 25,
    },

    text: {
        fontSize: 24,
        color: '#222222',
    },
});