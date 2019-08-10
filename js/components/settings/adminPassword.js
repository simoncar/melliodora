import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, AsyncStorage } from "react-native";
import { Updates } from "expo";

export default class adminPassword extends Component {
  static navigationOptions = {
    title: "Admin Password",
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      adminPassword: "enter password",
      adminPasswordCorrect: "",
      restartMessage: "",
    };

    this._retrieveAdminPassword();
  }

  _retrieveAdminPassword = async () => {
    try {
      const value = await AsyncStorage.getItem("adminPassword");
      if (value !== null) {
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
    this.setState({ adminPassword: adminPassword });
    if (adminPassword == "cookies") {
      this.setState({ adminPasswordCorrect: "Password Correct!" });
      this.setState({ restartMessage: "Click to Restart in Admin Mode" });

      global.adminPassword = adminPassword;
      AsyncStorage.setItem("adminPassword", adminPassword);
    } else {
      this.setState({ adminPasswordCorrect: "" });
    }
  }

  render() {
    return (
      <View style={styles.padding}>
        <Text style={styles.title}>Enter the Admin Password:</Text>
        <TextInput
          style={styles.passwordField}
          onChangeText={text => this._setAdminPassword(text)}
          autoCapitalize="none"
        />
        <Text style={styles.alert}>{this.state.adminPasswordCorrect}</Text>

        <TouchableOpacity onPress={() => Updates.reloadFromCache()}>
          <Text style={styles.alertRestart}>{this.state.restartMessage}</Text>
        </TouchableOpacity>
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
    color: "#8e8e93",
  },
  title: {
    paddingBottom: 16,
  },
  alert: {
    paddingTop: 16,
  },
  alertRestart: {
    paddingTop: 16,
    color: "red",
  },
  passwordField: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
  },
});
