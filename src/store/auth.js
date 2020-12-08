import firebase from "firebase";
import { call, put, takeLatest, select, take, delay, takeLeading } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import _ from "lodash";
import Constants from "expo-constants";
import * as Localization from "expo-localization";
import * as Analytics from 'expo-firebase-analytics';
import * as Updates from 'expo-updates'

// ACTIONS
export const SET_USER_INFO = "SET_USER_INFO";
export const CHECK_ADMIN = "CHECK_ADMIN";
export const SET_IS_ADMIN = "SET_IS_ADMIN";
export const SET_ADMIN_PASS = "SET_ADMIN_PASS";
export const SETUP_AUTH = "SETUP_AUTH";
export const ANONYMOUSLY_SIGN_IN = "ANONYMOUSLY_SIGN_IN";
export const INIT_USER = "INIT_USER";
export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";
export const SET_LANGUAGE = "SET_LANGUAGE";

// Action Creators
export const setUserInfo = (userInfo, updateDB = false) => {
	if (updateDB) {
		firebase
			.firestore()
			.collection("users")
			.doc(userInfo.uid)
			.set(userInfo, { merge: true });
	}
	return {
		type: SET_USER_INFO,
		userInfo,
	};
};

export const checkAdmin = () => ({
	type: CHECK_ADMIN,
});

export const setIsAdmin = (isAdmin) => ({
	type: SET_IS_ADMIN,
	isAdmin,
});

export const setAdminPass = (adminPassword) => ({
	type: SET_ADMIN_PASS,
	adminPassword,
});

export const setupAuth = () => ({
	type: SETUP_AUTH,
});
export const signInAnonymously = () => ({
	type: ANONYMOUSLY_SIGN_IN,
});

export const initUser = (user, isAnonymous) => ({
	type: INIT_USER,
	user,
	isAnonymous,
});

export const changeLanguage = (language) => ({
	type: CHANGE_LANGUAGE,
	language,
});

export const setLanguage = (language) => ({
	type: SET_LANGUAGE,
	language,
});


const _anonymouslySignIn = () => {
	return firebase.auth().signInAnonymously();
};

// worker Saga
function* WORKER_checkAdmin(action) {
	const adminPassword = yield select((state) => state.auth.adminPassword);
	global.adminPassword = adminPassword;

	if (adminPassword == global.admin_password) {
		yield put(setIsAdmin(true));
		return;
	}

	const adminUIDs = yield select((state) => state.community.selectedCommunity.admins);
	const userUID = yield select((state) => state.auth.userInfo.uid);

	if (Array.isArray(adminUIDs) && adminUIDs.indexOf(userUID) > -1) {
		yield put(setIsAdmin(true));
	} else {
		yield put(setIsAdmin(false));
	}
}

function* WORKER_authListener() {
	// #1
	const channel = new eventChannel((emiter) => {
		const listener = firebase.auth().onAuthStateChanged((user) => {

			if (__DEV__) {
				console.log('Development');
				Analytics.setDebugModeEnabled(false)
					.catch(error => {
						console.log('Analytics.DEV.setDebugModeEnabled Error', error);
					})

			} else {
				console.log('Production');
				Analytics.setDebugModeEnabled(false)
					.catch(error => {
						console.log('Analytics.setDebugModeEnabled Error', error);
						//just ignore for now
					})
				if (user.uid) {
					Analytics.setUserId(user.uid)
						.catch(error => {
							console.log('Analytics.setUserId Error', error);
						})
				} else {
					console.log("Analytics User ID is null so skipping");

				}

			}

			if (!user) {
				emiter({ data: { noUser: true } });
			} else {
				const isAnonymous = user.isAnonymous;
				emiter({ data: { user, isAnonymous } });
			}
		});

		// #2
		return () => {
			listener.off();
		};
	});

	// #3
	while (true) {
		const { data } = yield take(channel);
		if (data.noUser) {
			yield put(signInAnonymously());
		} else {
			const { user, isAnonymous } = data;
			yield put(initUser(user, isAnonymous));
		}
	}
}

function* WORKER_anonymouslySignIn() {
	console.log("WORKER_anonymouslySignIn")
	try {
		yield call(_anonymouslySignIn);
		yield put(checkAdmin());
	} catch (e) {
		console.log(e);
	}
}

function* WORKER_initUser(action) {
	try {
		const { user, isAnonymous } = action;

		const uid = user.uid;

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

		const language = yield select((state) => state.auth.language);

		var version = _.isNil(Constants.manifest.revisionId) ? "unknown" : Constants.manifest.revisionId;
		var userDict = {
			token,
			safeToken,
			loginCount: firebase.firestore.FieldValue.increment(1),
			languageSelected: language,
			phoneLocale: Localization.locale,
			version: version,
			lastLogin: Date.now(),
			isAnonymous,
		};

		yield call(() => firebase.firestore().collection("users").doc(uid).set(userDict, { merge: true }));

		const doc = yield call(() => firebase.firestore().collection("users").doc(uid).get());

		if (doc.exists) {
			const docData = doc.data();

			global.userInfo = docData;
			yield put(setUserInfo(docData));
		}

		yield put(checkAdmin());
	} catch (e) {
		console.log(e);
	}
}
function* WORKER_changeLanguage(action) {
	const language = action.language;
	yield call(() => Analytics.logEvent("Language", { language: language }));
	yield put(setLanguage(language));

	while (true) {
		const next = yield select(languageState);
		if (next === language) {
			yield reloadApp();
			break;
		}
	}
}

function* reloadApp() {
	yield delay(1000);
	Updates.reloadAsync();
}

const languageState = (state) => state.auth.language;
//  Watcher
export function* authSaga() {
	yield takeLatest(CHECK_ADMIN, WORKER_checkAdmin);
	yield takeLatest(ANONYMOUSLY_SIGN_IN, WORKER_anonymouslySignIn);
	yield takeLatest(INIT_USER, WORKER_initUser);
	yield takeLatest(CHANGE_LANGUAGE, WORKER_changeLanguage);
	yield takeLeading("FIREBASE_READY", WORKER_authListener);
}

const initialState = {
	user: false,
	userInfo: {},
	isAdmin: false,
	adminPassword: "",
	language: "en",
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
		case SET_LANGUAGE:
			return {
				...state,
				language: action.language,
			};
		default:
			return state;
	}
};
