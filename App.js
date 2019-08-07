import React, { Component } from "react";
import Setup from "./js/setup";
import { I18nManager, AsyncStorage } from "react-native";
import I18n from "./js/lib/i18n";
import "@firebase/firestore";
import * as firebase from "firebase";
import Firebase from "./js/lib/firebase";
import Constants from "expo-constants";
import Sentry from "sentry-expo";
import { Updates } from "expo";
import _ from "lodash";

Sentry.config("https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405").install();

// Node modules check latest
// npm-check

export const setTagsContext = (ctx: "env-simulator") => {
  Sentry.setTagsContext({
    environment: ctx.environment,
  });
};

// TODO: Persist navigation state

Sentry.captureMessage("App started V" + Constants.manifest.version);

export default class App extends Component {
  constructor(props) {
    super(props);
    try {
      Firebase.initialise();
    } catch (e) {
      console.log("firebase error", e.message);
      //console.error(e.message);
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("language").then(language => {
      if (!_.isString(language)) {
        console.log("NO LANGUAGE SET");
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
      console.log("GLOBAL LANGUAGE 1 = ", global.language);
    });
  }

  render() {
    console.disableYellowBox = true;
    return <Setup />;
  }
}
