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


export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      selectedDomain: ""
    };
  }

  getDomains = () => new Promise(function (resolve, reject) {
    firebase
      .firestore()
      .collection("domains")
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
  }
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

    AsyncStorage.getItem("domain").then(d => {
      const domain = JSON.parse(d);
      this.setSelectedDomain(domain.node);
    });
    this.setState({ isReady: true });
  }

  setSelectedDomain = (d) => {
    const domain = d || "";
    const domainDataArr = this.getSelectedDomainData(domain, this.domains)
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
        global.switch_portalURL =
          "https://mystamford.edu.sg/parent-dashboard";
        global.switch_call = "+65 6709 4800";
        break;
      case "ais_edu_sg":
        global.switch_portalURL =
          "https://connect.ais.com.sg/login/login.aspx?prelogin=https%3a%2f%2fconnect.ais.com.sg%2f&kr=iSAMS:ParentPP";
        global.switch_portalName = "AIS Connect";
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
  }

  render() {

    if (!this.state.isReady) {
      return <AppLoading />;
    }

    if (this.state.selectedDomain == "") {
      return <DomainSelection setSelectedDomain={this.setSelectedDomain} domains={this.domains} />
    }
    return (
      <SetupEnv />
    );
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
    try {
      await Firebase.SetupUser();
    } catch (e) {
      console.log("firebase error", e.message);
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
          <App />
        </Root>
      </StyleProvider>
    );
  }
}