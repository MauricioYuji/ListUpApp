import React from 'react';
//import * as firebase from 'firebase';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import { structureGames, getGames } from '../../components/services/Service';
import AddGameItem from '../../components/UI/AddGameItem';



export default class AddGame extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        games: [],
        searching: false,
        typing: false,
        typingTimeout: 0,
        search: ""
    };
    confirmdeleteItens = () => {
        this.props.confirmdeleteItens();
    }
    _searchGame(search) {
        var _self = this;

        console.log("_self.state.typingTimeout: ", _self.state.typingTimeout);
        //if (_self.state.typingTimeout) {
        //    clearTimeout(_self.state.typingTimeout);
        //}

        _self.setState({ page: 1, games: [], search: search },
            () => {

                console.log("search: ", search);
                //if (search == "") {
                //    _self.setState({ page: 1, games: [], search: search },
                //        () => {
                //            _self.setState({ renderGames: _self.renderGames() },
                //                () => {
                //                }
                //            );
                //        }
                //    );
                //} else {
                _self.loadData();
                //}
            }
        );


        //_self.setState({
        //    typing: false,
        //    typingTimeout: setTimeout(function () {
        //        //self.sendToParent(self.state.name);

        //        //DeviceEventEmitter.emit('loading', true);
               
        //    }, 1)
        //});




    }

    loadData = () => {
        var _self = this;

        //console.log("filterObj: ", this.state.filterObj);
        //console.log("page: ", this.state.page);

        //console.log("this.state.search: ", this.state.search);
        getGames(this.state.page, this.state.search, "", "").then(p => {
            //console.log("LIST GAMES: ", p);
            if (p.List !== null) {
                structureGames(p.List).then(games => {
                    console.log("PROCESSADO: ", games);
                    games = _self.state.games.concat(games);
                    _self.setState({ page: this.state.page, games: games, processing: false, renderGames: _self.renderGames() },
                        () => {
                            DeviceEventEmitter.emit('loading', false);
                            //process = false;

                        }
                    );
                }).catch(err => console.log('There was an error:' + err));

                //_self.filterObj();
            } else {
                DeviceEventEmitter.emit('loading', false);
            }
        }).catch(() => {

        });

    }
    addGameSave = () => {

    }
    renderGames() {
        let list = this.state.games;
        let items = [];
        console.log("this.props.list: ", this.props.list);
        console.log("list: ", list);
        for (let i = 0; i < list.length; i++) {
            var game = undefined;
            if (this.props.list.games.length > 0) {
                game = this.props.list.games.filter(p => p._id === list[i]._id)[0];
            }
            var userconsoles = null;
            if (game !== undefined) {
                userconsoles = game.userConsoles;
            }
            //console.log("game: ", game);
            //console.log("list[i]: ", list[i]);
            items.push(<AddGameItem key={i} game={list[i]} userConsoles={userconsoles} callback={this.addGameSave.bind(this)} id={list[i].id} />);
        }
        console.log("items: ", items);
        return items;
    }
    render() {
        return (
            <View style={styles.menuList}>
                <View style={styles.scrollBox}>
                    <Text style={styles.menuTitle}>-ADICIONAR JOGO-</Text>
                    <TextInput
                        placeholder={"Nome"}
                        style={[styles.inputsearch, styles.inputText]}
                        onChangeText={(text) => this._searchGame(text)}
                        ref={input => { this.titleInput = input; }}
                    />
                </View>

                <ScrollView keyboardShouldPersistTaps="always" style={styles.gamebox}>
                    {this.state.games.length === 0 ?
                        <Text style={styles.TextclearList}>Procure pelo nome o jogo que gostaria de adicionar</Text>
                        :
                        <View>
                            {this.state.renderGames}
                        </View>

                    }

                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    menuList: {
        width: '100%',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollBox: {
        width: '100%',
        height: 150,
        paddingHorizontal: 15,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuTitle: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'SourceSansPro-Light',
        fontSize: 30,
        paddingHorizontal: 50,
        marginTop: 50
    },
    inputsearch: {
        backgroundColor: '#444',
        margin: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        minHeight: 50,
        width: '100%'
    },
    inputText: {
        color: '#FFF',
        fontFamily: 'SourceSansPro-Regular',
        fontSize: 18
    },
    gamebox: {
        padding: 0,
        width: '100%',
        paddingHorizontal: 15,
        height: Dimensions.get('window').height / 150
    },
    TextclearList: {
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold',
        fontSize: 18,
        textAlign: 'center',
        padding: 40
    }
});