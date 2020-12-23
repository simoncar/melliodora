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
import { usePersistedDomainNode } from "./lib/globalState";

export default function Setup() {
	const [loading, setLoading] = useState(true);
	const [domainNode, domainNodeSetter, domainNodeIsUpdated] = usePersistedDomainNode();

	useEffect(() => {
		Firebase.initialise().then(() => console.log("firebase initialized?"));

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
	} else if (domainNode === "") {
		console.log("trigger auth stack navigator");
		return <AuthStackNavigator />;
	} else {
		return <App />;
	}
}
