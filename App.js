import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './js/reducers'
import Setup from './js/setup';

import * as firebase from "firebase";

import Firebase from "./js/lib/firebase";

import Sentry from 'sentry-expo';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

Sentry.config('https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405').install();

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

Sentry.captureMessage('App started V21.6.1!');

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
    ),
  );
  return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

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
