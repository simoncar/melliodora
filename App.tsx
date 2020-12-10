import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import Setup from "./src/setup";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";

import { store, persistor } from "./src/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as ScreenOrientation from 'expo-screen-orientation';

Sentry.init({
	dsn: Constants.manifest.extra.sentryDSN,
	enableInExpoDevelopment: false,
	debug: false,
});


if (Platform.OS === 'web') {
	Sentry.Browser.captureMessage("App started V" + Constants.manifest.version);
	console.log("Sentry Web: ", Platform.OS)
} else {
	Sentry.Native.captureMessage("App started V" + Constants.manifest.version);
	console.log("Sentry Device:", Platform.OS)
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



