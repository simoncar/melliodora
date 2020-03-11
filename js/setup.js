import React, { Component } from "react";
import { I18nManager, AsyncStorage, View, Text } from "react-native";
import App from "./App";
import I18n from "./lib/i18n";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import _ from "lodash";
import "@firebase/firestore";
import Firebase from "./lib/firebase";
import AuthStackNavigator from "./AuthStackNavigator";
import * as firebase from "firebase";
import Constants from "expo-constants";
import { connect } from 'react-redux';

//redux
import { signInAnonymously, initUser } from "./store/auth";

class Setup extends Component {
  constructor() {
    super();
  }
  state = {
    loading: true,
  }

  async componentDidMount() {
    try {
      await Firebase.initialise();
    } catch (e) {
      console.log("firebase error", e.message);
    }

    Font.loadAsync({
      "Material Icons": require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
      MaterialIcons: require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
      Ionicons: require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf")
    });



    let language = this.props.auth.language;
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

    const email = await AsyncStorage.getItem("email")
    global.email = _.isString(email) ? email : "";

    const name = await AsyncStorage.getItem("name");
    global.name = _.isString(name) ? name : "";

    this.setState({ loading: false });
    this.setupUser();

  }

  setupUser = () => {
    try {

      firebase.auth().onAuthStateChanged(user => {
        console.log("SetupUser", user);
        if (!user) {
          this.props.dispatch(signInAnonymously());

        } else {
          const isAnonymous = user.isAnonymous;
          this.props.dispatch(initUser(user, isAnonymous));
        }
      });
    } catch (e) {
      console.log("catch error body:", e.message);
    }
  };


  render() {

    if (this.state.loading || !this.props.auth.userInfo || _.isEmpty(this.props.auth.userInfo)) {
      return <AppLoading />;
    }
    else if (_.isEmpty(this.props.community.selectedCommunity) && !Constants.manifest.extra.instance) {
      return <AuthStackNavigator />
    } else {
      // check if user is admin
      return <App />;
    }

  }
}

const mapStateToProps = state => ({
  communityCreation: state.communityCreation,
  community: state.community,
  auth: state.auth
});
export default connect(mapStateToProps)(Setup);