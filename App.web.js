import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Setup from "./src/setup";

import { store, persistor } from "./src/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

//Sentry.config("https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405").install();

// Sentry.init({
//   dsn: "https://66ad14c8bc2c452b943fe68dc6b075ae@sentry.io/185405",
//   enableInExpoDevelopment: true,
//   debug: true,
// });

// Node modules check latest
// npm-check


export default class App extends Component {
	constructor(props) {
		super(props);
	}
	renderLoading = () => (
		<View style={styles.container}>
		</View>
	);
	render() {

		// console.disableYellowBox = true;
		// YellowBox.ignoreWarnings(
		// 	["Setting a timer"],
		// 	['Non-serializable values were found in the navigation state']
		// );

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



