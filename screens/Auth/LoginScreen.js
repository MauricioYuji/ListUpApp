﻿import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { logInWithFacebook } from '../../components/services/facebookAuth';
import { logIn, storeUser } from '../../components/services/AuthService';
//import * as firebase from 'firebase';
import TabBarIcon from '../../components/UI/TabBarIcon';

export default class LoginScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
    }
    state = {
        secureTextEntry: true, email: '', password: '', errorMessage: null, loading: null, emailSend: false, feedback: null
    };

    componentWillMount() {

        const { navigation } = this.props;
        const feedback = navigation.getParam('feedback', '');
        if (feedback != "")
            this.setState({ feedback: feedback });


    }
    facebooklogin() {
        const _self = this;
        this.setState({ loading: 'facebook' });
        logInWithFacebook().then(p => {
            if (p.success) {
                if (p.type == 0) {
                    var obj = JSON.parse(p.data);
                    obj.token = p.token;
                    DeviceEventEmitter.emit('setUser', obj);
                    _self.setState({ errorMessage: null, feedback: null, loading: null });
                } else {
                    _self.setState({ errorMessage: null, feedback: p.message, emailSend: true, loading: null });
                }
            } else {
                _self.setState({ errorMessage: p.message, loading: null });
            }
        }).catch(() => {
            _self.setState({ errorMessage: p.message, loading: null });
        });
    }
    login() {

        const { email, password } = this.state;
        const _self = this;

        _self.setState({ loading: 'login', errorMessage: null, emailSend: false, feedback: null });
        if (email != "" && password != "") {

            //console.log("LOGIN");
            logIn(email, password).then(p => {
                if (p.success) {

                    if (p.type == 0) {
                        var obj = JSON.parse(p.data);
                        obj.token = p.token;
                        DeviceEventEmitter.emit('setUser', obj);
                        _self.setState({ errorMessage: null, feedback: null, loading: null });
                    } else {
                        _self.setState({ errorMessage: null, feedback: p.message, emailSend: true, loading: null });
                    }
                } else {
                    _self.setState({ errorMessage: p.message, loading: null });
                }
            }).catch(() => {
                _self.setState({ errorMessage: p.message, loading: null });
            });
        } else {

            _self.setState({ loading: null, errorMessage: "Preencha o campo email e senha" });
        }



    }
    sendEmail() {
        //var _self = this;
        //_self.setState({ errorMessage: null, loading: null, emailSend: false });
        this.props.navigation.navigate('ConfirmEmail');
    }
    render() {
        const loadingButton = this.state.loading;
        let error;
        if (this.state.errorMessage !== null) {
            error = <Text style={styles.errorFeedback}>{this.state.errorMessage}</Text>;
        }
        let emailSend;
        emailSend = this.state.emailSend;
        let feedback;
        if (this.state.feedback !== null) {
            feedback = <Text style={styles.feedbackMessage}>{this.state.feedback}</Text>;
        }
        return (
            <View style={styles.container}
                keyboardShouldPersistTaps='handled'>
                <View style={styles.loginBox}>

                    <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={this.state.errorMessage !== null ? styles.inputerror : styles.input}
                            autoCapitalize="none"
                            placeholder="Email"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={this.state.errorMessage !== null ? styles.inputerror : styles.input}
                            autoCapitalize="none"
                            placeholder={this.state.secureTextEntry ? '*****' : 'Senha'}
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                            secureTextEntry={this.state.secureTextEntry}
                        />
                        <TouchableOpacity style={styles.showPassword} onPress={() => this.setState({ secureTextEntry: !this.state.secureTextEntry })}>
                            <Text style={styles.infoText}>MOSTRAR</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.forgottenPassword}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('ResetPassword');
                        }}>
                            <Text style={styles.forgottenPasswordbuttonText}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {error}
                    </View>
                    {emailSend === true ? (
                        <View>
                            <TouchableOpacity onPress={() => this.sendEmail()}>
                                <Text style={styles.sendLink}>Caso não tenha recebido o email, clique aqui para reenviar o email de confirmação.</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                            <View>
                                {feedback}
                            </View>
                        )}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => {
                            this.props.navigation.navigate('Register');
                        }}>
                            <Text style={styles.buttonText}>
                                Criar uma conta
                        </Text>
                        </TouchableOpacity>

                        <View style={[styles.button, styles.buttonPrimary]}>
                            {loadingButton === "login" ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                    <TouchableOpacity onPress={() => {
                                        this.login();
                                    }}>


                                        <Text style={styles.buttonText}>
                                            Entrar
                        </Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                    </View>
                    <View style={styles.divider}>
                        <Text style={styles.dividerText}>OU</Text>
                    </View>
                    <View style={styles.facebookButton}>
                        {loadingButton === "facebook" ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                                <TouchableOpacity onPress={() => { this.facebooklogin(); }} style={styles.buttonGroup}>
                                    <TabBarIcon
                                        size={26}
                                        name={'facebook'}
                                        type={'FontAwesome'}
                                        style={styles.facebooklogo}
                                    />
                                    <Text style={styles.buttonText}>
                                        Entrar com Facebook
                                    </Text>
                                </TouchableOpacity>
                            )}
                    </View>

                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    logo: {
        marginBottom: 60
    },
    forgottenPassword: {
        width: '100%',
        alignItems: 'flex-start',
        margin: 10,
    },
    forgottenPasswordbuttonText: {
        fontSize: 16,
        fontFamily: 'SourceSansPro-Bold',
        textDecorationLine: 'underline',
        color: '#FFF'
    },
    divider: {
        borderBottomColor: '#444444',
        borderBottomWidth: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: 20,
        marginBottom: 0
    },
    dividerText: {
        color: '#FFF',
        backgroundColor: '#111',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
        marginBottom: -12
    },
    loginBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 5,
        position: 'relative'
    },
    showPassword: {
        marginLeft: 5,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 10,
        right: 15,
        bottom: 0,
        zIndex: 100
    },
    infoText: {
        color: '#AAAAAA',
        lineHeight: 30,
        fontSize: 12,
        fontFamily: 'SourceSansPro-Bold',
    },
    input: {
        backgroundColor: '#222',
        width: '100%',
        height: 60,
        marginTop: 10,
        padding: 15,
        color: '#FFF',
        borderRadius: 10
    },
    inputerror: {
        backgroundColor: '#222',
        width: '100%',
        height: 60,
        marginTop: 10,
        padding: 15,
        color: '#FFF',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#D00',
    },
    errorFeedback: {
        color: '#F00',
        margin: 10
    },
    feedbackMessage: {
        color: '#0F0',
        margin: 10
    },
    facebookButton: {
        flexDirection: 'row',
        marginTop: 30,
        backgroundColor: '#3A559F',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 5
    },
    facebooklogo: {
        marginRight: 20
    },
    sendLink: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'SourceSansPro-Bold',
        margin: 10
    },
    buttonGroup: {
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: 'SourceSansPro-Bold'
    },
    button: {
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 5
    },
    buttonPrimary: {
        backgroundColor: '#006CD8',
    },
    buttonSecondary: {
        backgroundColor: '#444444',
    }
});