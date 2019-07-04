"use strict";
import React, { Component } from "react";

import { StyleSheet, View, TextInput, Text } from "react-native";
import * as Localization from "expo-localization";
import { AsyncStorage } from "react-native";

class adminPassword extends Component {
  static navigationOptions = {
    title: "Admin Password",
    headerBackTitle: null
  };

  constructor(props) {
    super(props);
    this.state = {
      adminPassword: "placeholder",
      adminPasswordCorrect: "Password Incorrect",
      restartMessage: ""
    };

    this._retrieveAdminPassword();
  }

  _retrieveAdminPassword = async () => {
    try {
      const value = await AsyncStorage.getItem("adminPassword");
      if (value !== null) {
        // We have data!!
        console.log(value);
        if (value == "cookies") {
          this.setState({ adminPasswordCorrect: "Password Correct!" });
        }
        this.setState({ adminPassword: value });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  _setAdminPassword(adminPassword) {
    console.log(adminPassword);
    this.setState({ adminPassword: adminPassword });
    if (adminPassword == "cookies") {
      this.setState({ adminPasswordCorrect: "Password Correct!" });
      this.setState({ restartMessage: "Please Restart App to Apply" });
    } else {
      this.setState({ adminPasswordCorrect: "Password Incorrect!" });
    }
    global.adminPassword = adminPassword;
    AsyncStorage.setItem("adminPassword", adminPassword);
  }

  render() {
    return (
      <View style={styles.padding}>
        <Text style={styles.title}>Enter the Admin Password:</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            paddingLeft: 10
          }}
          placeholder={this.state.adminPassword}
          onChangeText={text => this._setAdminPassword(text)}
          autoCapitalize="none"
          value={this.state.text}
        />
        <Text style={styles.alert}>{this.state.adminPasswordCorrect}</Text>
        <Text style={styles.alert}>{this.state.restartMessage}</Text>
      </View>
    );
  }
  toggleAuthView() {
    this.setState({ toggleAuthView: !this.state.toggleAuthView });
  }
  onValueChange(value) {
    this.setState({ switchValue: value });
  }
}

const styles = StyleSheet.create({
  padding: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#8e8e93"
  },
  title: {
    paddingBottom: 16
  },
  alert: {
    paddingTop: 16
  }
});

module.exports = adminPassword;
