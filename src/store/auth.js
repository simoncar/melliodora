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
	const channel = new eventChannel((emitter) => {
		const listener = firebase.auth().onAuthStateChanged((user) => {
			console.log("onAuthStateChanged:", user)
			if (!user) {
				emitter({ data: { noUser: true } });
			} else {
				console.log("eventChannel emitter:", user)
				const isAnonymous = user.isAnonymous;
				emitter({ data: { user, isAnonymous } });
			}
		});

		// #2
		return () => {
			listener.off();
			console.log("listener off");
		};
	});

	// #3
	while (true) {
		const { data } = yield take(channel);
		if (data.noUser) {
			yield put(signInAnonymously());
		} else {
			const { user, isAnonymous } = data;
			console.log("init user:", user)
			yield put(initUser(user, isAnonymous));
		}
	}
}

function* WORKER_anonymouslySignIn() {
	yield call(_anonymouslySignIn);
	yield put(checkAdmin());
}

function* WORKER_initUser(action) {
	try {

		console.log("WORKER_initUser");
		const { user, isAnonymous } = action;
		const uid = user.uid;

		global.uid = uid;

		var token = _.isNil(global.pushToken) ? "" : global.pushToken
		var safeToken = (_.isNil(safeToken)) ? "" : global.safeToken;

		const language = yield select((state) => state.auth.language);

		var version = _.isNil(Constants.manifest.revisionId) ? "unknown" : Constants.manifest.revisionId;
		var userDict = {
			token,
			safeToken,
			loginCount: firebase.firestore.FieldValue.increment(1),
			languageSelected: language,
			phoneLocale: Localization.locale,
			version: version,
			lastLogin: firebase.firestore.Timestamp.now(),
			isAnonymous,
		};

		yield call(() => {
			try {
				console.log("WORKER_initUser - firebase - set");
				firebase
					.firestore()
					.collection("users")
					.doc(uid)
					.set(userDict, { merge: true })
					.then(() => {
						console.log("WORKER_initUser - get");
						firebase
							.firestore()
							.collection("users")
							.doc(uid)
							.get()
							.then(function (doc) {
								if (doc.exists) {
									const docData = doc.data();
									console.log("WORKER_initUser - doc:", doc.data());

									global.userInfo = docData;
									put(setUserInfo(docData));
								} else {
									console.log("doc does not exist")
								}
								put(checkAdmin());
							})

					})
			} catch (error) {
				console.log("auth yield call set User Dic:", error)
			}

		});



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
