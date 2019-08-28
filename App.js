﻿import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, Image, ScrollView, Modal, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Layout from './constants/Layout';
import NavigationService from './components/services/NavigationService';
import { getUser, deleteUser, storeUser } from './components/services/AuthService';
import { setToken } from './components/services/Service';

import AppNavigator from './navigation/AppNavigator';

export default function App(props) {
    const [isLoadingComplete, setLoadingComplete] = useState(false);
    const [isloading, setloading] = useState(false);

    useEffect(() => {
        //console.log("POST LOAD");
        DeviceEventEmitter.addListener('setUser', (data) => {
            if (data != null) {
                storeUser(data).then(p => {
                    setToken();
                    var obj = {
                        data: p,
                        success: true
                    };
                    _checkLogin(obj, setLoadingComplete);
                });
            } else {
                var obj = {
                    data: null,
                    success: false,
                    message: ''
                };
                _checkLogin(obj, setLoadingComplete);
            }
        });
        DeviceEventEmitter.addListener('loading', (data) => {
            setloading(data);
        });
    }, []);


    if (!isLoadingComplete && !props.skipLoadingScreen) {
        return (
            <AppLoading
                startAsync={loadResourcesAsync}
                onError={handleLoadingError}
                onFinish={() => handleFinishLoading(setLoadingComplete)}
            />
        );
    } else {
        //return (
        //    <View style={styles.container}>
        //        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        //        <AppNavigator />
        //    </View>
        //);

        return (
            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'>
                <Image source={require('./assets/images/background.png')} resizeMode={'cover'} style={[styles.backgroundBanner]} />
                <StatusBar barStyle="default" />
                <AppNavigator ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                }} />
                {isloading &&
                    <Modal
                        animationType="fade"
                        transparent={true}
                        onRequestClose={() => {
                        }}>
                        <View style={styles.backgroundModal}>
                            <ActivityIndicator size="large" color="#FFFFFF" />
                        </View>
                    </Modal>
                }
            </ScrollView>
        );
    }
}

async function loadResourcesAsync() {
    await Promise.all([
        Asset.loadAsync([
            require('./assets/images/console-icon.png'),
            require('./assets/images/logo.png'),
            require('./assets/images/search-icon.png'),
            require('./assets/images/background.png'),
            require('./assets/images/tutorial-1.png'),
            require('./assets/images/tutorial-2.png'),
            require('./assets/images/tutorial-3.png')
        ]),
        Font.loadAsync({
            // This is the font that we are using for our tab bar
            ...Ionicons.font,
            // We include SpaceMono because we use it in HomeScreen.js. Feel free to
            // remove this if you are not using it in your app
            'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
            'SourceSansPro-Black': require('./assets/fonts/SourceSansPro-Black.ttf'),
            'SourceSansPro-BlackItalic': require('./assets/fonts/SourceSansPro-BlackItalic.ttf'),
            'SourceSansPro-Bold': require('./assets/fonts/SourceSansPro-Bold.ttf'),
            'SourceSansPro-BoldItalic': require('./assets/fonts/SourceSansPro-BoldItalic.ttf'),
            'SourceSansPro-ExtraLight': require('./assets/fonts/SourceSansPro-ExtraLight.ttf'),
            'SourceSansPro-ExtraLightItalic': require('./assets/fonts/SourceSansPro-ExtraLightItalic.ttf'),
            'SourceSansPro-Italic': require('./assets/fonts/SourceSansPro-Italic.ttf'),
            'SourceSansPro-Light': require('./assets/fonts/SourceSansPro-Light.ttf'),
            'SourceSansPro-LightItalic': require('./assets/fonts/SourceSansPro-LightItalic.ttf'),
            'SourceSansPro-Regular': require('./assets/fonts/SourceSansPro-Regular.ttf'),
            'SourceSansPro-SemiBold': require('./assets/fonts/SourceSansPro-SemiBold.ttf'),
            'SourceSansPro-SemiBoldItalic': require('./assets/fonts/SourceSansPro-SemiBoldItalic.ttf')
        }),
    ]);
}
function handleFinishLoading(setLoadingComplete) {

    //_checkLogin(null, setLoadingComplete);
    getUser().then(obj => {
        var data = null;
        if (obj.data != null) {
            data = JSON.parse(obj.data);
            data.token = obj.token;

            storeUser(data).then(p => {
                setToken();
                var obj = {
                    data: p,
                    success: true
                };

            });
        }
        _checkLogin(obj, setLoadingComplete);

    });
}
function _checkLogin(obj, setLoadingComplete) {
    setLoadingComplete(true);
    if (obj.data != null) {
        var data = JSON.parse(obj.data);
        if (data.flagtutorial) {
            NavigationService.navigate('Main');
        } else {
            NavigationService.navigate('Tutorial');
        }
    } else {
        deleteUser().then(() => {
            NavigationService.navigate('Login', {
                feedback: obj.message
            });

        });

    }
}
function handleLoadingError(error: Error) {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error);
}

const styles = StyleSheet.create({
    backgroundModal: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#000',
    },
    backgroundBanner: {
        width: '100%',
        height: Layout.window.height,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
});