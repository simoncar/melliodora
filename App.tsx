import React, { Component } from "react";
import { Platform } from "react-native";
import Setup from "./src/Setup";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

Sentry.init({
	dsn: "https://f9cb9202827e4dbb8097c8e98f024d68@o85126.ingest.sentry.io/5564952",
	enableInExpoDevelopment: false,
	debug: false
});

if (Platform.OS === "web") {
	//console.log("Sentry Web Disabled: ", Platform.OS);
} else {
	Sentry.Native.captureMessage("Polo started V" + Constants.manifest.version);
	console.log("Sentry Device:", Platform.OS, JSON.stringify(Constants.manifest?.extra));
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
