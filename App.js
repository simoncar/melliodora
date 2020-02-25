import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Setup from "./js/setup";
import Constants from "expo-constants";
//import Sentry from "sentry-expo";
import _ from "lodash";

import { store, persistor } from './js/store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

//Sentry.config("https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405").install();

// Sentry.init({
//   dsn: "https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405",
//   enableInExpoDevelopment: true,
//   debug: true,
// });

// Node modules check latest
// npm-check

// export const setTagsContext = (ctx: "env-simulator") => {
//   Sentry.setTagsContext({
//     environment: ctx.environment,
//   });
// };

//Sentry.captureMessage("App started V" + Constants.manifest.version);

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  renderLoading = () => (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
  render() {
    //console.disableYellowBox = true;
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={this.renderLoading()}>
          <Setup />
        </PersistGate>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
