import React, { Component } from "react";
import { StyleProvider, Root } from "native-base";
import { I18nManager, AsyncStorage, View, Text } from "react-native";
import App from "./App";
import I18n from "./lib/i18n";
import variables from "../native-base-theme/variables/commonColor";
import getTheme from "../native-base-theme/components";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import _ from "lodash";
import "@firebase/firestore";
import Firebase from "./lib/firebase";
import AuthStackNavigator from "./AuthStackNavigator";
import * as firebase from "firebase";
import Constants from "expo-constants";
import * as Localization from "expo-localization";
import { connect } from 'react-redux';
import CommunityCreateScreen from "./CommunityCreateScreen";

//redux
import { retrieveFeatures } from "./store/settings";
import { setUserInfo, actionCheckAdmin, setIsAdmin } from "./store/auth";
import { actionSetSelectedCommunity } from "./store/community";

class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  getDomains = () =>
    new Promise(function (resolve, reject) {
      firebase
        .firestore()
        .collection("domains")
        .orderBy("name")
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log("No notifications");
            return;
          }

          const domainsStore = [];
          snapshot.forEach(doc => {
            item = doc.data();
            domainsStore.push(item);
          });
          resolve(domainsStore);
        });
    });

  getSelectedDomainData = (selectedDomain, domains) => {
    const domainData = domains.filter(item => item.node == selectedDomain);
    return domainData;
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
      Ionicons: require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
    });

    this.domains = await this.getDomains();

    console.log("Constants.manifest.extra.instance", Constants.manifest.extra.instance);
    if (Constants.manifest.extra.instance) {
      this.setSelectedDomain(Constants.manifest.extra.instance);
    }


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
      I18n.fish = language;
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
        this.props.dispatch(setIsAdmin(true));
      }
    });

    // this.setState({ isReady: true });
    this.setupUser();

    this.setState({ isReady: true });
  }

  setupUser = () => {
    try {
      console.log("SetupUser");
      firebase.auth().onAuthStateChanged(user => {
        console.log("user", user);
        if (!user) {
          this.anonymouslySignIn();
        } else {
          const isAnonymous = user.isAnonymous;
          if (user) {
            this.initUser(user, isAnonymous);
          }
        }
      });
    } catch (e) {
      console.log("catch error body:", e.message);
    }
  }

  anonymouslySignIn = async () => {
    console.log("signInAnonymously...")
    await firebase
      .auth()
      .signInAnonymously()
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  }

  initUser = (user, isAnonymous) => {
    var uid = user.uid;
    console.log("Auth = ", uid);

    // store the auth as a valid user
    global.uid = uid;
    firebase
      .firestore()
      .collection("registeredUsers")
      .doc(uid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          const docData = doc.data();
          global.userInfo = docData;
          this.props.dispatch(setUserInfo(docData));
        }
      });

    var token = global.pushToken;

    if (_.isNil(token)) {
      token = "";
    }
    var safeToken = global.safeToken;

    if (_.isNil(safeToken)) {
      safeToken = "";
    }

    console.log("Auth2 = ", uid, global.authenticated, global.name, global.email);
    var version = _.isNil(Constants.manifest.revisionId) ? "unknown" : Constants.manifest.revisionId;
    var userDict = {
      token,
      safeToken,
      loginCount: firebase.firestore.FieldValue.increment(1),
      languageSelected: global.language,
      phoneLocale: Localization.locale,
      version: version,
      lastLogin: Date.now(),
      isAnonymous
    };
    console.log("uid=", uid);

    firebase
      .firestore()
      .collection("registeredUsers")
      .doc(uid)
      .set(userDict, { merge: true });

    console.log("setting ready...");
    this.setState({ isReady: true });
  }

  setSelectedDomain = d => {
    const domain = d || "";
    console.log("setSelectedDomain - d = ", d);
    const domainDataArr = this.getSelectedDomainData(domain, this.domains);
    if (domainDataArr.length < 1) return;
    global.domain = domain;

    this.props.dispatch(actionSetSelectedCommunity(domainDataArr[0]));
    this.setState({ isReady: true });

    switch (domain) {
      case "sais_edu_sg":
        global.switch_portalName = "myStamford";
        global.switch_tab_portalName = "myS";
        global.switch_portalURL = "https://mystamford.edu.sg/parent-dashboard";
        global.switch_webportalActions = [
          { Home: "https://mystamford.edu.sg/parent-dashboard" },
          { "Cafe Top-Up": "https://mystamford.edu.sg/cafe/cafe-online-ordering" },
          { Events: "https://mystamford.edu.sg/events-1" },
          { Forms: "https://mystamford.edu.sg/forms-1" },
          { PTA: "https://mystamford.edu.sg/pta" },
          { Logout: "https://mystamford.edu.sg/logout" },
        ];
        global.switch_call = "+65 6709 4800";
        break;
      case "ais_edu_sg":
        global.switch_portalURL =
          "https://connect.ais.com.sg/login/login.aspx?prelogin=https%3a%2f%2fconnect.ais.com.sg%2f&kr=iSAMS:ParentPP";
        global.switch_portalName = "AIS Connect";
        global.switch_tab_portalName = "Connect";
        global.switch_webportalActions = [
          { Home: "" },
          { "Cafe Top-Up": "" },
          { Events: "" },
          { Forms: "" },
          { PTA: "" },
          { Logout: "" },
        ];
        break;
      case "camp_asia":
        global.switch_portalURL = "https://www.campasia.asia/online-booking/login";
        global.switch_webportalActions = [
          { Home: "" },
          { "Cafe Top-Up": "" },
          { Events: "" },
          { Forms: "" },
          { PTA: "" },
          { Logout: "" },
        ];
        global.switch_homeLogoURI =
          "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/smartcommunity%2Fcommunitylogo%2FCA_ID_Reverse_new.png?alt=media&token=54fbd759-31f5-46bb-a73f-6424db99d5dd";
        break;
      default:
    }
  };

  render() {
    console.log("Constants.manifest.extra.instance2", Constants.manifest.extra.instance);
    const selectedDomain = this.props.community.selectedCommunity.node;
    if (!this.state.isReady) {
      return <AppLoading />;
    } else if (this.props.communityCreation.communityCreate) {
      return <CommunityCreateScreen />
    }
    else if (!selectedDomain) {
      return <AuthStackNavigator
        screenProps={{
          domains: this.domains,
          setSelectedDomain: this.setSelectedDomain
        }}
      />
    } else {
      // check if user is admin
      this.props.dispatch(actionCheckAdmin(selectedDomain));
      return <App />;
    }

  }
}

const mapStateToProps = state => ({
  communityCreation: state.communityCreation,
  community: state.community
});
export default connect(mapStateToProps)(Setup);