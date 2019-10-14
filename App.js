import React, { Component } from "react";
import Setup from "./js/setup";
import Constants from "expo-constants";
import Sentry from "sentry-expo";
import _ from "lodash";

//Sentry.config("https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405").install();

Sentry.init({
  dsn: "https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405",
  enableInExpoDevelopment: true,
  debug: true,
});

// Node modules check latest
// npm-check

export const setTagsContext = (ctx: "env-simulator") => {
  Sentry.setTagsContext({
    environment: ctx.environment,
  });
};

Sentry.captureMessage("App started V" + Constants.manifest.version);

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.disableYellowBox = true;
    return <Setup />;
  }
}
