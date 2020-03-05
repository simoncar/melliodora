import { all } from "redux-saga/effects";

import { settingsSaga } from "./settings";
import { authSaga } from "./auth";
import { communitySaga } from "./community"

export default function* rootSaga() {
    yield all([
        settingsSaga(),
        authSaga(),
        communitySaga()
    ])
}