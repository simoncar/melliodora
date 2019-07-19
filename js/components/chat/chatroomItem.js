import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";

import { Text, Button } from "native-base";
import { Ionicons, Entypo, Octicons } from "@expo/vector-icons";
import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";

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
            chatroom: this.props.title,
            description: this.props.description,
            contact: this.props.contact,
            url: this.props.url,
          });
        }}
      >
        <Grid>
          <Col>
            <View style={{ flexDirection: "row" }}>
              <Button
                transparent
                style={styles.roundedButton}
                onPress={() => {
                  this.props.navigation.navigate("chat", {
                    chatroom: this.props.title,
                    description: this.props.description,
                    contact: this.props.contact,
                    url: this.props.url,
                    language: this.props.language,
                  });
                }}
              >
                <Ionicons style={styles.icon} name="ios-chatbubbles" />
              </Button>

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
