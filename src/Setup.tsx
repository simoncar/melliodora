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

import {
	useDomainP,
	useDomainNameP,
	useAuth,
	useLogin,
	useLanguage,
	useEmail,
	useUid,
	useDisplayName,
	usePhotoURL,
	useAdmin,
} from "./lib/globalState";

export default function Setup() {
	const [loading, setLoading] = useState(true);
	const [domain, setDomain] = useDomainP();
	const [domainName, setDomainName] = useDomainNameP();
	const [refreshLanguage, setLanguage, language, languageIsUpdated] = useLanguage();
	const [, setGAuth, gAuth] = useAuth();
	const [, setGLogin, gLogin] = useLogin();
	const [, setGEmail, gEmail] = useEmail();
	const [, setGDisplayName, gDisplayName] = useDisplayName();
	const [, setGPhotoURL, gPhotoURL] = usePhotoURL();
	const [, setGUid, gUid] = useUid();
	const [, setAdmin, admin] = useAdmin();

	useEffect(() => {
		LogBox.ignoreLogs(["You should try avoid call the same state-setter multiple times at one execution line"]);

		async function loadFonts() {
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
			if (lang === "") {
				lang = "en";
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

		async function initDomain() {
			const domain = Constants.manifest.extra.domain;
			const domainName = Constants.manifest.extra.domainName;
			if (domain != "") {
				await setDomain(domain);
				await setDomainName(domainName);
			}
			return domain;
		}

		loadFonts()
			.then(() => {
				return loadLanguage();
			})
			.then((ret) => {
				return initLang(ret);
			})
			.then(() => {
				return initDomain();
			})
			.then(() => {
				var user = firebase.auth().currentUser;

				firebase.auth().onAuthStateChanged((user) => {
					let objAuth = {};
					if (user === null) {
						// user has not logged in, so create an anonymous account and log them in
						firebase
							.auth()
							.signInAnonymously()
							.then(() => {
								objAuth = {
									uid: "",
									displayName: "",
									email: "",
									photoURL: "",
									login: false,
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
					} else {
						objAuth = {
							uid: user.uid,
							displayName: user.displayName === null ? "" : user.displayName,
							email: user.email,
							photoURL: user.photoURL === null ? "" : user.photoURL,
						};
						setGLogin(true);

						setGAuth(JSON.stringify(objAuth));
						setGEmail(objAuth.email);
						setGDisplayName(objAuth.displayName);
						setGPhotoURL(objAuth.photoURL);
						setGUid(objAuth.uid);

						return setLoading(false);
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
