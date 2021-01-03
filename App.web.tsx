import React, { Component } from "react";
import Setup from "./src/Setup";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

//Sentry.config("https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405").install();

// Sentry.init({
//   dsn: "https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405",
//   enableInExpoDevelopment: true,
//   debug: true,
// });

// Node modules check latest
// npm-check

export default class App extends Component {
	render() {
		return (
			<ActionSheetProvider>
				<Setup />
			</ActionSheetProvider>
		);
	}
}
