import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Button } from "native-base";
import { SimpleLineIcons, Entypo } from "@expo/vector-icons";
import { Image } from "react-native-expo-image-cache";
import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";

const preview = {
  uri:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABaCAMAAAC4y0kXAAAAA1BMVEX///+nxBvIAAAAIElEQVRoge3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAPBgKBQAASc1kqgAAAAASUVORK5CYII=",
};
const uri =
  "https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/random%2F201908%2FchatIcon.png?alt=media&token=c5667f8f-efc9-48f6-91a8-5cf57e856505";

class ChatroomItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("this.props.members", this.props);
    return (
      <View style={styles.newsContentLine}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("chat", {
              chatroom: this.props.chatroom,
              title: this.props.title,
              description: this.props.description,
              contact: this.props.contact,
              url: this.props.url,
              language: this.props.language,
              type: this.props.type,
              members: this.props.members
            });
          }}
        >
          <View style={styles.rowView}>
            <SimpleLineIcons style={styles.iconLeft} name="bubbles" />
            <Text style={styles.chatTitle}>{this.props.title}</Text>
            <Entypo style={styles.iconRight} name="chevron-right" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = ChatroomItem;
