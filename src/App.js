import React, { Component } from "react";
import { Platform, StatusBar, View, StyleSheet } from "react-native";
import { Notifications } from "expo";

import AppNavigator from "./AppNavigator";
import registerForPush from "./lib/registerForPushNotificationsAsync";
import Analytics from "./lib/analytics";
import Constants from "expo-constants";
import { connect } from "react-redux";
import { getCommunityDetails } from "./store/community";
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';

class App extends Component {
	componentDidMount() {
		this._registerForPushNotifications();
		Analytics.track("App Started");
	}

	componentWillUnmount() {
		this._notificationSubscription.remove();
	}

	_handleNotification = ({ origin, data }) => { };

	_registerForPushNotifications() {
		registerForPush.reg(global.name);

		this._notificationSubscription = Notifications.addListener(
			this._handleNotification
		);
	}

	render() {
		return (
			<AppearanceProvider>
				{Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
				<AppNavigator {...this.props}></AppNavigator>
			</AppearanceProvider>
		);
	}
}

const mapStateToProps = (state) => ({
	community: state.community,
});
export default connect(mapStateToProps)(App);
