import React, { useEffect, useState } from "react";
import { I18nManager, LogBox } from "react-native";

import App from "./App";
import I18n from "./lib/i18n";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import Constants from "expo-constants";
import firebase from "./lib/firebase";
import AuthStackNavigator from "./AuthStackNavigator";
import { isDomainAdminServer } from "./lib/APIDomain";
import "firebase/compat/auth";

import { useDomainP, useDomainNameP, useAuth, useLogin, useLanguage, useEmail, useUid, useDisplayName, usePhotoURL, useAdmin } from "./lib/globalState";

export default function Setup() {
	const [loading, setLoading] = useState(true);
	const [domain, setDomain] = useDomainP();
	const [domainName, setDomainName] = useDomainNameP();
	const [language, setLanguage, languageIsUpdated] = useLanguage();
	const [gAuth, setGAuth] = useAuth();
	const [gLogin, setGLogin] = useLogin();
	const [gEmail, setGEmail] = useEmail();
	const [gDisplayName, setGDisplayName] = useDisplayName();
	const [gPhotoURL, setGPhotoURL] = usePhotoURL();
	const [gUid, setGUid] = useUid();
	const [admin, setAdmin] = useAdmin();

	useEffect(() => {
		LogBox.ignoreLogs(["You should try avoid call the same state-setter multiple times at one execution line"]);

		async function loadFonts() {
			await Font.loadAsync({
				SegoeUI: require("../resources/segoe-ui.ttf")
			});
			return "done loading fonts";
		}

		async function initLang() {
			var lang = "en";
			await setLanguage(lang);

			if (lang === "ar") {
				I18nManager.forceRTL(true);
			} else {
				I18nManager.forceRTL(false);
			}
			console.log("Language: ", lang);

			I18n.locale = lang;
			return lang;
		}

		async function initDomain() {
			const domain = Constants.manifest?.extra?.domain;
			const domainName = Constants.manifest?.extra?.domainName;
			if (domain != "") {
				await setDomain(domain);
				await setDomainName(domainName);
			}
			return domain;
		}

		loadFonts()
			.then((ret) => {
				return initLang();
			})
			.then(() => {
				return initDomain();
			})
			.then(() => {
				const auth = firebase.auth();
				//const user = auth.currentUser;

				auth.onAuthStateChanged((user) => {
					let objAuth = {};
					if (user) {
						// User is signed in, see docs for a list of available properties
						// https://firebase.google.com/docs/reference/js/firebase.User
						const uid = user.uid;
						// ...
						objAuth = {
							uid: user.uid,
							displayName: user.displayName === null ? "" : user.displayName,
							email: user.email,
							photoURL: user.photoURL === null ? "" : user.photoURL
						};
						setGLogin(true);

						setGAuth(JSON.stringify(objAuth));
						setGEmail(objAuth.email);
						setGDisplayName(objAuth.displayName);
						setGPhotoURL(objAuth.photoURL);
						setGUid(objAuth.uid);

						return setLoading(false);
					} else {
						// User is signed out
						// ...

						if (user === null) {
							// user has not logged in, so create an anonymous account and log them in
							auth
								.signInAnonymously(auth)
								.then(() => {
									objAuth = {
										uid: "",
										displayName: "",
										email: "",
										photoURL: "",
										login: false
									};
									setGLogin(false);

									setGAuth(JSON.stringify(objAuth));
									setGEmail(objAuth.email);
									setGDisplayName(objAuth.displayName);
									setGPhotoURL(objAuth.photoURL);
									setGUid(objAuth.uid);

									return setLoading(false);
								})
								.catch((error) => {
									console.log("login anon error:", error.message);
								});
						}
					}
				});
			});
	}, []);

	useEffect(() => {
		isDomainAdminServer(gUid, domain).then((xxx) => {
			setAdmin(xxx);
		});
	}, [domain, gUid]);

	if (loading) {
		return <AppLoading />;
	} else if (domain === "") {
		return <AuthStackNavigator />;
	} else {
		return <App />;
	}
}
