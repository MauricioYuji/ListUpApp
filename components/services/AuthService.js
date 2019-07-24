
import {
    AsyncStorage
} from 'react-native';
import { Constants, Facebook } from 'expo';
import { post, get } from '../services/baseService';


export function confirmEmail(email: string) {

    var user = {
        email: email
    };
    //console.log("POST LOGIN");
    return post("/sendconfirm/", user);

}
export function forgetpassword(email: string) {

    var user = {
        email: email
    };
    //console.log("POST LOGIN");
    return post("/resetpassword/", user);

}
export function logIn(email: string, password: string) {

    var user = {
        password: password,
        username: email
    };
    //console.log("POST LOGIN");
    return post("/login/", user);

}
export function signIn(email: string, fullname: string, password: string) {

    var user = {
        password: password,
        fullname: fullname,
        email: email
    };
    //console.log("POST LOGIN");
    return post("/user/add", user);

}
export async function logOut() {

    deleteUser().then(p => {
        return p;
    });


}
//_getData = async () => {
//    console.log("GET STORAGE");
//    try {
//        await AsyncStorage.getItem("user").then((value) => {
//            consolelog("value: ", value);
//            return value;
//        }).then(res => {
//            //do something else
//            consolelog("res: ", res);
//            return res;
//        });
//    } catch (error) {
//        // Error saving data
//    }
//};

export async function getUser() {
    try {
        return AsyncStorage.getItem("user").then(p => {
            var user = JSON.parse(p);
            if (user != null) {
                return get("/user/" + user.id, user.token).then(p => {
                    return p;
                });
            } else {
                var obj = {
                    success: false,
                    message: '',
                    data: null
                };
                return obj;
            }

        });
    } catch (error) {
        var obj = {
            success: false,
            message: 'Ocorreu algum erro!',
            data: null
        };
        return obj;
    }
}
export async function storeUser(user) {
    try {
        //console.log("try store: ", JSON.stringify(user));
        AsyncStorage.setItem('user', JSON.stringify(user));
        return AsyncStorage.getItem('user');
    } catch (error) {
        // Error saving data
    }
}
export async function deleteUser() {
    try {
        AsyncStorage.removeItem('user');
        return null;
    } catch (error) {
        // Error saving data
    }
}