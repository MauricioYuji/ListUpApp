import React from 'react';
//import * as firebase from 'firebase';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Dimensions,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';

import NavigationService from '../../components/services/NavigationService';
import { structureGames, getGames } from '../../components/services/Service';
import Header from '../../screens/Shared/Header';
import MasonryList from '@appandflow/masonry-list';

const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;
var process = false;



export default class GameScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            processing: true,
            games: [],
            gamesfiltered: [],
            filterObj: { consoles: [], genres: [], search: "" }
        };

    }

    componentWillMount() {
        DeviceEventEmitter.emit('loading', true);


    }
    componentDidMount() {
        var _self = this;
        this.loadData();
        DeviceEventEmitter.addListener('getFilter', (data) => {

            if (!process) {
                process = true;
                _self.setState({ filterObj: data, page: 1, games: [] },
                    () => {
                        _self.loadData();
                    }
                );
            }
        });
    }
    loadData = () => {
        var _self = this;

        //console.log("filterObj: ", this.state.filterObj);
        //console.log("page: ", this.state.page);
        getGames(this.state.page, this.state.filterObj.search, this.state.filterObj.consoles.toString().trim(), this.state.filterObj.genres.toString().trim()).then(p => {
            //console.log("LIST GAMES: ", p);
            if (p.List != null) {
                structureGames(p.List).then(games => {
                    //console.log("PROCESSADO: ", games);
                    games = _self.state.games.concat(games);
                    _self.setState({ page: this.state.page, games: games, processing: false },
                        () => {
                            DeviceEventEmitter.emit('loading', false);
                            process = false;
                        }
                    );
                }).catch(err => console.log('There was an error:' + err));

                //_self.filterObj();
            } else {
                DeviceEventEmitter.emit('loading', false);
            }
        }).catch(() => {

        });

        //firebase.database().ref('/Games/').on('value', function (snapshot) {
        //    if (snapshot.val() != null) {
        //        structureGames(snapshot.val()).then(games => {
        //            console.log("PROCESSADO");
        //            _self.setState({ page: 0, games: games },
        //                () => {
        //                    _self.filterObj();
        //                }
        //            );
        //            return true;
        //        }).catch(err => console.log('There was an error:' + err));
        //    } else {
        //        DeviceEventEmitter.emit('loading', false);
        //    }
        //});


    }


    filterObj() {
        var _self = this;
        var obj = _self.state.games;
        var filterobj = _self.state.filterObj;
        var result = null;
        if (filterobj.consoles.length == 0 && filterobj.genres.length == 0 && filterobj.search == "") {
            result = obj;
        } else {
            var re = new RegExp(filterobj.search.toLowerCase(), 'g');
            result = obj.filter(p => (p.consoles.some(r => filterobj.consoles.includes(r.key)) || filterobj.consoles.length == 0) && (p.genres.some(r => filterobj.genres.includes(r.key)) || filterobj.genres.length == 0) && ((p.name.toLowerCase().match(re) != null && filterobj.search != "") || filterobj.search == ""));
        }

        const registerPerPage = 10;
        var resultsliced = result.slice(_self.state.page * registerPerPage, _self.state.page * registerPerPage + registerPerPage);

        var returnarray = _self.state.gamesfiltered.concat(resultsliced);
        if (resultsliced.length > 0) {
            DeviceEventEmitter.emit('loading', false);
            _self.setState({ gamesfiltered: returnarray, page: _self.state.page + 1 },
                () => {
                    process = false;
                }
            );
        } else {
            process = true;
        }
    }
    _onRefresh(event) {
        var _self = this;

        DeviceEventEmitter.emit('loading', true);
        _self.setState({ page: 1, games: [], processing: true },
            () => {
                _self.loadData();
            }
        );

        //getGames(1).then(p => {
        //    console.log("LIST GAMES: ", p);
        //    if (p.List != null) {
        //        _self.setState({ page: 1, games: p.List, processing: false },
        //            () => {
        //                DeviceEventEmitter.emit('loading', false);
        //                //_self.filterObj();
        //            }
        //        );
        //    } else {
        //        DeviceEventEmitter.emit('loading', false);
        //    }
        //}).catch(() => {

        //});
    }

    onScrollEnd(event) {
        var _self = this;
        console
        if (!process) {
            process = true;

            var page = this.state.page + 1;

            _self.setState({ page: page, processing: true, isRefreshing: false },
                () => {
                    _self.loadData();
                }
            );

            //getGames(page).then(p => {
            //    console.log("LIST GAMES: ", p);
            //    if (p.List != null) {

            //        var games = _self.state.games.concat(p.List);
            //        _self.setState({ page: page, games: games },
            //            () => {

            //                process = false;
            //                //_self.filterObj();
            //            }
            //        );
            //    }
            //}).catch(() => {

            //});
        }
    }
    renderConsoles = (item, key) => {
        let content = [];
        for (let i = 0; i < item.length; i++) {
            content.push(<Image key={i} source={{ uri: item[i].img }} resizeMode={'contain'} style={styles.logo} />);
        }
        return content;
    }
    checkLoading = async (event) => {
        //DeviceEventEmitter.emit('hideFilter', true);
        //var _self = this;
        //const scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
        //const height = Math.floor(event.nativeEvent.contentSize.height);
        //if (scrollHeight >= height / 2) {

        //    if (!process) {
        //        process = true;
        //        _self.filterObj();

        //    }
        //}
    }
    showGame = (key) => {
        NavigationService.navigate('GameDetail', { key: key });
    }
    renderThumb = (item) => {
        //if (item.key == "" || item.file == null)
        //    return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'center'} style={{ width: '100%', height: columnWidth }} />);
        //else {
        //    return (<Image source={{ uri: item.url }} style={{ height: columnWidth / item.file.width * item.file.height }} />);
        //}
        var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=';

        if (item == null) {
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'center'} style={{ width: '100%', height: columnWidth }} />);
        } else {
            return (<Image source={{ uri: item[0].img }} style={{ width: '100%', height: columnWidth / item[0].width * item[0].height }} />);
        }
    }
    _renderlist() {
        if (this.state.games != null) {
            return (
                <MasonryList
                    onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                    onScrollBeginDrag={this.checkLoading.bind(this)}
                    onScrollEndDrag={this.checkLoading.bind(this)}
                    refreshControl={(<RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        tintColor="#FFFFFF"
                        title="Loading..."
                        titleColor="#CCCCCC"
                        colors={['#FFFFFF', '#CCCCCC', '#EEEEEE']}
                        progressBackgroundColor="#48A2F8"
                    />)}
                    data={this.state.games}
                    renderItem={({ item }) =>
                        (
                            <TouchableHighlight underlayColor="transparent" onPress={() => this.showGame(item._id)} key={item._id}>
                                <View key={item._id} style={styles.card}>
                                    {this.renderThumb(item.img)}
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardText}>{item.name}</Text>
                                    </View>
                                    <View style={styles.logosBox}>
                                        {this.renderConsoles(item.consoles, item.key)}
                                    </View>
                                </View>
                            </TouchableHighlight>
                        )}
                    getHeightForItem={({ item }) => 300}
                    numColumns={2}
                    keyExtractor={item => item._id}
                />
            );
        } else {
            return (
                <View style={styles.emptyFeedbackBox}>
                    <Text style={styles.emptyFeedback}>Não há nenhum game cadastro!</Text>
                </View>
            );
        }
    }
    render() {
        return <View style={styles.container}>
            {this._renderlist()}
            <Header style={styles.header} type={"search"} />
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 60
    },
    header: {
        zIndex: 100,
    },
    logosBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    logo: {
        width: '20%',
        height: 20,
        margin: 4
    },
    card: {
        margin: 5,
        backgroundColor: "#222",
        borderRadius: 5,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#222",
        borderBottomWidth: 2,
        borderBottomColor: '#48A2F8'
    },
    cardHeader: {
        padding: 4
    },
    cardText: {
        padding: 5,
        color: "#FFF",
        fontSize: 20
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