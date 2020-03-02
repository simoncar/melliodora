import { all } from "redux-saga/effects";

import { settingsSaga } from "./settings";
import { authSaga } from "./auth";

export default function* rootSaga() {
    yield all([
        settingsSaga(),
        authSaga()
    ])
}