import React from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    Image,
    Keyboard
} from 'react-native';
import TabBarIcon from '../UI/TabBarIcon';
import { addGamestoList } from '../services/Service';


export default class AddGameItem extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        showButtons: false,
        addFeedback: false,
        consolesActive: []
    };

    componentDidMount() {
        var _self = this;
        var item = this.props.userConsoles;
        var array = [];
        if (item != null) {
            for (var i = 0; i < item.length; i++) {
                array.push(item[i].id);
            }
            _self.setState({ consolesActive: array });
        }

    }
    setConsoles = () => {
        var item = this.props.userConsoles;
        var array = [];
        if (item != null) {
            for (var i = 0; i < item.length; i++) {
                array.push(item[i].id);
            }
            this.setState({ consolesActive: array });
        }
    }
    showButtons = () => {
        //console.log("this.props: ", this.props);
        //console.log("this.state: ", this.state);
        if(this.props.userConsoles != this.state.consolesActive && this.state.consolesActive.length == 0){
            this.setConsoles();
        }
        var _self = this;
        Keyboard.dismiss();
        _self.setState({ showButtons: !this.state.showButtons },
            () => {
            }
        );
    }

    arrayRemove(arr, value) {
        return arr.filter(function (el) {
            return !value.includes(el);
        });
    }
    arrayUnique(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    }
    ActiveConsole(key, multiple) {
        var _self = this;
        var list = this.state.consolesActive;
        let consoles = this.props.game.consoles;
        if (!multiple) {
            if (list.includes(key))
                list = this.arrayRemove(list, [key]);
            else
                list.push(key);

        } else {
            var result = consoles.filter(p => p.idcompany === key).map(m => m.id);
            const found = result.every(r => list.includes(r));

            if (found)
                list = this.arrayRemove(list, result);
            else
                list = this.arrayUnique(list.concat(result));
        }
        _self.setState({ consolesActive: list },
            () => {
            }
        );


    }
    sendGame = () => {
        var _self = this;
        _self.setState({ addFeedback: true }, () => {
            setTimeout(function () {
                _self.setState({ addFeedback: false, showButtons: false }, () => {
                    addGamestoList(_self.props.id, _self.props.game._id, _self.state.consolesActive).then((resp) => {
                        _self.props.callback();
                    });
                });
            }, 1000);
        });
    }
    renderThumb = (item) => {
        //console.log("item: ", item);
        if (item == undefined)
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'cover'} style={styles.thumb} />);
        else {
            return (<Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/images%2F" + item + ".jpg?alt=media" }} resizeMode={'cover'} style={styles.thumb} />);
        }
    }
    listPlatforms = () => {
        var item = this.state.consolesActive;
        var array = [];
        if (item != null) {
            for (var i = 0; i < item.length; i++) {
                array.push(item[i]);
            }
        }


        let obj = [];
        let objarray = this.props.game.consoles;
        let filteractive = array;
        for (let j = 0; j < objarray.length; j++) {
            var styleclass = null;
            var imgcolor = '';
            if (filteractive.includes(objarray[j].key.toString())) {
                styleclass = styles.filterButtonActive;
                imgcolor = '#FFFFFF';
            } else {
                styleclass = styles.filterButton;
                imgcolor = '#BBBBBB';
            }
            obj.push(
                <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveConsole(objarray[j].key, false)} key={objarray[j].name} style={[styleclass]}>
                    <View>
                        <Image source={{ uri: objarray[j].img }} resizeMode={'contain'} style={[styles.filterButtonImg, { width: objarray[j].width / 5, height: objarray[j].height / 5, tintColor: imgcolor }]} />
                    </View>
                </TouchableHighlight>);
        }
        return obj;
    }
    renderAddButton = () => {
        if (this.state.addFeedback) {
            return (
                <Text style={styles.buttonTextFeedback}>Adicionado com sucesso</Text>
            );
        } else {
            return (
                <TouchableHighlight onPress={() => this.sendGame()} style={styles.button}>
                    <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableHighlight>
            );
        }
    }
    renderConsoleBox = () => {
        if (this.state.showButtons) {
            return (
                <View style={styles.consoleBox}>
                    <View style={styles.selectConsoles}>
                        {this.listPlatforms()}
                    </View>
                    {this.renderAddButton()}
                </View>
            );
        } else {
            return null;
        }
    }
    render() {
        var boxstyle = null;
        if (this.state.showButtons) {
            boxstyle = styles.activeBox;
        }
        //console.log("this.props.game: ", this.props.game);
        return (
            <View>
                <View style={[styles.listItem, boxstyle]}>
                    <View style={styles.itemInfo}>
                        {this.renderThumb(this.props.game.img)}
                        <View>
                            <Text style={styles.labelTitle}>{this.props.game.name}</Text>
                        </View>
                    </View>
                    <View style={styles.thumbArea}>

                        <TouchableHighlight underlayColor="transparent" onPress={this.showButtons.bind(this)}>
                            <TabBarIcon
                                name={'add'}
                                type={'MaterialIcons'}
                                style={styles.addIcon}
                            />
                        </TouchableHighlight>
                    </View>
                </View>
                {this.renderConsoleBox()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    consoleBox: {
        width: '100%',
        padding: 10,
        backgroundColor: '#444'
    },
    activeBox: {
        backgroundColor: '#444'
    },
    button: {
        backgroundColor: '#006CD8',
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        paddingVertical: 5,
        paddingHorizontal: 30,
        minHeight: 40,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold',
    },
    buttonTextFeedback: {
        fontSize: 20,
        color: '#FFF',
        flex: 1,
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        textAlign: 'center',
        fontFamily: 'SourceSansPro-Bold',
    },
    selectConsoles: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    },
    listItem: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    itemInfo: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: 'left',
    },
    labelTitle: {
        fontSize: 24,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    thumbArea: {
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        flex: 1
    },
    thumb: {
        width: 60,
        height: 90,
        marginRight: 10
    },
    addIcon: {
        fontSize: 50
    },

    filterButton: {
        backgroundColor: '#444444',
        borderRadius: 4,
        marginVertical: 10,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
    filterButtonActive: {
        backgroundColor: '#006CD8',
        borderRadius: 4,
        marginVertical: 10,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
    filterButtonImg: {
        margin: 5
    },
});