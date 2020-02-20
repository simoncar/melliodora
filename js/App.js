import React, { Component } from "react";
import { Notifications } from "expo";
import Constants from "expo-constants";
import AppNavigator from "./AppNavigator";
import registerForPush from "./lib/registerForPushNotificationsAsync";
import Analytics from "./lib/analytics";

class App extends Component {

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
    Analytics.track("App Started");
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  _handleNotification = ({ origin, data }) => { };

  _registerForPushNotifications() {
    registerForPush.reg(global.name);

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  render() {
    return <AppNavigator {...this.props} />;
  }
}

export default App;
