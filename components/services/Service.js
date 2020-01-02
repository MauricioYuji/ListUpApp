//import * as firebase from 'firebase';
import { getData, updateData, setData } from './baseService';


import { post, get, del, put } from '../services/baseService';
import { getToken } from './AuthService';

const token = "";

export function setToken() {
    getToken().then(token => {
        this.token = token;
    });
}

export function updateTutorial(id: string) {

    var user = {
        id: id
    };
    //console.log("POST LOGIN");
    return post("/user/tutorial/", user, this.token);

}
export function createOrupdateList(obj: any) {
    if (obj._id == undefined) {
        return post("/list/add/", obj, this.token);
    } else {
        return put("/list/edit/" + obj._id, obj, this.token);
    }

}
export function getLists(page: number) {
    return get("/lists/?page=" + page + "&perpage=10", this.token);

}
export function getListsByUser(page: number, key: string) {
    return get("/lists/" + key + "/?page=" + page + "&perpage=10", this.token);

}
export function getList(key: string) {
    return get("/list/" + key, this.token);

}
export function getGames(page: number, s: string, c: string, g: string) {

    //return getToken().then(token => {
    //    var url = "/games/?page=" + page + "&perpage=10";
    //    if (s != "")
    //        url += "&s=" + s;
    //    if (c != "")
    //        url += "&c=" + c;
    //    if (g != "")
    //        url += "&g=" + g;
    //    return get(url, token);

    //});
    var url = "/games/?page=" + page + "&perpage=10";
    if (s != "")
        url += "&s=" + s;
    if (c != "")
        url += "&c=" + c;
    if (g != "")
        url += "&g=" + g;
    return get(url, this.token);

}
export function getGame(key: string) {

    //return getToken().then(token => {
    //    return get("/games/" + key, token);

    //});

    return get("/games/" + key, this.token);

}

export const deleteItemsFromList = async (keys) => {

    //console.log("keys: ", keys);
    //var user = firebase.auth().currentUser;

    return del("/list/delete/", keys, this.token);

    //let lists = null;
    //var objgames = [];
    //await firebase.database().ref('/userLists/' + user.uid).once('value').then(function (snapshot) {
    //    lists = snapshot.val();
    //    for (var i = 0; i < keys.length; i++) {
    //        lists[keys[i]] = null;
    //    }
    //    updateData('/userLists/' + user.uid + '/', lists)
    //        .then((img) => {
    //        });
    //});

};

//const getGame = async (keys) => {

//    let list = require('../../files/consoles.json');

//    return new Promise((resolve, reject) => {
//        var promises = keys.map(function (key) {
//            return firebase.database().ref("/Games/").child(key).once("value");
//        });
//        Promise.all(promises).then(function (snapshots) {
//            var obj = {};
//            snapshots.forEach(function (snapshot) {
//                var genres = [];
//                var consoles = [];
//                var companies = [];
//                var item = snapshot.val();
//                var file = { key: item.img, url: "", file: null };
//                for (var j = 0; j < item.keyconsole.length; j++) {
//                    var c = list.Companies[list.Consoles[item.keyconsole[j]].keycompany];
//                    consoles.push(list.Consoles[item.keyconsole[j]]);
//                    c.key = list.Consoles[item.keyconsole[j]].keycompany;
//                    if (!companies.includes(c))
//                        companies.push(c);
//                }

//                for (var j = 0; j < item.keygenre.length; j++) {
//                    genres.push(list.Genres[item.keygenre[j]]);

//                }
//                var game = {
//                    key: snapshot.key,
//                    name: item.name,
//                    image: file,
//                    genres: genres,
//                    consoles: consoles,
//                    companies: companies
//                };

//                obj[snapshot.key] = game;

//            });



//            resolve(obj);
//        });
//    });

//};
//const getImages = async (keys) => {
//    return new Promise((resolve, reject) => {
//        var promises = keys.map(function (key) {
//            return firebase.database().ref("/thumbs/").child(key).once("value");
//        });
//        Promise.all(promises).then(function (snapshots) {
//            var obj = {};
//            snapshots.forEach(function (snapshot) {
//                obj[snapshot.key] = snapshot.val();

//            });
//            resolve(obj);
//        });
//    });
//};

export const structureGames = async (games) => {
    var objgames = [];
    let list = require('../../files/consoles.json');

    return new Promise((resolve, reject) => {
        for (let key in games) {
            var genres = [];
            var consoles = [];
            var companies = [];
            var item = games[key];
            //var file = { key: games[key].img, url: "", file: null };

            if (item.keyconsole != undefined) {
                for (var j = 0; j < item.keyconsole.length; j++) {
                    var c = list.Companies[list.Consoles[item.keyconsole[j]].keycompany];
                    consoles.push(list.Consoles[item.keyconsole[j]]);
                    c.key = list.Consoles[item.keyconsole[j]].keycompany;
                    if (!companies.includes(c))
                        companies.push(c);
                }
            }
            //if (item.keygenre != undefined) {
            //    for (var j = 0; j < item.keygenre.length; j++) {
            //        genres.push(list.Genres[item.keygenre[j]]);
            //    }
            //}
            var obj = {
                _id: item._id,
                name: item.name,
                img: item.img,
                genres: item.keygenre,
                consoles: consoles,
                companies: companies,
            };
            objgames.push(obj);
        }
        resolve(objgames);

        //var imgkeys = [];
        //for (let key in games) {
        //    if (!imgkeys.includes(games[key].img) && games[key].img != "")
        //        imgkeys.push(games[key].img);
        //}
        //getImages(imgkeys).then((imgs) => {
        //    for (let key in objgames) {
        //        if (objgames[key].image.key != "") {
        //            objgames[key].image.url = imgs[objgames[key].image.key].url;
        //            objgames[key].image.file = imgs[objgames[key].image.key].file;
        //        }


        //    }
        //    resolve(objgames);
        //});


    });
};
export const structureList = async (obj) => {
    let objlist = require('../../files/consoles.json');
    return new Promise((resolve, reject) => {
        var keys = [];
        for (var list in obj) {
            for (let key in obj[list].games) {
                var objkey = Object.keys(obj[list].games[key])[0];
                if (!keys.includes(objkey))
                    keys.push(objkey);
            }
        }
        if (keys.length > 0) {
            getGame(keys).then((game) => {
                for (var list in obj) {
                    var games = [];
                    for (var index in obj[list].games) {
                        let key = Object.keys(obj[list].games[index])[0];
                        var item = game[key];
                        var userconsoles = obj[list].games[index][key];
                        for (var i = 0; i < userconsoles.length; i++) {
                            userconsoles[i] = objlist.Consoles[userconsoles[i]];
                        }
                        item.userConsoles = userconsoles;
                        games.push(item);
                    }
                    obj[list].key = list;
                    obj[list].games = games;
                }
                resolve(obj);
            });
        } else {
            resolve(obj);
        }

    });
};
export const deleteGamesFromList = async (keys, keylist) => {

    var user = firebase.auth().currentUser;

    let lists = null;
    await firebase.database().ref('/userLists/' + user.uid + '/' + keylist + '/games/').once('value').then(function (snapshot) {
        lists = snapshot.val();
        var index = [];
        for (var i = 0; i < keys.length; i++) {

            var r = lists.filter(p => Object.keys(p) == keys[i] && p != null);
            index = lists.indexOf(r[0]);
            lists.splice(index, 1);


        }
        setData('/userLists/' + user.uid + '/' + keylist + '/games/', lists)
            .then((img) => {
            });
    });

};
export const addGamestoList = async (keylist, keygame, obj) => {
    var user = firebase.auth().currentUser;

    var itemobj = {};
    itemobj[keygame] = obj.length <= 0 ? "" : obj;
    getData('/userLists/' + user.uid + '/' + keylist + '/games/').then((res) => {
        res = (res == null) ? [] : res;
        var r = res.filter(p => Object.keys(p) == keygame);
        var index = res.indexOf(r[0]);
        if (res.length == 0 || index == -1) {
            res.push(itemobj);
        } else {
            res[index] = itemobj;
        }
        setData('/userLists/' + user.uid + '/' + keylist + '/games/', res).then((res) => {
        });
    });
};
