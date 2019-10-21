import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from "react-native";
import * as firebase from "firebase";

export default class chatTitle extends Component {
  static navigationOptions = {
    title: "Edit",
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      chatroomTitle: this.props.navigation.getParam("title"),
    };
  }

  _setChatroomTitle(title) {
    this.setState({ chatroomTitle: title });
  }

  _saveChatroom() {
    var dict = {
      title: this.state.chatroomTitle,
      type: "public",
    };

    var edit = this.props.navigation.getParam("edit");

    if (edit == true) {
      firebase
        .firestore()
        .collection(global.domain)
        .doc("chat")
        .collection("chatrooms")
        .doc(this.props.navigation.getParam("chatroom"))
        .set(dict, { merge: true });
    } else {
      firebase
        .firestore()
        .collection(global.domain)
        .doc("chat")
        .collection("chatrooms")
        .add(dict);
    }
  }

  render() {
    return (
      <View style={styles.padding}>
        <Text style={styles.title}>Chatroom Subject:</Text>
        <TextInput
          style={styles.passwordField}
          onChangeText={text => this._setChatroomTitle(text)}
          autoCapitalize="none"
          placeholder={this.state.chatroomTitle}
          value={this.state.chatroomTitle}
        />

        <TouchableOpacity onPress={() => this._saveChatroom()}>
          <Text style={styles.alertRestart}>Save</Text>
        </TouchableOpacity>
      </View>
    );
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
