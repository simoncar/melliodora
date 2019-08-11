import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Button } from "native-base";
import { Ionicons, Entypo, Octicons } from "@expo/vector-icons";
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
    return (
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => {
          this.props.navigation.navigate("chat", {
            chatroom: this.props.chatroom,
            title: this.props.title,
            description: this.props.description,
            contact: this.props.contact,
            url: this.props.url,
            language: this.props.language,
          });
        }}
      >
        <Grid>
          <Col>
            <View style={{ paddingLeft: 10, flexDirection: "row" }}>
              <Image
                style={{ width: 70, height: 70, borderRadius: 70 / 2 }}
                {...{ preview, uri }}
                resizeMode={"contain"}
              />

              <View>
                <Text style={styles.chatTitle}>{this.props.title}</Text>
                <Text style={styles.chatTitle}>{this.props.latestUser}</Text>
                <Text style={styles.chatTitle}>{this.props.latestText}</Text>
              </View>
            </View>
          </Col>
          <Col
            style={{
              width: 65,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Octicons style={styles.iconRight} name="mute" />
              <Entypo style={styles.iconRight} name="chevron-right" />
            </View>
          </Col>
        </Grid>
      </TouchableOpacity>
    );
  }
}

module.exports = ChatroomItem;
