import React from "react";
import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import DomainSelection from "./DomainSelection";
import LoginScreen from "./components/auth/LoginScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: { headerMode: 'none' },
});

const AuthStack = createStackNavigator(
  {
    DomainSelection: {
      screen: screenProps => {
        return <DomainSelection domains={screenProps.screenProps.domains} setSelectedDomain={screenProps.screenProps.setSelectedDomain} />
      }
    },
    LoginScreen: LoginScreen,

  },
  config  ,
);

AuthStack.path = "";

export default createAppContainer(AuthStack);
