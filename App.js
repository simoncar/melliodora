import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator, LogBox } from "react-native";
import Setup from "./src/setup";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";

import { store, persistor } from "./src/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as ScreenOrientation from 'expo-screen-orientation';

//Sentry.config("https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405").install();

// Sentry.init({
//   dsn: "https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405",
//   enableInExpoDevelopment: true,
//   debug: true,
// });

// Node modules check latest
// npm-check

if (Constants.isDevice) {
	Sentry.init({
		dsn: Constants.manifest.extra.sentryDSN,
		enableInExpoDevelopment: false,
		debug: false,
	});

	//Sentry.captureMessage("App started V" + Constants.manifest.version);

}
export default class App extends Component {
	constructor(props) {
		super(props);
	}



	renderLoading = () => (
		<View style={styles.container}>
			<ActivityIndicator size="large" />
		</View>
	);
	render() {
		//LogBox.ignoreAllLogs()
		// YellowBox.ignoreWarnings(
		// 	["Setting a timer"],
		// 	['Non-serializable values were found in the navigation state']
		// );
		ScreenOrientation.unlockAsync()

		return (
			<Provider store={store}>
				<PersistGate persistor={persistor} loading={this.renderLoading()}>
					<Setup />
				</PersistGate>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		backgroundColor: "#fff",
		flex: 1,
		justifyContent: "center",
	},
});



