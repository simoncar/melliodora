import React, { Component } from "react";
import Setup from "./js/setup";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import _ from "lodash";

Sentry.init({
  dsn: Constants.manifest.extra.sentryDSN,
  enableInExpoDevelopment: true,
  debug: true
});

// Node modules check latest
// npm-check

export const setTagsContext = (ctx: "env-simulator") => {
  Sentry.setTagsContext({
    environment: ctx.environment
  });
};

if (Constants.isDevice) {
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
