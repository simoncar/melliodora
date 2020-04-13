import React from "react";
import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import DomainSelection from "./components/starting/DomainSelection";
import LoginScreen from "./components/auth/LoginScreen";
import SignUpScreen from "./components/auth/SignUpScreen";
import PreWelcomeScreen from "./components/starting/PreWelcomeScreen";
import WelcomeScreen from "./components/starting/WelcomeScreen";
import CommunityCreateScreen from "./components/starting/CommunityCreateScreen"
import ForgotPasswordScreen from "./components/auth/ForgotPasswordScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const AuthStack = createStackNavigator(
  {
    DomainSelection: DomainSelection,
    preWelcome: PreWelcomeScreen,
    login: LoginScreen,
    signup: SignUpScreen,
    welcomeScreen: WelcomeScreen,
    communityCreateScreen: CommunityCreateScreen,
    forgetpassword: ForgotPasswordScreen
  },
  config  ,
);

AuthStack.path = "";

export default createAppContainer(AuthStack);
