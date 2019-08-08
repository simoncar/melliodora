import React, { Component } from "react";
import { Provider } from "react-redux";
import { StyleProvider, Root } from "native-base";
import { I18nManager, AsyncStorage } from "react-native";
import App from "./App";
import I18n from "./lib/i18n";
import configureStore from "./configureStore";
import variables from "../native-base-theme/variables/commonColor";
import getTheme from "../native-base-theme/components";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import _ from "lodash";
import "@firebase/firestore";
import * as firebase from "firebase";
import Firebase from "./lib/firebase";

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      store: configureStore(() => this.setState({ isLoading: false })),
      isReady: false,
    };
  }

  async componentWillMount() {
    try {
      await Firebase.initialise();
    } catch (e) {
      console.log("firebase error", e.message);
      //console.error(e.message);
    }

    Font.loadAsync({
      "Material Icons": require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
      MaterialIcons: require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
      Ionicons: require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
      //Ionicons: require('/@expo/vector-icons/fonts/Ionicons.ttf'),
      //'Material Icons': require('/@expo/vector-icons/fonts/MaterialIcons.ttf'),
    });

    await AsyncStorage.getItem("language").then(language => {
      if (!_.isString(language)) {
        language = "en";
        AsyncStorage.setItem("language", language);
      }
      if (language === "ar") {
        I18nManager.forceRTL(true);
        if (!I18nManager.isRTL) {
          Updates.reloadFromCache();
        }
      } else {
        I18nManager.forceRTL(false);
        if (I18nManager.isRTL) {
          Updates.reloadFromCache();
        }
      }
      I18n.locale = language;
      global.language = language;
    });

    await AsyncStorage.getItem("email").then(email => {
      global.email = _.isString(email) ? email : "";
    });
    await AsyncStorage.getItem("name").then(name => {
      global.name = _.isString(name) ? name : "";
    });
    await AsyncStorage.getItem("authenticated").then(authenticatedString => {
      var authenticated = authenticatedString == "true";
      global.authenticated = authenticated;
      console.log("authenticated=", authenticated);
    });
    await AsyncStorage.getItem("adminPassword").then(adminPassword => {
      global.adminPassword = adminPassword;
      console.log("adminPassword=", adminPassword);
      if (adminPassword == "cookies") {
        global.administrator = true;
      }
    });

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      console.log("....waiting....");
      return <AppLoading />;
    }
    console.log("....running....");
    return (
      <StyleProvider style={getTheme(variables)}>
        <Root>
          <Provider store={this.state.store}>
            <App />
          </Provider>
        </Root>
      </StyleProvider>
    );
  }
}
