import React, { Component } from "react";
import { Platform } from "react-native";
import Setup from "./src/Setup";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

Sentry.init({
	dsn: Constants.manifest.extra.sentryDSN,
	enableInExpoDevelopment: false,
	debug: false,
});

if (Platform.OS === "web") {
	Sentry.Browser.captureMessage("Polo started V" + Constants.manifest.version);
	console.log("Sentry Web: ", Platform.OS);
} else {
	Sentry.Native.captureMessage("Polo started V" + Constants.manifest.version);
	console.log("Sentry Device:", Platform.OS);
}

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ActionSheetProvider>
				<Setup />
			</ActionSheetProvider>
		);
	}
}
