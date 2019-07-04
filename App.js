import React, { Component } from "react";

import Setup from "./js/setup";

import "@firebase/firestore";

import Firebase from "./js/lib/firebase";
import Constants from "expo-constants";
import Sentry from "sentry-expo";

Sentry.config(
  "https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405"
).install();

export const setExtraContext = () => {
  Sentry.setExtraContext({
    store: store.getState()
  });
};
export const setTagsContext = (ctx: "env-simulator") => {
  Sentry.setTagsContext({
    environment: ctx.environment
  });
};

Sentry.captureMessage("App started V" + Constants.manifest.version);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    try {
      Firebase.initialise();
    } catch (e) {
      console.log("firebase error", e.message);
      //console.error(e.message);
    }
  }

  render() {
    console.disableYellowBox = true;
    return <Setup />;
  }
}
