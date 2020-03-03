import React from "react";
import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import DomainSelection from "./components/starting/DomainSelection";
import LoginScreen from "./components/auth/LoginScreen";
import SignUpScreen from "./components/auth/SignUpScreen";
import PreWelcomeScreen from "./components/starting/PreWelcomeScreen";
import WelcomeScreen from "./components/starting/WelcomeScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const AuthStack = createStackNavigator(
  {
    DomainSelection: {
      screen: screenProps => {
        return <DomainSelection domains={screenProps.screenProps.domains} setSelectedDomain={screenProps.screenProps.setSelectedDomain} navigation={screenProps.navigation} />
      },
      navigationOptions: {
        header: null
      },
    },
    preWelcome: PreWelcomeScreen,
    login: LoginScreen,
    signup: SignUpScreen,
    welcomeScreen: WelcomeScreen

  },
  config  ,
);

AuthStack.path = "";

export default createAppContainer(AuthStack);