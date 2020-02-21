import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from "firebase";

export default class WelcomeScreen extends Component {

  componentDidMount() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser || currentUser.isAnonymous) {
      return this.props.navigation.pop();
    }

    const { uid, email } = currentUser;
    console.log({ uid, email });

    //get user details from firestore

  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> textInComponent </Text>
      </View>
    )
  }
}
