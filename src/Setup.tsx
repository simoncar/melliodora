import React, { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import App from "./App";
import I18n from "./lib/i18n";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import firebase from "./lib/firebase";
import AuthStackNavigator from "./AuthStackNavigator";
import { isDomainAdminServer } from "./lib/APIDomain";


import {
	useDomainP,
	useAuth,
	useLogin,
	useLanguage,
	useEmail,
	useUid,
	useDisplayName,
	usePhotoURL,
	useAdmin,
} from "./lib/globalState";
import * as Localization from "expo-localization";


export default function Setup() {
	const [loading, setLoading] = useState(true);
	const [domain, domainSetter, domainIsUpdated] = useDomainP();
	const [refreshLanguage, setLanguage, language, languageIsUpdated] = useLanguage();
	const [, setGAuth, gAuth] = useAuth();
	const [, setGLogin, gLogin] = useLogin();
	const [, setGEmail, gEmail] = useEmail();
	const [, setGDisplayName, gDisplayName] = useDisplayName();
	const [, setGPhotoURL, gPhotoURL] = usePhotoURL();
	const [, setGUid, gUid] = useUid();
	const [, setAdmin, admin] = useAdmin();

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
				console.log("firebase initialized");

				firebase.auth().onAuthStateChanged((user) => {
					let objAuth = {};
					if (user === null) {
						console.log("auth state changed 1 - not logged in - no UID");

						objAuth = {
							uid: "",
							displayName: "",
							email: "",
							photoURL: "",
						};
						setGLogin(false);
					} else {
						console.log("auth state changed 2:", user.uid);
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

					return setLoading(false);
				});
			});
	}, []);

	useEffect(() => {
		console.log("domain set useEffect", domain, gUid);
		isDomainAdminServer(gUid, domain).then((xxx) => {
			console.log("X:", xxx);
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
