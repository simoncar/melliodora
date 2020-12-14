import { applyMiddleware, createStore} from "redux";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
// import thunk from "redux-thunk";
import mySaga from "./sagas";

import rootReducer from "./index";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

if (__DEV__) {
  // middlewares.push(createLogger());
}

export const store = createStore(rootReducer, undefined, composeWithDevTools(applyMiddleware(...middlewares)));

export const persistor = persistStore(store);

// then run the saga
sagaMiddleware.run(mySaga);
