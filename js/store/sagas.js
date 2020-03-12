import { all, take } from "redux-saga/effects";

import { settingsSaga } from "./settings";
import { authSaga } from "./auth";
import { communitySaga } from "./community"
import { REHYDRATE } from 'redux-persist'

export default function* rootSaga() {
    console.log("Waiting for rehydration")
    yield take(REHYDRATE); // Wait for rehydrate to prevent sagas from running with empty store
    console.log("Rehydrated")
    yield all([
        settingsSaga(),
        authSaga(),
        communitySaga()
    ])
}