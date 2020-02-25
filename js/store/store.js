import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist'
import thunk from "redux-thunk";

import rootReducer from './index';

const middlewares = [thunk];

if (__DEV__) {
    middlewares.push(createLogger());
}

export const store = createStore(
    rootReducer,
    undefined,
    composeWithDevTools(applyMiddleware(...middlewares)),
);

export const persistor = persistStore(store);