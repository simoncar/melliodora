import React, { Component } from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";

import { Text, Button, Icon } from "native-base";
import styles from "./styles";

class ChatroomItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.chatRow}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => {
            this.props.navigation.navigate("chat", {
              chatroom: this.props.title,
              description: this.props.description,
              contact: this.props.contact,
              url: this.props.url
            });
          }}
        >
          <Button
            transparent
            style={styles.roundedButton}
            onPress={() => {
              this.props.navigation.navigate("chat", {
                chatroom: this.props.title,
                description: this.props.description,
                contact: this.props.contact,
                url: this.props.url
              });
            }}
          >
            <Icon style={styles.icon} name="ios-chatbubbles" />
          </Button>

          <View>
            <Text style={styles.chatTitle}>{this.props.title}</Text>
            <Text style={styles.chatTitle}>{this.props.latestUser}</Text>
            <Text style={styles.chatTitle}>{this.props.latestText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = ChatroomItem;
