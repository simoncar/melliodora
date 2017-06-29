import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './js/reducers'
import Setup from './js/setup';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

import Sentry from 'sentry-expo';
Sentry.config('https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405').install();

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
  render() {

  	console.disableYellowBox = true;
    return (
      <Setup />
    );
  }
}
