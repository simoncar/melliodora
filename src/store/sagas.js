import { all, take } from "redux-saga/effects";

import { settingsSaga } from "./settings";
import { authSaga } from "./auth";
import { communitySaga } from "./community"
import { authPortalSaga } from "./authPortal"
import { REHYDRATE } from 'redux-persist'

export default function* rootSaga() {
    yield take(REHYDRATE); // Wait for rehydrate to prevent sagas from running with empty store
    yield all([
        settingsSaga(),
        authSaga(),
        communitySaga(),
        authPortalSaga()
    ])
}