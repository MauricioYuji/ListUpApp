import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
//import * as firebase from 'firebase';
import Tutorial from '../Tutorial/Tutorial';
import { getUser } from '../../components/services/AuthService';
import { updateTutorial } from '../../components/services/Service';

export default class TutorialTemplate extends React.Component {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
    }

    _doneTutorial = () => {
        console.log("tutorial DONE");


        getUser().then(obj => {
            console.log("RETURN STORE: ", obj);

            updateTutorial(obj.id).then(p => {
                console.log("RETORNO LOGIN: ", p);
                if (p.success) {
                    obj.flagtutorial = true;
                    DeviceEventEmitter.emit('setUser', obj);

                }
            }).catch(() => {

            });
        });
        //var user = firebase.auth().currentUser;

        //var newuser = {
        //    uid: user.uid,
        //    photoURL: user.photoURL,
        //    displayName: user.displayName,
        //    email: user.email,
        //    flagtutorial: true
        //};

        //DeviceEventEmitter.emit('updateUser', { user: newuser });
    };
    render() {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'>
                <TouchableOpacity onPress={() => { this._doneTutorial(); }} style={styles.skipButton}>
                    <Text style={styles.skipText}>Pular</Text>
                </TouchableOpacity>
                <Tutorial />
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    skipButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1
    },
    skipText: {

        fontSize: 24,
        color: '#FFF',
    },
});
