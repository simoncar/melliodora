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
import {
	useDomainP,
	useAuth,
	useLogin,
	useLanguage,
	useEmail,
	useUid,
	useDisplayName,
	usePhotoURL,
} from "./lib/globalState";
import * as Localization from "expo-localization";

import * as firebase from "firebase";
import { removePushTokenSubscription } from "expo-notifications";

export default function Setup() {
	const [loading, setLoading] = useState(true);
	const [domain, domainSetter, domainIsUpdated] = useDomainP();
	//const [language, setLanguage, languageIsUpdated] = useLanguageP();
	const [refreshLanguage, setLanguage, language, languageIsUpdated] = useLanguage();

	const [, setGAuth, gAuth] = useAuth();
	const [, setGLogin, gLogin] = useLogin();
	const [, setGEmail, gEmail] = useEmail();
	const [, setGDisplayName, gDisplayName] = useDisplayName();
	const [, setGPhotoURL, gPhotoURL] = usePhotoURL();
	const [, setGUid, gUid] = useUid();

	useEffect(() => {
		async function loadFonts() {
			console.log(" ---- load fonts ----");
			await Font.loadAsync({
				SegoeUI: require("../resources/segoe-ui.ttf"),
			});
			return "done loading fonts";
		}

		async function loadLanguage() {
			return refreshLanguage();
		}

		async function initLang(inLang) {
			var lang = inLang;
			console.log("Localization:", Localization.locale);
			if (lang === "") {
				lang = "zh";

				await setLanguage(lang);
			}

			if (lang === "ar") {
				I18nManager.forceRTL(true);
			} else {
				I18nManager.forceRTL(false);
			}
			I18n.locale = lang;

			return lang;
		}

		loadFonts()
			.then((ret) => {
				console.log("done fonts:", ret);
				return loadLanguage();
			})
			.then((ret) => {
				return initLang(ret);
			})

			.then((ret) => {
				console.log("set loading done:", ret);
				return setLoading(false);
			});

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
	}, []);

	if (loading) {
		return <AppLoading />;
	} else if (domain === "") {
		return <AuthStackNavigator />;
	} else {
		return <App />;
	}
}
