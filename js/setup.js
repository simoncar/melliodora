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

import { connect } from 'react-redux';


//redux
import { actionSignInAnonymously, actionInitUser, setIsAdmin } from "./store/auth";
import { actionSetSelectedCommunity } from "./store/community";

class Setup extends Component {
  constructor() {
    super();
  }
  state = {
    loading: true
  };

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


    let language = await AsyncStorage.getItem("language");
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

    const email = await AsyncStorage.getItem("email");
    global.email = _.isString(email) ? email : "";

    const name = await AsyncStorage.getItem("name");
    global.name = _.isString(name) ? name : "";

    this.setState({ loading: false });
    this.setupUser();

    if (Constants.manifest.extra.instance == "sais_edu_sg") {
      console.log("domain passed in app.json");
      const dict = {
        name: Constants.manifest.extra.instance,
        node: Constants.manifest.extra.instance,
        admins: [this.props.auth.userInfo.uid]
      };

      this.props.dispatch(actionSetSelectedCommunity(dict));
    }
  }

  setupUser = () => {
    try {
      firebase.auth().onAuthStateChanged(user => {
        console.log("SetupUser", user);
        if (!user) {
          this.props.dispatch(actionSignInAnonymously());
        } else {
          const isAnonymous = user.isAnonymous;
          this.props.dispatch(actionInitUser(user, isAnonymous));
        }
      });
    } catch (e) {
      console.log("catch error body:", e.message);
    }
  };

  render() {
    if (this.state.loading || !this.props.auth.userInfo || _.isEmpty(this.props.auth.userInfo)) {
      return <AppLoading />;
    } else if (_.isEmpty(this.props.community.selectedCommunity) || this.props.community.selectedCommunity.node.length == 0) {
      console.log("AuthStackNavigator");
      return <AuthStackNavigator />;
    } else {
      console.log("App");
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
