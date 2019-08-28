//import * as firebase from 'firebase';
const base = "http://192.168.15.12:3000";
//const base = "http://yujishima.ddns.net:3000";
//const base = "https://listupapp.herokuapp.com";


export const put = (path, obj, token) => {
    let data = {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    return fetch(base + path, data)
        .then(response => response.json());
};
export const post = (path, obj, token) => {

    //return fetch(base + path, {
    //    method: 'POST',
    //    headers: {
    //        Accept: 'application/json',
    //        'Content-Type': 'application/json',
    //    },
    //    body: JSON.stringify(obj),
    //});
    let data = {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    return fetch(base + path, data)
        .then(response => response.json());

};

export const get = (path, token) => {
    let data = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    return fetch(base + path, data)
        .then(response => response.json());
};

export const del = (path, obj, token) => {
    let data = {
        method: 'DELETE',
        body: JSON.stringify(obj),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    return fetch(base + path, data)
        .then(response => response.json());
};

