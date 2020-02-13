import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Switch } from "react-native";
import * as firebase from "firebase";
import { Button } from "react-native-elements";
import { SimpleLineIcons, Entypo, MaterialIcons } from "@expo/vector-icons";

export default class chatTitle extends Component {
  static navigationOptions = {
    title: "Edit",
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      chatroomTitle: this.props.navigation.getParam("title"),
      type: this.props.navigation.getParam("type")
    };
  }

  _setChatroomTitle(title) {
    this.setState({ chatroomTitle: title });
  }

  _saveChatroom() {
    var dict = {
      title: this.state.chatroomTitle,
      type: this.state.interestGroupOnly ? "interestGroup" : "user"
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
    console.log("ChatTitle go back");
    this.props.navigation.goBack(null);
    this.props.navigation.state.params.onGoBack({ title: this.state.chatroomTitle });
  }

  _hideChatroom() {
    var dict = {
      visible: false,
    };
    console.log("hiding");
    firebase
      .firestore()
      .collection(global.domain)
      .doc("chat")
      .collection("chatrooms")
      .doc(this.props.navigation.getParam("chatroom"))
      .set(dict, { merge: true });

    this.props.navigation.navigate("chatRooms");
  }

  _goback() {
    const { goBack } = this.props.navigation;
    setTimeout(function () {
      goBack();
    }, 1500);
    goBack();
  }

  _closeHideButton() {
    console.log(this.state.type);
    if (["user", "private", "interestGroup"].indexOf(this.state.type) > -1) {
      return (
        <Button
          icon={<MaterialIcons name="delete" size={25} color="white" />}
          title="Close/Hide Chat Group"
          style={styles.button}
          onPress={() => this._hideChatroom()}
        />
      );
    } else {
      return;
    }
  }

  render() {
    return (
      <View style={styles.padding}>
        <View style={{ flexDirection: "column" }}>
          <View style={styles.subjectRow}>
            <Text style={styles.title}>Subject:</Text>
            <TextInput
              style={styles.titleField}
              onChangeText={text => this._setChatroomTitle(text)}
              autoCapitalize="words"
              autoFocus={true}
              placeholder={this.state.chatroomTitle}
              value={this.state.chatroomTitle}
            />
          </View>

          <View style={styles.subjectRow}>
            <Text style={styles.title}>Interest Group Only:</Text>
            <Switch
              style={{ marginLeft: 12 }}
              onValueChange={(value) => this.setState({ interestGroupOnly: value })}
              value={this.state.interestGroupOnly} />
          </View>
        </View>
        <Button title="Save" style={styles.button} onPress={() => this._saveChatroom()} />

        {this._closeHideButton()}
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

  subjectRow: {
    flexDirection: "row"
  },
  title: {
    flex: 0,
    fontSize: 22,
  },
  titleField: {
    flex: 1,
    paddingLeft: 20,
    fontSize: 22,
  },

  button: {
    paddingTop: 20,
    paddingBottom: 20,
  },
});
