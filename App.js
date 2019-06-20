import React, { Component } from 'react';

import { createLogger } from 'redux-logger'

import Setup from './js/setup';

import firebase from "firebase";
import '@firebase/firestore';

import Firebase from "./js/lib/firebase";
import Constants from 'expo-constants'
import Sentry from 'sentry-expo';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

Sentry.config('https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405').install();
var switches = [];

export const setExtraContext = () => {
  Sentry.setExtraContext({
    store: store.getState(),
  });
};
export const setTagsContext = (ctx: 'env-simulator') => {
  Sentry.setTagsContext({
    environment: ctx.environment,
  });
};

export const setUserContext = (ctx: "user-simon") => {
  Sentry.setUserContext(ctx);
};

Sentry.captureMessage('App started V' + Constants.manifest.version);

export default class App extends React.Component {

  constructor(props) {
     super(props);
    Firebase.initialise();
  }

  render() {

    console.disableYellowBox = true;
    
    return (
      <Setup />
    );
  }
}
