import React, { Component } from "react";
import { Image, View } from "react-native";
import { Icon, Button, Left, Right, Body, Header, Text } from "native-base";

import styles from "./styles";

class Abbreviations extends Component {


  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Text style={styles.eventTitle}>{this.props.content}</Text>
      </View>
    );
  }
}

export default Abbreviations;
