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
	console.log("Sentry Web Disabled: ", Platform.OS);
} else {
	Sentry.Native.captureMessage("Polo started V" + Constants.manifest.version);
	console.log("Sentry Device:", Platform.OS);
}

export default class App extends Component {
	render() {
		return (
			<ActionSheetProvider>
				<Setup />
			</ActionSheetProvider>
		);
	}
}
