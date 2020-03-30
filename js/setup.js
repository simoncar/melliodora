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
import { getCommunityDetails } from "./store/community";


//redux
import { signInAnonymously, initUser } from "./store/auth";

class Setup extends Component {
  constructor() {
    super();
  }
  state = {
    loading: true,
  }

  componentDidMount() {
    try {
      Firebase.initialise()
        .then(() => this.props.dispatch({ type: "FIREBASE_READY" }));
    } catch (e) {
      console.log("firebase error", e.message);
    }
    if (Constants.manifest.extra.instance) {
      const node = Constants.manifest.extra.instance;
      this.props.dispatch(getCommunityDetails(node));
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

    this.setState({ loading: false });
  }

  render() {

    if (this.state.loading || !this.props.auth.userInfo || _.isEmpty(this.props.auth.userInfo) || (_.isEmpty(this.props.community.selectedCommunity) && Constants.manifest.extra.instance)) {
      return <AppLoading />;
    }
    else if (_.isEmpty(this.props.community.selectedCommunity)) {
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