import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image
} from "react-native";

import { Grid, Col, Row } from "react-native-easy-grid";

import { Container, Content, Text, Button, Icon } from "native-base";
import styles from "./styles";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import { isAdmin } from "../global.js";

const { width } = Dimensions.get("window");

class BeaconItem extends Component {
  constructor(props) {
    super(props);
  }

  renderProfileIcons(beaconType) {
    if (beaconType == "Staff") {
      return (
       <Grid>
       <Row>
       <Col  style={{
           
           width: 45,
           
         }}>
       <View
          style={{
            borderRadius: 30,
            backgroundColor: "#1DAEF2",
            width: 45,
            height: 45,
            marginLeft: 10,
            marginTop: 10,
            alignItems: "center",
            paddingLeft: 0,
            paddingRight: 0,
            justifyContent: "center"
          }}
        >
          <View>
            <AntDesign
              style={{ color: "white", fontSize: 20 }}
              name="phone"
            />
          </View>
        </View>
        </Col>
        <Col  style={{
           
            width: 45,
            paddingLeft: 10,
          }}>
        <View
          style={{
            borderRadius: 30,
            backgroundColor: "#1DAEF2",
            width: 45,
            height: 45,
            marginLeft: 10,
            marginTop: 10,
            
            alignItems: "center",
            paddingLeft: 0,
            paddingRight: 0,
            justifyContent: "center"
          }}
        >
          <View>
            <AntDesign
              style={{ color: "white", fontSize: 20 }}
              name="notification"
            />
          </View>
        </View>
</Col>
</Row>
</Grid>
      );
    }

    if (beaconType == "Asset") {
        return (
          <View
            style={{
              borderRadius: 30,
              backgroundColor: "#1DAEF2",
              width: 45,
              height: 45,
              marginLeft: 10,
              marginTop: 10,
              alignItems: "center",
              paddingLeft: 0,
              paddingRight: 0,
              justifyContent: "center"
            }}
          >
            <View>
              <FontAwesome
                style={{ color: "white", fontSize: 20 }}
                name="wheelchair"
              />
            </View>
          </View>
        );
      }
  }

  render() {
    console.log(this.props.beaconName);

    return (
      <View style={styles.chatRow}>
        <Grid>
          <Row>
            <Col>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  this.props.navigation.navigate("chat", {
                    chatroom: this.props.beaconName,
                    description: "Safeguarding Chat",
                    contact: "",
                    url: this.props.beaconName
                  });
                }}
              >
                <Image
                  style={styles.singleChatItemIcon}
                  source={{ uri: this.props.beaconPictureURL }}
                />

                <View>
                  <Text style={styles.chatTitle}>{this.props.beaconName}</Text>
                  <Text style={styles.chatDescription}>
                    {this.props.beaconType} {this.props.beaconIcon}
                  </Text>
                  <Text style={styles.chatDescription}>
                    {this.props.beaconCampus}
                  </Text>
                </View>
              </TouchableOpacity>
            </Col>
            <Col style={{ width: 110 }}>
              {this.renderProfileIcons(this.props.beaconType)}
            </Col>
          </Row>
        </Grid>
      </View>
    );
  }
}

module.exports = BeaconItem;
