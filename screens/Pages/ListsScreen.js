﻿import React from 'react';
//import * as firebase from 'firebase';
import {
    ScrollView,
    StyleSheet,
    View,
    TouchableHighlight,
    DeviceEventEmitter,
    Text
} from 'react-native';

import { insertData } from '../../components/services/baseService';
import { deleteItemsFromList, structureList, getLists, getListsByUser } from '../../components/services/Service';
import ListItem from '../../components/UI/ListItem';
import TabBarIcon from '../../components/UI/TabBarIcon';
import AddEditList from '../../components/UI/AddEditList';
import ConfirmDelete from '../../components/UI/ConfirmDelete';
import ModalDefault from '../../components/UI/ModalDefault';
import Header from '../../screens/Shared/Header';



export default class ListScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            listend: false,
            page: 0,
            lists: [],
            list: {
                title: "",
                games: [],
                status: "",
                description: "",
                type: "",
                limit: ""
            },
            multiSelect: false,
            selectedItens: [],
            modalVisible: false,
            mounted: false,
            modelInvalid: false,
            modalActive: null
        };
    }
    componentDidMount() {
        var _self = this;


        DeviceEventEmitter.addListener('updatelist', (data) => {
            console.log("RELOAD CONTENT");
            this.loadData();
        });
        DeviceEventEmitter.addListener('selectMode', (data) => {
            this.setState({ selectMode: data });
        });
        DeviceEventEmitter.emit('reloading', true);

        this.loadData();
        //Here is the Trick
        const { navigation } = this.props;
        //Adding an event listner om focus
        //So whenever the screen will have focus it will set the state to zero
        this.focusListener = navigation.addListener('didFocus', () => {
            this.loadData();
        });
    }
    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();
        this.setState({ mounted: false });
    }
    setVisible(content) {
        let _self = this;
        _self.setState({ modalVisible: false },
            () => {
                _self.setState({ modalActive: content },
                    () => {
                        _self.setState({ modalVisible: true },
                            () => {
                            }
                        );
                    }
                );
            }
        );
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    loadData = () => {
        var _self = this;
        getListsByUser(1, global.user.id).then(list => {
            structureList(list.List).then(r => {
                var obj = [];
                var ol = Object.keys(r);
                for (var item in r) {
                    obj.push(r[item]);
                }
                _self.setState({ page: 0, lists: obj, listend: false, loading: false, mounted: true },
                    () => {
                        DeviceEventEmitter.emit('reloading', false);
                    }
                );
                return true;
            });
        });

        _self.setState({ page: 0, lists: [], listend: false, loading: false, mounted: true }, () => {
            DeviceEventEmitter.emit('reloading', false);
        });
    }

    arrayRemove(arr, value) {
        return arr.filter(function (el) {
            return !value.includes(el);
        });
    }
    selectItem = (id) => {
        var arrayobj = this.state.selectedItens;
        if (!arrayobj.includes(id)) {
            arrayobj.push(id);
        } else {
            arrayobj = this.arrayRemove(arrayobj, [id]);
        }
        this.setState({ selectedItens: arrayobj },
            () => {
            }
        );
    }
    confirmdeleteItens = () => {
        var _self = this;

        DeviceEventEmitter.emit('reloading', true);
        deleteItemsFromList(this.state.selectedItens).then(() => {

            _self.closeModal();
            _self.setState({ selectedItens: [], selectMode: false },
                () => {
                    DeviceEventEmitter.emit('updatelist', true);
                    DeviceEventEmitter.emit('selectMode', false);
                }
            );

        });
    }
    deleteItens = () => {
        let _self = this;
        this.setVisible(this._modalDeleteList());
    }
    addItens = () => {
        let _self = this;
        console.log("SHOW MODAL");
        this.setVisible(this._modalAdd());
    }
    callbackAdd = () => {
        console.log("CLOSE MODAL");
        this.setModalVisible(false);
        this.closeModal();

        DeviceEventEmitter.emit('updatelist', true);
    }
    closeModal = () => {
        this.setState({
            modalVisible: false,
            list: {
                title: "",
                games: [],
                status: "",
                description: "",
                type: "",
                limit: ""
            }
        });
    }

    renderLists() {
        let lists = this.state.lists;
        let items = [];
        for (let i = 0; i < lists.length; i++) {
            items.push(<ListItem key={i} obj={lists[i]} callback={this.selectItem.bind(this)} id={lists[i]._id} />);
        }
        return items;
    }
    _headerItens() {
        if (this.state.selectMode) {
            return (<TouchableHighlight underlayColor="transparent" onPress={() => this.deleteItens()} style={styles.sideIcon}>
                <TabBarIcon
                    name={'trash-can-outline'}
                    type={'MaterialCommunityIcons'}
                    style={styles.backButton}
                />
            </TouchableHighlight>);
        } else {
            return (
                <TouchableHighlight underlayColor="transparent" onPress={() => this.addItens()} style={styles.sideIcon}>
                    <TabBarIcon
                        name={'playlist-plus'}
                        type={'MaterialCommunityIcons'}
                        style={styles.backButton}
                    />
                </TouchableHighlight>
            );
        }
    }

    _modalAdd() {
        return (
            <AddEditList list={this.state.list} callback={this.callbackAdd.bind(this)} />
        );
    }
    _modalDeleteList() {
        return (
            <ConfirmDelete confirmdeleteItens={this.confirmdeleteItens.bind(this)} closeModal={this.closeModal.bind(this)} />
        );
    }
    _renderList() {

        if (this.state.lists.length > 0) {
            return (
                <ScrollView>
                    <View style={styles.scrollArea}>
                        {this.renderLists()}
                    </View>
                </ScrollView>
            );
        } else {
            return (
                <View style={styles.emptyFeedbackBox}>
                    <Text style={styles.emptyFeedback}>Não há nenhuma lista cadastrada!</Text>
                </View>
            );
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this._renderList()}

                <Header style={styles.header} type={"info-lists"} back={true} label={"Minhas Listas"} detail={this.state.lists.length + " listas"} itens={this._headerItens()} />




                <ModalDefault type="slide" visible={this.state.mounted && this.state.modalVisible} modalActive={this.state.modalActive} closeModal={this.closeModal.bind(this)} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 60
    },
    sideIcon: {
        padding: 5
    },
    backButton: {
        fontSize: 40
    },
    scrollArea: {
        paddingBottom: 40
    },
    emptyFeedbackBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    },
    emptyFeedback: {
        color: "#FFF",
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: 20

    }
});