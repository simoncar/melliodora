import firebase from "firebase";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";


// ACTIONS
export const SET_USER_INFO = 'SET_USER_INFO';
export const CHECK_ADMIN = 'CHECK_ADMIN';
export const SET_IS_ADMIN = 'SET_IS_ADMIN';

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


const getCurrentUserClaims = () => {
    return firebase.auth().currentUser.getIdTokenResult();
}

// worker Saga
function* WORKER_checkAdmin(action) {
    try {
        const community = action.community;
        console.log("WORKER_checkAdmin", community);

        const { claims } = yield call(getCurrentUserClaims);

        if (claims["ADMIN_" + community]) {
            yield put(setIsAdmin(true));
        } else {
            yield put(setIsAdmin(false));
        }
    } catch (e) {
        console.log(e);
    }
}

//  Watcher
export function* authSaga() {
    yield takeLatest(CHECK_ADMIN, WORKER_checkAdmin);
}

const initialState = {
    user: false,
    userInfo: {},
    isAdmin: false
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
        default:
            return state;
    }
};