import React, { Component } from "react";
import { Text, StyleSheet, View, TextInput, Button, SafeAreaView } from "react-native";

import { Input } from "react-native-elements";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";
import _ from "lodash";
import { connect } from 'react-redux';
import Loader from "../common/Loader";

class LoginScreen extends Component {

  state = { email: "", password: "", errorMessage: null, loading: false };
  handleLogin = async () => {

    try {
      this.setState({ loading: true });

      const { email, password } = this.state;
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

    } catch (error) {
      this.setState({ errorMessage: error.message, loading: false });
    }
  };

  componentDidUpdate(prevProps, prevState) {

    const { userInfo } = this.props.auth;
    if (this.state.loading && userInfo.email == this.state.email && !_.isEmpty(userInfo)) {
      this.setState({ loading: false });
      if (!global.domain || _.has(this.props, "navigation.state.param.toWelcomeScreen")) {
        this.props.navigation.navigate("welcomeScreen");
      } else {
        this.props.navigation.popToTop();
      }
    }
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>

        <Loader modalVisible={this.state.loading} animationType="fade" />
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

        <TextInput
          placeholder="Password"
          style={styles.containerStyle}
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
          autoCapitalize="none"
          secureTextEntry={true}
          testID="password"
        />

        <View style={{ marginTop: 8 }}>
          <Button title="Login" onPress={this.handleLogin} testID="loginsubmit" />
        </View>

        <View style={{ marginTop: 20 }}>
          <Button title="Forgot Password" onPress={() => this.props.navigation.navigate("forgetpassword")} testID="forgotpasswordnavigate" />
        </View>

        <View style={{ marginTop: 20 }}>
          <Button title="Sign Up" onPress={() => this.props.navigation.navigate("signup")} testID="forgotpasswordnavigate" />
        </View>
      </SafeAreaView>
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

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(LoginScreen);