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
import DomainSelection from "./DomainSelection";
import * as firebase from "firebase";
import Constants from "expo-constants";
import * as Localization from "expo-localization";

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      selectedDomain: "",
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

  async componentWillMount() {
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
    } else {
      AsyncStorage.getItem("domain").then(d => {
        const domain = JSON.parse(d);


        console.log("domain=", domain);
        if (domain && domain.node) {
          this.setSelectedDomain(domain.node);
        }
      });
    }

    this.setState({ isReady: true });
  }

  setSelectedDomain = d => {
    const domain = d || "";
    console.log("setSelectedDomain - d = ", d);
    const domainDataArr = this.getSelectedDomainData(domain, this.domains);
    if (domainDataArr.length < 1) return;
    AsyncStorage.setItem("domain", JSON.stringify(domainDataArr[0]));
    global.domain = domain;
    this.setState({ selectedDomain: domain, isReady: true });
    switch (domain) {
      case "sais_edu_sg":
        global.switch_address =
          "Locations: \nFranklin Ground Floor (level 2), by Stamford Yard \nEarly Learning Village, Level 1\nHours: 8 am to 5 pm";
        global.switch_helpEmail = "pta.comms@sais.edu.sg";
        global.switch_contactEmail = "help@sais.edu.sg";
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
      case "0002-singaporepoloclub":
        global.switch_address = "Polo Club \nSingapore  00000";
        global.switch_helpEmail = "simoncar+spc@gmail.com";
        global.switch_contactEmail = "test@test.com";
        global.switch_portalName = "Polo Contacts";
        global.switch_portalURL = "https://polocontacts.com/";
        global.switch_call = "+65 0000 0000";
        break;
      default:
        global.switch_address = "not specified -";
    }
  };

  render() {
    console.log("Constants.manifest.extra.instance2", Constants.manifest.extra.instance);
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    else if (!this.state.selectedDomain) {
      return <DomainSelection setSelectedDomain={this.setSelectedDomain} domains={this.domains} />;
    } else {
      return <SetupEnv />;
    }

  }
}

class SetupEnv extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }

  async componentWillMount() {
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
        global.administrator = true;
      }
    });

    // this.setState({ isReady: true });
    this._retrieveFeatures();
    this.SetupUser();
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

  initUser = async (user, isAnonymous) => {
    var uid = user.uid;
    console.log("Auth = ", uid);

    // store the auth as a valid user
    global.uid = uid;
    await firebase
      .firestore()
      .collection(global.domain)
      .doc("user")
      .collection("usernames")
      .doc(uid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          var docData = doc.data();

          if (_.isString(docData.name)) {
            AsyncStorage.setItem("name", docData.name);
            global.name = docData.name;
          } else {
            global.name = "";
          }

          if (_.isString(docData.email)) {
            AsyncStorage.setItem("email", docData.email);
            global.email = docData.email;
          } else {
            global.email = "";
          }
          if (_.isBoolean(docData.authenticated)) {
            if (docData.authenticated) {
              global.authenticated = true;
            } else {
            }
          } else {
            global.authenticated = false;
          }

          if (_.isArray(docData.gradeNotify)) {
            for (var i = -4; i < 13; i++) {
              if (_.isNumber(docData.gradeNotify[i])) {
              }
            }
            AsyncStorage.setItem("gradeNotify", JSON.stringify(docData.gradeNotify));
          }
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
      uid: uid,
      token,
      safeToken,
      loginCount: firebase.firestore.FieldValue.increment(1),
      languageSelected: global.language,
      phoneLocale: Localization.locale,
      version: version,
      lastLogin: Date.now(),
      isAnonymous,
      email: user.email
    };
    console.log("uid=", uid);

    firebase
      .firestore()
      .collection(global.domain)
      .doc("user")
      .collection("usernames")
      .doc(uid)
      .set(userDict, { merge: true });

    console.log("setting ready...");
    this.setState({ isReady: true });
  }

  SetupUser = () => {
    try {
      console.log("SetupUser");
      firebase.auth().onAuthStateChanged(user => {

        if (!user) {
          console.log("signing in");
          this.anonymouslySignIn();
        } else {
          console.log("user found", JSON.stringify(user));
          const isAnonymous = user.isAnonymous;
          if (user && !isAnonymous) {
            console.log("global.domain node", global.domain);
            user.getIdTokenResult()
              .then((idTokenResult) => {
                console.log("claims", idTokenResult.claims)
                console.log("idTokenResult.claims[global.domain]", idTokenResult.claims[global.domain]);
                console.log("global.domain", global.domain);
                if (idTokenResult.claims[global.domain]) {
                  this.initUser(user, isAnonymous);
                } else {
                  this.anonymouslySignIn();

                }
              });
          } else if (user && isAnonymous) {
            console.log("annoy user");
            this.initUser(user, isAnonymous);
          }
        }

      });
    } catch (e) {
      console.log("catch error body:", e.message);
    }
  }

  _retrieveFeatures = async () => {
    try {
      global.moreFeatures = [];

      firebase
        .firestore()
        .collection(global.domain)
        .doc("config")
        .get()
        .then(doc => {
          if (doc.exists) {
            const docData = doc.data();
            if (docData.moreListings) global.moreFeatures = docData.moreListings;
          } else {
            console.log("No such contacts config");
          }
        });
    } catch (error) {
      // Error retrieving data
    }
  };

  render() {
    if (!this.state.isReady) {
      console.log("....waiting....");
      return <AppLoading />;
    }
    console.log("....running....");
    return (
      <StyleProvider style={getTheme(variables)}>
        <Root>
          <App />
        </Root>
      </StyleProvider>
    );
  }
}
