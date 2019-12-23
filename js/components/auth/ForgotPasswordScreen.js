import React, { Component } from "react";
import { Text, StyleSheet, View, TextInput, Button, SafeAreaView, Alert } from "react-native";

import { Input } from "react-native-elements";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";

export default class ForgotPasswordScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Forgot Password",
    headerBackTitle: null,
  });

  state = { email: "", errorMessage: null };


  handleForgotPassword = () => {
    const { email } = this.state;

    const msg = Alert.alert("Forgot Password Submitted", "We'll email instructions on how to reset your password soon.", [
      { text: "OK", onPress: () =>  this.props.navigation.popToTop()}
    ]);
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => msg)
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.errorMessage}</Text>

        <TextInput
          placeholder="Email Address"
          style={styles.containerStyle}
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
          autoCapitalize="none"
          testID="email"
          keyboardType="email-address"
          autoFocus={true}
        />

        <View style={{ marginTop: 8 }}>
          <Button title="Submit" onPress={this.handleForgotPassword} testID="forgotpasswordsubmit" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    padding: 10,
  },

  containerStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d2d2d2",
    backgroundColor: "#ffffff",
    marginVertical: 8,
    color: "black",
    fontSize: 18,
    minHeight: 40,
    paddingHorizontal: 12,
  },
});
