import React, { Component } from "react";
import { Platform, StatusBar, View, StyleSheet } from "react-native";
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

  _handleNotification = ({ origin, data }) => {};

  _registerForPushNotifications() {
    registerForPush.reg(global.name);

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator {...this.props}></AppNavigator>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export default App;
