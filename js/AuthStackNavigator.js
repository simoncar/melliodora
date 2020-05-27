import React from "react";
import { Platform } from "react-native";
//import { createAppContainer } from "react-navigation";
import { NavigationContainer } from "@react-navigation/native";

//import { createStackNavigator } from "react-navigation-stack";
import { createStackNavigator } from "@react-navigation/stack";

import DomainSelection from "./components/starting/DomainSelection";
import LoginScreen from "./components/auth/LoginScreen";
import SignUpScreen from "./components/auth/SignUpScreen";
import PreWelcomeScreen from "./components/starting/PreWelcomeScreen";
import WelcomeScreen from "./components/starting/WelcomeScreen";
import CommunityCreateScreen from "./components/starting/CommunityCreateScreen"
import ForgotPasswordScreen from "./components/auth/ForgotPasswordScreen";

const Stack = createStackNavigator()

function AuthStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='DomainSelection' component={DomainSelection} />
        <Stack.Screen name='preWelcome' component={PreWelcomeScreen} />
        <Stack.Screen name='login' component={LoginScreen} />
        <Stack.Screen name='signup' component={SignUpScreen} />
        <Stack.Screen name='welcomeScreen' component={WelcomeScreen} />
        <Stack.Screen name='communityCreateScreen' component={CommunityCreateScreen} />
        <Stack.Screen name='forgetpassword' component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// const AuthStack = createStackNavigator(
//   {
//     DomainSelection: DomainSelection,
//     preWelcome: PreWelcomeScreen,
//     login: LoginScreen,
//     signup: SignUpScreen,
//     welcomeScreen: WelcomeScreen,
//     communityCreateScreen: CommunityCreateScreen,
//     forgetpassword: ForgotPasswordScreen
//   },
//   config  ,
// );



export default AuthStackNavigator
