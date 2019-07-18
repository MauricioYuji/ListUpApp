import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import ConfirmEmailScreen from '../screens/Auth/ConfirmEmailScreen';

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen,
    ResetPassword: ResetPasswordScreen,
    ConfirmEmail: ConfirmEmailScreen
},
    {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
    });

export default createAppContainer(createSwitchNavigator({
    Auth: AuthStack,
}));


