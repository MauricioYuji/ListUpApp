//import firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import Constants from 'expo-constants';
import { post, get } from '../services/baseService';

export async function logInWithFacebook() {
    const appId = Constants.manifest.extra.facebook.appId;
    const permissions = ['public_profile', 'email'];



    const {
        type,
        token
    } = await Facebook.logInWithReadPermissionsAsync(
        appId,
        { permissions }
    );
    switch (type) {
        case 'success': {

            //await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
            //const credential = firebase.auth.FacebookAuthProvider.credential(token);
            //const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential


            //const userdata = facebookProfileData.user.providerData[0];
            //console.log("userdata: ", userdata);
            console.log('Logged in!', token);
            const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
            var obj = await response.json();
            console.log('Logged in!', obj);
            console.log('http://graph.facebook.com/' + obj.id + '/picture?type=square');
            var user = {
                password: obj.id,
                fullname: obj.name,
                email: obj.email,
                photoURL: 'http://graph.facebook.com/' + obj.id + '/picture?type=square',
                isfacebook: true
            };
            console.log("user: ", user);
            //console.log("POST LOGIN");

            

            return post("/loginwithfacebook/", user);

            //return Promise.resolve({ type: 'success' });
        }
        case 'cancel': {
            return Promise.reject({ type: 'cancel' });
        }
    }
}

export async function signInWithFacebook() {
    const appId = Constants.manifest.extra.facebook.appId;
    const permissions = ['public_profile', 'email'];



    const {
        type,
        token
    } = await Facebook.logInWithReadPermissionsAsync(
        appId,
        { permissions }
    );
    switch (type) {
        case 'success': {

            //await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
            //const credential = firebase.auth.FacebookAuthProvider.credential(token);
            //const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential


            //const userdata = facebookProfileData.user.providerData[0];
            //console.log("userdata: ", userdata);
            console.log('Logged in!', token);
            const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
            var obj = await response.json();
            console.log('Logged in!', obj);
            console.log('http://graph.facebook.com/' + obj.id + '/picture?type=square');
            var user = {
                password: obj.id,
                fullname: obj.name,
                email: obj.email,
                photoURL: 'http://graph.facebook.com/' + obj.id + '/picture?type=square',
                isfacebook: true
            };
            console.log("user: ", user);
            //console.log("POST LOGIN");



            return post("/signinwithfacebook/", user);

            //return Promise.resolve({ type: 'success' });
        }
        case 'cancel': {
            return Promise.reject({ type: 'cancel' });
        }
    }
}