import firebase from "firebase";
import { call, put, takeLatest, select } from "redux-saga/effects";
import _ from "lodash";

// ACTIONS
export const SET_AUTH_NAME = "SET_AUTH_NAME";
export const SET_AUTH_EMAIL = "SET_AUTH_EMAIL";
export const SET_AUTH_ID = "SET_AUTH_ID";
export const SET_AUTH_ROLE = "SET_AUTH_ROLE";
export const SAVE_DETAILS = "SAVE_DETAILS";

// Action Creators
export const setAuthName = (authName) => ({
	type: SET_AUTH_NAME,
	authName,
});

export const setAuthEmail = (authEmail) => ({
	type: SET_AUTH_EMAIL,
	authEmail,
});

export const setAuthID = (authID) => ({
	type: SET_AUTH_ID,
	authID,
});

export const setAuthRole = (authRole) => ({
	type: SET_AUTH_ROLE,
	authRole,
});
SAVE_DETAILS;

export const saveDetails = (name, email, guid, role) => ({
	type: SAVE_DETAILS,
	name,
	email,
	guid,
	role,
});

// worker Saga
function* WORKER_saveDetails(action) {
	try {
		const { name, email, guid, role } = action;
		const uid = yield select((state) => state.auth.userInfo.uid);
		const domain = yield select((state) => state.community.selectedCommunity.node);

		if (!_.isNil(uid) && name.length > 0 && email.length > 0) {
			var userDict = {
				name,
				email,
				guid,
				role,
				authenticated: true,
			};

			yield call(() => firebase.firestore().collection(domain).doc("user").collection("usernames").doc(uid).set(userDict, { merge: true }));

			yield put(setAuthName(name));
			yield put(setAuthEmail(email));
			yield put(setAuthID(guid));
			yield put(setAuthRole(role));
		}
	} catch (e) {
		console.log(e);
	}
}

//  Watcher
export function* authPortalSaga() {
	yield takeLatest(SAVE_DETAILS, WORKER_saveDetails);
}

const initialState = {
	authEmail: "",
	authID: "",
	authRole: "",
	authName: "",
};

// REDUCER
export default (state = initialState, action) => {
	switch (action.type) {
		case SET_AUTH_EMAIL:
			return {
				...state,
				authEmail: action.authEmail,
			};
		case SET_AUTH_ID:
			return {
				...state,
				authID: action.authID,
			};
		case SET_AUTH_ROLE:
			return {
				...state,
				authRole: action.authRole,
			};
		case SET_AUTH_NAME:
			return {
				...state,
				authName: action.authName,
			};
		default:
			return state;
	}
};
