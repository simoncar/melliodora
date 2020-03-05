import firebase from "firebase";
import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import _ from "lodash";
import Constants from "expo-constants";
import * as Localization from "expo-localization";

// ACTIONS
export const SET_USER_INFO = 'SET_USER_INFO';
export const CHECK_ADMIN = 'CHECK_ADMIN';
export const SET_IS_ADMIN = 'SET_IS_ADMIN';
export const SET_ADMIN_PASS = "SET_ADMIN_PASS";
export const SETUP_AUTH = "SETUP_AUTH";
export const ANONYMOUSLY_SIGN_IN = "ANONYMOUSLY_SIGN_IN";
export const INIT_USER = "INIT_USER";

// Action Creators
export const setUserInfo = (userInfo, updateDB = false) => {
    if (updateDB) {
        firebase
            .firestore()
            .collection("users")
            .doc(userInfo.uid)
            .set(userInfo, { merge: true });
    }
    return ({
        type: SET_USER_INFO,
        userInfo,
    })
};

export const actionCheckAdmin = (community) => ({
    type: CHECK_ADMIN,
    community
});

export const setIsAdmin = (isAdmin) => ({
    type: SET_IS_ADMIN,
    isAdmin
})

export const setAdminPass = adminPassword => ({
    type: SET_ADMIN_PASS,
    adminPassword
})

export const setupAuth = () => ({
    type: SETUP_AUTH
})
export const actionSignInAnonymously = () => ({
    type: ANONYMOUSLY_SIGN_IN
})

export const actionInitUser = (user, isAnonymous) => ({
    type: INIT_USER,
    user,
    isAnonymous
})


const getCurrentUserClaims = () => {
    return firebase.auth().currentUser.getIdTokenResult();
}

anonymouslySignIn = () => {
    return firebase
        .auth()
        .signInAnonymously();
}

// worker Saga
function* WORKER_checkAdmin(action) {
    try {
        const adminPassword = yield select(state => state.auth.adminPassword);
        global.adminPassword = adminPassword;
        console.log("adminPassword=", adminPassword);
        if (adminPassword == "cookies") {
            yield put(setIsAdmin(true));
            return;
        }

        const community = action.community;
        console.log("WORKER_checkAdmin", community);

        // const { claims } = yield call(getCurrentUserClaims);
        const adminUIDs = yield select(state => state.community.selectedCommunity.admins)
        const userUID = yield select(state => state.auth.userInfo.uid);


        if (Array.isArray(adminUIDs) && adminUIDs.indexOf(userUID) > -1) {
            yield put(setIsAdmin(true));
        } else {
            yield put(setIsAdmin(false));
        }
    } catch (e) {
        console.log(e);
    }
}

function* WORKER_anonymouslySignIn(action) {
    try {
        yield call(anonymouslySignIn);
    } catch (e) {
        console.log(e);
    }
}

function* WORKER_initUser(action) {
    try {
        const { user, isAnonymous } = action;

        const uid = user.uid;
        console.log("Auth = ", uid);

        // store the auth as a valid user
        global.uid = uid;

        var token = global.pushToken;

        if (_.isNil(token)) {
            token = "";
        }
        var safeToken = global.safeToken;

        if (_.isNil(safeToken)) {
            safeToken = "";
        }

        var version = _.isNil(Constants.manifest.revisionId) ? "unknown" : Constants.manifest.revisionId;
        var userDict = {
            token,
            safeToken,
            loginCount: firebase.firestore.FieldValue.increment(1),
            languageSelected: global.language,
            phoneLocale: Localization.locale,
            version: version,
            lastLogin: Date.now(),
            isAnonymous
        };

        yield call(() => firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .set(userDict, { merge: true }));

        const doc = yield call(() => firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get());

        if (!doc.exists) {
            console.log("No such document!");
        } else {
            const docData = doc.data();

            global.userInfo = docData;
            yield put(setUserInfo(docData));
        }
    } catch (e) {
        console.log(e);
    }
}

//  Watcher
export function* authSaga() {
    yield takeLatest(CHECK_ADMIN, WORKER_checkAdmin);
    yield takeLatest(ANONYMOUSLY_SIGN_IN, WORKER_anonymouslySignIn);
    yield takeLatest(INIT_USER, WORKER_initUser);
}

const initialState = {
    user: false,
    userInfo: {},
    isAdmin: false,
    adminPassword: ""
};

// REDUCER
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: { ...state.userInfo, ...action.userInfo },
            };
        case SET_IS_ADMIN:
            return {
                ...state,
                isAdmin: action.isAdmin,
            };
        case SET_ADMIN_PASS:
            return {
                ...state,
                adminPassword: action.adminPassword,
            };
        default:
            return state;
    }
};