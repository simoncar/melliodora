import React, { Component } from "react";
import Setup from "./js/setup";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import _ from "lodash";

// Node modules check latest
// npm-check

if (Constants.isDevice) {
  Sentry.init({
    dsn: Constants.manifest.extra.sentryDSN,
    enableInExpoDevelopment: true,
    debug: true
  });

  Sentry.captureMessage("App started V" + Constants.manifest.version);
}
export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.disableYellowBox = true;

    return <Setup />;
  }
}
