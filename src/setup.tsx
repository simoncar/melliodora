import React, { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import App from "./App";
import I18n from "./lib/i18n";
import * as Font from "expo-font";
import _ from "lodash";
import AppLoading from "expo-app-loading";
import Firebase from "./lib/firebase";
import AuthStackNavigator from "./AuthStackNavigator";
import Constants from "expo-constants";
import { connect } from "react-redux";
import { getCommunityDetails } from "./store/community";
import { useDomainP, useAuth, useLogin, useEmail, useUid, useDisplayName, usePhotoURL } from "./lib/globalState";

import * as firebase from "firebase";

export default function Setup() {
	const [loading, setLoading] = useState(true);
	const [domain, domainSetter, domainIsUpdated] = useDomainP();

	const [, setGAuth, gAuth] = useAuth();
	const [, setGLogin, gLogin] = useLogin();
	const [, setGEmail, gEmail] = useEmail();
	const [, setGDisplayName, gDisplayName] = useDisplayName();
	const [, setGPhotoURL, gPhotoURL] = usePhotoURL();
	const [, setGUid, gUid] = useUid();

	useEffect(() => {
		Firebase.initialise().then(() => {
			console.log("firebase initialized?");

			firebase.auth().onAuthStateChanged((user) => {
				let objAuth = {};
				console.log("auth1");
				if (user === null) {
					objAuth = {
						uid: "",
						displayName: "",
						email: "",
						photoURL: "",
					};

					setGLogin(false);
				} else {
					console.log("auth2");
					objAuth = {
						uid: user.uid,
						displayName: user.displayName === null ? "" : user.displayName,
						email: user.email,
						photoURL: user.photoURL === null ? "" : user.photoURL,
					};
					setGLogin(true);
				}

				setGAuth(JSON.stringify(objAuth));
				setGEmail(objAuth.email);
				setGDisplayName(objAuth.displayName);
				setGPhotoURL(objAuth.photoURL);
				setGUid(objAuth.uid);
			});
		});

		Font.loadAsync({
			SegoeUI: require("../resources/segoe-ui.ttf"),
		}).then(() => setLoading(false));

		let language = "en"; //TODO: rebuild
		if (language === "ar") {
			I18nManager.forceRTL(true);
		} else {
			I18nManager.forceRTL(false);
		}
		I18n.locale = language;
	}, []);

	if (loading) {
		return <AppLoading />;
	} else if (domain === "") {
		return <AuthStackNavigator />;
	} else {
		return <App />;
	}
}
