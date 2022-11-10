import React, { Component } from "react";
import { Platform, StatusBar } from "react-native";
import AppNavigator from "./AppNavigator";
import registerForPush from "./lib/registerForPushNotificationsAsync";
import * as Analytics from "expo-firebase-analytics";

export default class App extends Component {
	componentDidMount() {
		this._registerForPushNotifications();
		Analytics.logEvent("App_Started");
	}

	_registerForPushNotifications() {
		registerForPush.reg(global.name);
	}

	render() {
		return <AppNavigator {...this.props}></AppNavigator>;
	}
}
